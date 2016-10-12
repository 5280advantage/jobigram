(function () {
    'use strict';

    angular.module('ion-photo').factory('PhotoService', PhotoServiceFactory);

    function PhotoServiceFactory($ionicActionSheet, $cordovaCapture, User,  $cordovaCamera, $translate, $cordovaActionSheet, $jrCrop, $rootScope, $ionicModal, ActionSheet, $q) {

        var deviceInformation = ionic.Platform.device();
        var isIOS             = ionic.Platform.isIOS();

        console.log('isIOS', isIOS);

        // Default Setting
        var tempImage;
        var cordova = window.cordova;
        var setting = {
            jrCrop            : false,
            quality           : 90,
            allowEdit         : true,
            filter            : true,
            correctOrientation: true,
            targetWidth       : 640,
            targetHeight      : 640,
            saveToPhotoAlbum  : false,
            allowRotation     : true,
            aspectRatio       : 0
        };


        return {
            open     : openModal,
            crop     : cropModal,
            modalPost: modalPost,
        };

        function openModal(setOptions) {
            var defer = $q.defer();
            console.log(deviceInformation);

            // Change Settings
            if (setOptions) {
                Object.keys(setOptions).map(function (key, index) {
                    setting[key] = setOptions[key];
                });

                console.log(setting);
            }

            var options = {
                quality           : setting.quality,
                aspectRatio       : setting.aspectRatio,
                allowRotation     : setting.allowRotation,
                allowEdit         : setting.allowEdit,
                correctOrientation: setting.correctOrientation,
                targetWidth       : setting.targetWidth,
                targetHeight      : setting.targetHeight,
                saveToPhotoAlbum  : setting.saveToPhotoAlbum,
                destinationType   : window.cordova ? Camera.DestinationType.DATA_URL : null,
                encodingType      : window.cordova ? Camera.EncodingType.JPEG : null,
                popoverOptions    : window.cordova ? CameraPopoverOptions : null,
            };

            image().then(function (index) {
                console.log(index);
                capture(index - 1, options)
                    .then(cropModal)
                    .then(defer.resolve)
                    .catch(function (resp) {
                        console.log(resp);
                    });
            })

            return defer.promise;
        }

        function cropModal(image) {
            var defer = $q.defer();
            if (window.cordova) {
                image = 'data:image/jpeg;base64,' + image;
            }

            if (setting.jrCrop ) {
                $jrCrop.crop({
                    url          : image,
                    aspectRatio  : 1,
                    allowRotation: setting.allowRotation,
                    width        : setting.targetWidth,
                    height       : setting.targetHeight,
                    cancelText   : $translate.instant('cancel'),
                    chooseText   : $translate.instant('submit')
                }).then(function (canvas) {
                    defer.resolve(canvas.toDataURL());
                }).catch(defer.reject);
            } else {
                defer.resolve(image);
            }

            return defer.promise;
        }

        function image() {
            var defer = $q.defer();
            show({
                title     : $translate.instant('choseOption'),
                cancelText: $translate.instant('cancel'),
                options   : [
                    {text: $translate.instant('photo')},
                    {text: $translate.instant('library')}
                ]
            }).then(function (option) {
                defer.resolve(option);
            }).then(defer.resolve).catch(defer.reject);

            return defer.promise;
        }

        function show(params) {
            var defer = $q.defer();

            if (window.cordova) {
                var options = {
                    title                    : params.title,
                    buttonLabels             : _.map(params.options, function (item) {return item.text}),
                    addCancelButtonWithLabel : params.cancelText,
                    androidEnableCancelButton: true,
                    androidTheme             : window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
                };

                $cordovaActionSheet.show(options).then(function (btnIndex) {
                    if (btnIndex !== 3) {
                        defer.resolve(btnIndex);
                    }
                    defer.reject('cancel');
                });

            } else {
                var actionSheet = $ionicActionSheet.show({
                    buttons      : params.options,
                    titleText    : params.title,
                    cancelText   : params.cancelText,
                    cancel       : function () {
                        actionSheet();
                    },
                    buttonClicked: function (btnIndex) {
                        actionSheet();
                        if (btnIndex !== 3) {
                            defer.resolve(btnIndex);
                        }
                        defer.reject('cancel');
                    }
                });

            }
            return defer.promise;
        }

        function capture(type, options) {
            var defer = $q.defer();

            // CAMERA
            if (type === 0) {
                getPicture(0);
            }

            // GALLERY
            if (type === 1) {
                getPicture(1);
            }

            // Video
            if (type === 2) {
                getVideo();
            }

            function getPicture(method) {
                if (method === 0 && cordova) options.sourceType = Camera.PictureSourceType.CAMERA;
                if (method === 1 && cordova) options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

                if (cordova) {
                    $cordovaCamera.getPicture(options).then(defer.resolve, defer.reject);
                } else {
                    var fileInput = angular.element('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
                    fileInput[0].click();
                    fileInput.on('change', function (evt) {
                        tempImage     = evt.currentTarget.files[0];
                        var reader    = new FileReader();
                        reader.onload = function (evt) {
                            defer.resolve(evt.target.result);
                        };
                        reader.readAsDataURL(tempImage);
                    });
                }
            }

            function getVideo() {
                $cordovaCapture.captureVideo({
                    limit   : 1,
                    duration: 5
                }).then(function (mediaFiles) {
                    tempImage = mediaFiles[0].fullPath;
                    defer.resolve(tempImage);
                }, defer.reject);
            }

            return defer.promise;
        }

        function modalPost(image) {
            var defer  = $q.defer();
            var $scope = $rootScope.$new();

            $scope.image = image;
            $scope.form  = {
                title        : '',
                facebookShare: true
            };

            //Mentios
            // shows the use of dynamic values in mentio-id and mentio-for to link elements
            $scope.searchPeople = function (term) {
                var peopleList = [];
                return User.getFollowing().then(function (response) {
                    _.each(response, function (item) {
                        item.imageUrl = item.photo ? item.photo._url : 'img/user.png';
                        item.bio      = item.status;
                        if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                            peopleList.push(item);
                        }
                    });
                    $scope.people = peopleList;
                    //console.log(peopleList);
                    return $q.when(peopleList);
                });
            };

            $scope.getPeopleTextRaw = function (item) {
                return '@' + item.username;
            };

            $scope.theme = $rootScope.theme;

            $ionicModal.fromTemplateUrl('app/main/share/share-modal.html', {
                scope          : $scope,
                focusFirstInput: true
            }).then(function (modal) {
                $scope.modalFilter = modal;
                $scope.modalFilter.show();
            });


            $scope.form.address = {};
            $scope.closeAddress = function () {
                $scope.form.address = {};
            };

            $scope.close = function () {
                $scope.modalFilter.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            $scope.submit = function (rForm, form) {
                if (rForm.$valid) {
                    var form   = angular.copy($scope.form);
                    form.image = $scope.image;
                    tempImage  = '';
                    $scope.close();
                    defer.resolve(form);
                } else {
                    console.log('Error', rForm);
                }
            };

            return defer.promise;
        }

    }
})();
