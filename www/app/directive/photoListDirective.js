(function () {
    'use strict';

    angular.module('starter').directive('photoList', photoListDirective);

    function photoListDirective(Gallery, $rootScope, Loading, $ionicPopup, $translate, $state, Share, Toast, FeedbackModal, $ionicActionSheet) {

        return {
            restrict   : 'E',
            scope      : {
                username  : '=',
                profile   : '=',
                load      : '=',
                openLikers: '=',
                onReload  : '=',
                id        : '=',
                type      : '='
            },
            templateUrl: 'app/directive/photoListDirective.html',
            link       : photoListController
        };

        function photoListController($scope, elem, attr) {
            $scope.params = {};

            $rootScope.$on('photolist:reload', function (ev, value) {
                console.log('Reload photolist', value);
                if (value) {
                    $scope.params.privacity = value;
                }
                init()
                loadFeed();
            });

            if ($scope.type) {
                $scope.params.privacity = $scope.type;
            }

            init();

            var currentUser = Parse.User.current();

            if ($scope.username) {
                $scope.params.username = $scope.username;
            }

            if ($scope.id) {
                $scope.params.id = $scope.id;
            }

            $rootScope.$on('photoInclude', function (elem, item) {
                if (item.objectId) {
                    item.id = item.objectId;
                }
                $scope.data.unshift(item);
            });

            $scope.openComment = function (galleryId) {
                $state.go('galleryComments', {galleryId: galleryId})
            };

            $scope.share = function (item) {
                var itemShare = {
                    title   : item.title,
                    image   : item.image.url(),
                    userName: item.user.name,
                    url     : 'http://market.ionic.io/starters/photogram-ionic-instagram-clone',
                };
                console.log(item, itemShare);
                Share.open();
            };


            loadFeed();

            function loadFeed() {
                if ($scope.loading) return;
                $scope.loading = true;
                Gallery.feed($scope.params).then(function (data) {
                    if (data.length > 0) {
                        $scope.params.page++;
                        data.map(function (item) {
                            if (item.album) {
                                item.canEdit = (currentUser.id === item.album.attributes.user.id) ? true : false;
                            } else {
                                item.canEdit = false;
                            }
                            $scope.data.push(item);
                        });
                    } else {
                        if ($scope.data.length === 0) {
                            $scope.showEmptyView = true;
                        }
                        $scope.moreDataCanBeLoaded = false;
                    }

                    $scope.loading = false;
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    $rootScope.$broadcast('scroll.refreshComplete');

                }).catch(function (err) {
                    if ($scope.data.length === 0) {
                        $scope.showErrorView = true;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }

            $scope.onLoadMore = function () {
                loadFeed();
            };

            $scope.onReload = function () {
                init()
                loadFeed();
                $scope.$broadcast('scroll.refreshComplete');
            };

            function init() {
                $scope.params.page         = 1;
                $scope.data                = [];
                $scope.loading             = false;
                $scope.moreDataCanBeLoaded = true;
                $scope.showEmptyView       = false;
                $scope.showErrorView       = false;

                if ($scope.canEdit) {
                    $scope.data.push({
                        create: true
                    });
                }
            }

            $rootScope.$on('onUserLogged', $scope.onReload);

            $scope.action = function (gallery) {

                var buttons = [
                    {
                        text: '<i class="icon ion-alert-circled"></i>' + $translate.instant('reportText')
                    }
                ];


                console.log(gallery);

                if (Parse.User.current().id === gallery.user.id) {
                    var buttonDelete = {
                        text: '<i class="icon ion-trash-b"></i>' + $translate.instant('deleteGallery')
                    };
                    buttons.push(buttonDelete);
                }
                var message = {
                    text : gallery.title,
                    image: gallery.img
                };

                var actionSheet = {
                    buttons      : buttons,
                    cancelText   : $translate.instant('cancelText'),
                    buttonClicked: actionButtons
                };


                function actionButtons(index) {
                    switch (index) {
                        case 0:
                            FeedbackModal.modal(gallery.id);
                            break;
                        case 1:

                            $ionicPopup
                                .confirm({
                                    title   : $translate.instant('deleteGalleryConfirmText'),
                                    template: $translate.instant('areSure')
                                })
                                .then(function (res) {
                                    if (res) {
                                        Loading.start();
                                        Gallery.get(gallery.id).then(function (gallery) {
                                            if (gallery) {
                                                Gallery.destroy(gallery).then(function () {
                                                    console.log('Photo deleted');
                                                    Toast.alert({
                                                        title: 'Photo',
                                                        text : 'Photo deleted'
                                                    });
                                                    $scope.onReload();
                                                    Loading.end();
                                                });
                                            } else {
                                                $scope.onReload();
                                                Loading.end();
                                            }
                                        }).catch(function () {
                                            $scope.onReload();
                                            Loading.end();
                                        })

                                    }
                                });


                    }
                    return true;
                }

                // Show the action sheet
                $ionicActionSheet.show(actionSheet);
            };

        }

    }


})();
