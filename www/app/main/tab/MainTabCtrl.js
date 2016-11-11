(function () {
    'use strict';

    angular.module('app.main').controller('MainTabCtrl', MainTabController);

    function MainTabController($localStorage, $ionicHistory, ParsePush, GalleryShare, $scope, $rootScope, PhotoService, $ionicPlatform, Gallery, ParseFile, Loading,$q) {
        var vm = this;

        // Android Clear
        $ionicHistory.clearHistory();

        $scope.storage = $localStorage;
        function clearBadge() {
            $scope.badge = 0;
        }

        clearBadge();

        $rootScope.$on('activity:clear', function () {
            clearBadge();
        })

        $ionicPlatform.ready(function () {

            ParsePush.init().then(function () {
                ParsePush.on('openPN', function (pn) {
                    console.log('The user opened a notification:' + JSON.stringify(pn));
                    $scope.$applyAsync();
                });

                ParsePush.on('receivePN', function (pn) {
                    console.log('yo i got this push notification:' + JSON.stringify(pn));
                    $scope.badge++;
                    $scope.$applyAsync();
                });

                ParsePush.on('receivePN', function (message) {
                    console.log('message', message);
                    $scope.$applyAsync();
                });
            })
        });

        vm.postPhoto = function () {
            PhotoService.open()
                .then(function (base64Image) {
                var ReactUI = PhotoEditorSDK.UI.ReactUI;
                var _PhotoEditorSDK = PhotoEditorSDK;
                var Promise = _PhotoEditorSDK.Promise;
                var editor;
                var myImage;
                var editorPromise;

                function onLoad() {
                    var defer= $q.defer();
                    // maxWindow();
                    var w = window.innerWidth;
                    var h = window.innerHeight;

                    var div = document.createElement("div");
                    div.id="editor";

                    document.getElementById("main").appendChild(div);

                    document.getElementById("editor").style.height = h+"px";
                    document.getElementById("editor").style.width= w+"px";
                    document.getElementById("editor").style.zIndex= 500;
                    var container = document.getElementById('editor');
                    editor = new ReactUI({
                        container: container,
                        showCloseButton: false,
                        // logLevel: 'info',
                        editor: {
                            image: myImage,
                          //preferredRenderer: 'canvas' works in ios, preferredRenderer: 'webgl' works in android,
                            preferredRenderer: 'canvas',
                            // responsive: true,
                            export:{
                                showButton : true,
                                download: false,
                                type: PhotoEditorSDK.RenderType.DATAURL
                                // type: PhotoEditorSDK.ImageFormat.IMAGE
                            }
                        },
                        assets: {
                            // baseUrl: 'file:///android_asset/www/sdkassets' // <-- This should be the absolute path to your `cassets` directory
                            baseUrl: 'sdkassets'
                        }
                    });
                    editorPromise = defer.promise;

                        editor.on('export', function (dataURL) {
                          console.log(dataURL);
                        var url= "/my-upload-handler.php";
                        var data = {
                            image: dataURL
                        };
                        defer.resolve(dataURL);

                            var element = document.getElementById("editor");
                            element.parentNode.removeChild(element);


                        // urlData.link=dataURL;
                    });
                    editorPromise
                        .then(GalleryShare.show)
                        .then(function (form) {
                            Loading.start();
                            console.log(form);
                            ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                                form.image = imageUploaded;
                                Gallery.create(form).then(function (item) {
                                    $rootScope.$emit('photolist:reload');
                                    Loading.end();
                                });
                            });
                        });
                }
                myImage = new Image();
                myImage.addEventListener('load', function () {
                    // $scope.openModal();
                    // $state.go('tab.account');
                    onLoad();
                });
                myImage.src = base64Image;
                })

            // PhotoService.open().then(function (base64Image) {
            //     // console.log(data);
            //     var ReactUI = PhotoEditorSDK.UI.ReactUI;
            //     var _PhotoEditorSDK = PhotoEditorSDK;
            //     var Promise = _PhotoEditorSDK.Promise;
            //     var editor;
            //     var myImage;
            //     function onLoad() {
            //         // maxWindow();
            //         var w = window.innerWidth;
            //         var h = window.innerHeight;
            //         document.getElementById("editor").style.height = h+"px";
            //         document.getElementById("editor").style.width= w+"px";
            //         document.getElementById("editor").style.zIndex= 500;
            //         var container = document.getElementById('editor');
            //         editor = new ReactUI({
            //             container: container,
            //             showCloseButton: false,
            //             logLevel: 'info',
            //             editor: {
            //                 image: myImage,
            //                 preferredRenderer: 'webgl',
            //                 responsive: false,
            //                 export:{
            //                     showButton : true,
            //                     download: false,
            //                     type: PhotoEditorSDK.RenderType.DATAURL
            //                     // type: PhotoEditorSDK.ImageFormat.IMAGE
            //                 }
            //             },
            //             assets: {
            //                 // baseUrl: 'file:///android_asset/www/sdkassets' // <-- This should be the absolute path to your `cassets` directory
            //                 baseUrl: '/sdkassets'
            //             }
            //         });
            //         editor.on('export', function (dataURL) {
            //             var url= "/my-upload-handler.php";
            //             var data = {
            //                 image: dataURL
            //             };
            //
            //             // urlData.link=dataURL;
            //
            //         })
            //     }
            //     myImage = new Image();
            //     myImage.addEventListener('load', function () {
            //         // $scope.openModal();
            //         // $state.go('tab.account');
            //         onLoad();
            //     });
            //     myImage.src = base64Image;
            // })
        };

    }
})();
