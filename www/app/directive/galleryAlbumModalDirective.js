(function () {
    'use strict';

    angular.module('starter').directive('galleryAlbumModal', galleryAlbumModalDirective);

    function galleryAlbumModalDirective($ionicModal, AppConfig, $q, GalleryAlbum, $rootScope) {
        return {
            restrict: 'A',
            link    : galleryAlbumModalLink,
            scope   : {
                ngModel: '='
            }
        };

        function galleryAlbumModalLink($scope, elem, attr) {

            elem.bind('click', openModal);

            function openModal() {
                var defer = $q.defer();

                $scope.loading = true;
                $scope.theme = AppConfig.theme;


                init();
                loadFeed();

                function loadFeed() {
                    if ($scope.loading) return;
                    $scope.loading = true;
                    GalleryAlbum.list($scope.params).then(function (data) {
                        console.log(data);
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
                    $scope.params              = {};
                    $scope.params.page         = 1;
                    $scope.data                = [];
                    $scope.moreDataCanBeLoaded = true;
                    $scope.loading             = false;

                    if ($scope.canEdit) {
                        $scope.data.push({
                            create: true
                        });
                    }
                }

                $ionicModal.fromTemplateUrl('app/directive/galleryAlbumModalDirective.html', {
                    scope          : $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $rootScope.$on('selectAlbum', function (event, album) {
                    console.log('selectAlbum', event);
                    console.log('selectAlbum', album);
                    $scope.ngModel = album;
                    $scope.closeModal();
                });


                $scope.closeModal = function () {
                    $scope.modal.hide();
                };

                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $scope.selectAlbum = function (album) {
                    $scope.ngModel = album;
                    $scope.closeModal();
                };

                return defer.promise;
            }

        }
    }

})();