(function () {
    'use strict';

    angular.module('starter').directive('albumPhotoGrid', albumPhotoGridDirective);

    function albumPhotoGridDirective(AppConfig, Gallery, GalleryAlbum, Dialog, $rootScope, PhotoService, Loading, ParseFile, $translate, Toast, $ionicModal, $ionicPopover) {

        return {
            restrict: 'A',
            scope   : {
                album: '=',
                edit : '='
            },
            link    : albumPhotoGridCtrl
        };

        function albumPhotoGridCtrl($scope, elem, attr) {

            elem.bind('click', function () {
                $scope.theme   = AppConfig.theme;
                $scope.canEdit = $scope.edit;

                if (!$scope.album) {
                    return false;
                }
                $ionicModal.fromTemplateUrl('app/directive/albumPhotoGridDirective.html', {
                    scope: $scope,
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.closeAlbumPhotoGridModal = function () {
                    $scope.modal.hide();
                };
                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $rootScope.$on('photogrid:modal:reload', init);

                function init() {
                    $scope.loading = true;
                    Gallery.getAlbum({id: $scope.album}).then(function (data) {
                        console.log(data);
                        $scope.title   = data.album.attributes.title;
                        $scope.data    = data.photos;
                        $scope.loading = false;
                        $scope.$apply();
                    });
                }

                init();


                // Popover
                $scope.openPopover  = function ($event) {
                    $ionicPopover.fromTemplateUrl('app/directive/albumPhotoGridPopover.html', {
                        scope: $scope
                    }).then(function (popover) {
                        $scope.popover = popover;
                        $scope.popover.show($event);
                    });
                };
                $scope.closePopover = function () {
                    $scope.popover.hide();
                };

                $scope.uploadPhoto = function () {
                    $scope.closePopover();
                    PhotoService.open().then(PhotoService.modalPost).then(function (form) {
                        Loading.start();
                        ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                            form.image = imageUploaded;
                            Gallery.create(form).then(function (item) {
                                $scope.$emit('albumGrid:reload', item);
                                init();
                                Loading.end();
                            });
                        });
                    });
                    $scope.closePopover();
                };

                $scope.editAlbum = function () {
                    $scope.closePopover();
                    $scope.form = {
                        title      : '',
                        description: ''
                    };


                    $ionicModal.fromTemplateUrl('app/directive/galleryNewAlbumModalDirective.html', {
                        scope          : $scope,
                        focusFirstInput: true
                    }).then(function (modal) {
                        $scope.modalAlbum = modal;

                        Loading.start();
                        GalleryAlbum.get($scope.album).then(function (album) {
                            $scope.form = album;
                            $scope.modalAlbum.show();
                            Loading.end();
                        });
                    });
                    $scope.createAlbum = function (rForm, form) {
                        console.log(rForm, form);
                        if (rForm.$valid) {
                            $scope.form.save().then(function (data) {
                                console.log(data);
                                $scope.closeAlbumPhotoGridModal();
                                $scope.closeModal();
                                $rootScope.$emit('albumGrid:reload', true);
                            });
                        }
                    };

                    $scope.closeModal = function () {
                        $scope.modalAlbum.hide();
                    };
                };

                $scope.deleteAlbum = function () {
                    $scope.closePopover();
                    Dialog.confirm({
                        title  : $translate.instant('deleteAlbum'),
                        message: $translate.instant('areSure?')
                    }).then(function (resp) {
                        console.log(resp);
                        if (resp) {
                            Loading.start();
                            GalleryAlbum.get($scope.album).then(function (item) {
                                GalleryAlbum.destroy(item).then(function (resp) {
                                    console.log(resp);
                                    $scope.closeAlbumPhotoGridModal();
                                    Loading.end();
                                    Toast.alert({
                                        title: $translate.instant('album'),
                                        text : $translate.instant('removedSuccess')
                                    });
                                    $rootScope.$emit('albumGrid:reload', true);
                                });
                            })
                        }
                    });
                };


            });
        }

    }


})();
