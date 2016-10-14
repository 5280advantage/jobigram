(function () {
    'use strict';

    angular.module('app.main').controller('AccountCtrl', AccountController);

    function AccountController($scope, AppConfig, User, $state, $rootScope) {
        var vm = this;

        vm.user  = $rootScope.currentUser;
        vm.photo = $rootScope.currentUser.attributes.photo;

        vm.loading     = true;
        $scope.buttonTheme = 'button-' + AppConfig.theme;

      if($rootScope.profile=='Employer'){
        $rootScope.profile = 'Employer';
        $scope.profileImage ='img/companylogo.png';
      }
      else{
        $rootScope.profile = 'Employee';
        $scope.profileImage ='img/user.png';
      }

        User.getPublicData(Parse.User.current()).then(function (user) {
            console.log('Profile', user.attributes);
            vm.user    = user;
            vm.loading = false;
        });

        vm.openFollowers = function () {
            $state.go('tab.accountFollowers', {username: $rootScope.currentUser.attributes.username});
        };

        vm.openFollowing = function () {
            $state.go('tab.accountFollowing', {username: $rootScope.currentUser.attributes.username});
        };

        init();

        vm.tab = {
            grid : true,
            list : false,
            album: false,
            map  : false
        };

        vm.changeTab = function changeTab(tab) {
            Object.keys(vm.tab).map(function (value) {
                if (value == tab) {
                    vm.tab[value] = true;
                } else {
                    vm.tab[value] = false;
                }
            });
        }

        function init() {
            vm.data  = {
                total    : false,
                galleries: []
            };
            vm.page  = 0;
            vm.empty = false;
            vm.more  = false;
            getFollower();
        }

        function getFollower() {
            vm.loadingFollowers = true;
            vm.loadingFollowing = true;
            vm.loadingPhotos    = true;
        }


    }


})();
