(function () {
    'use strict';

    angular.module('starter').directive('photoGrid', photoGridDirective);

    function photoGridDirective(Gallery, $rootScope, $ionicPopup, Share, FeedbackModal, $ionicActionSheet) {

        return {
            restrict   : 'E',
            scope      : {
                username: '=',
                user    : '=',
                profile : '=',
                onReload: '=',
            },
            templateUrl: 'app/directive/photoGridDirective.html',
            link       : photoGridCtrl
        };

        function photoGridCtrl($scope, elem, attr) {
            init();

            if ($scope.username) {
                $scope.params.username = $scope.username;
            }

            $rootScope.$on('photoInclude', function (elem, item) {
                if (item.objectId) {
                    item.id = item.objectId;
                }
                $scope.data.unshift(item);
            });

            $rootScope.$on('gallery:search', function (elem, item) {
                console.log(elem, item);
                $scope.params.search = item.text;
                $scope.onReload();
            });


            loadFeed();

            function loadFeed() {
                if ($scope.loading) return;
                $scope.loading = true;
                Gallery.feed($scope.params).then(function (data) {
                    if (data.length > 0) {
                        $scope.params.page++;
                        data.map(function (item) {
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

                }).catch(function () {
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
                $scope.params              = {};
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

            $scope.action = function (gallery) {

                var buttons = [
                    {
                        text: '<i class="icon ion-share"></i>' + ('Share')
                    }, {
                        text: '<i class="icon ion-alert-circled"></i>' + ('Report')
                    }
                ];


                console.log(gallery);

                if (Parse.User.current().id === gallery.user_id) {
                    var buttonDelete = {
                        text: '<i class="icon ion-trash-b"></i>' + ('Delete your photo')
                    };
                    buttons.push(buttonDelete);
                }
                var message = {
                    text : gallery.title,
                    image: gallery.img
                };

                var actionSheet = {
                    buttons      : buttons,
                    titleText    : ('Photo'),
                    cancelText   : ('Cancel'),
                    buttonClicked: actionButtons
                };


                function actionButtons(index) {
                    switch (index) {
                        case 0:
                            Share.share(message);
                            break;
                        case 1:
                            FeedbackModal.modal(gallery);
                            break;
                        case 2:

                            $ionicPopup
                                .confirm({
                                    title   : ('Delete photo'),
                                    template: ('Are you sure?')
                                })
                                .then(function (res) {
                                    if (res) {
                                        Gallery.destroy(gallery).then(function () {
                                            console.log('Photo deleted');
                                            $scope.$emit('PhotogramHome:reload');
                                        });
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
