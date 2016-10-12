(function () {
    'use strict';
    angular.module('starter').controller('UserListCtrl', UserListController);

    function UserListController(User, $scope, $rootScope, $state) {
        $scope.params = {};
        init();
        loadFeed();

        function loadFeed() {
            if ($scope.loading) return;
            $scope.loading = true;

            $scope.onSearch = function () {
                $scope.params.search = $scope.searchValue;
                $scope.onReload();
            };

            $scope.clearSearch = function () {
                $scope.params      = {};
                $scope.searchValue = '';
                $scope.onReload();
            };

            User.list($scope.params).then(function (data) {
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

        $scope.onLoadMore = function () {
            loadFeed();
        };

        $scope.onReload = function () {
            init()
            loadFeed();
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

        $scope.openProfile = function (user) {
            console.log('user', user);
            $state.go('tab.homeProfile', {username: user.username})
        };


        $scope.follow = function (user) {

            user.loading = true;
            User.follow(user.userObj.id).then(function (resp) {
                console.log('Follow result', resp);
                user.isFollow = (resp === 'follow') ? true : false;
                if (resp == 'follow') {
                    user.followersTotal += 1;
                }
                if (resp == 'unfollow') {
                    user.followersTotal -= 1;
                }
                user.loading = false;
            });
        };

    }

})();