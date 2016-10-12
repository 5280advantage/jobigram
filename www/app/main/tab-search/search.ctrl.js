(function () {
    'use strict';

    angular.module('app.main').controller('SearchCtrl', SearchCtrl);

    function SearchCtrl($scope, $filter, Gallery, $rootScope) {

        $scope.params = {};
        init();

        $scope.onSearch = function () {
            var text             = $filter('lowercase')($scope.searchValue);
            $scope.params.search = text;
            $scope.data          = [];
            $scope.onReload();
        };

        $scope.clearSearch = function () {
            $scope.params      = {};
            $scope.searchValue = '';
            $scope.data        = [];
            $scope.onReload();
        };

        loadFeed();

        function loadFeed() {
            if ($scope.loading) return;
            $scope.loading = true;
            Gallery.search($scope.params).then(function (data) {
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


    }


})();
