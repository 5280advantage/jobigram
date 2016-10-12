(function () {
    'use strict';

    angular.module('starter').directive('albumGrid', albumGridDirective);

    function albumGridDirective(GalleryAlbum, $rootScope) {

        return {
            restrict   : 'E',
            scope      : {
                username: '=',
                user    : '=',
                profile : '=',
                onReload: '=',
            },
            templateUrl: 'app/directive/albumGridDirective.html',
            link       : albumGridLink
        };

        function albumGridLink($scope, elem, attr) {
            // Can Edit
            $scope.canEdit = ($scope.username === Parse.User.current().username) ? true : false;

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

            $rootScope.$on('albumGrid:reload', function (elem, item) {
                init();
                $scope.onReload();
            });


            loadFeed();

            function loadFeed() {
                if ($scope.loading) return;
                $scope.loading = true;
                GalleryAlbum.list($scope.params).then(function (data) {

                    // If can Edit
                    if ($scope.canEdit) {
                        if (!_.some($scope.data, {create: true})) {
                            $scope.data.push({
                                create: true
                            });
                        }
                    }

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
                $scope.moreDataCanBeLoaded = true;
                $scope.loading             = false;
            }
        }

    }


})();
