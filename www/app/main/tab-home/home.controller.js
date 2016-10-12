(function () {
    'use strict';

    angular.module('app.main').controller('HomeCtrl', HomeController);

    function HomeController($state, $rootScope, $ionicHistory) {
        var vm = this;

        vm.type = 'public';

        vm.onFeed = function (type) {
            vm.type = type;
            $rootScope.$emit('photolist:reload', type);
        };


        vm.openProfile = function (username) {
            $state.go('tab.homeProfile', {username: username})
        };

        vm.openLikers = function (galleryId) {
            $state.go('tab.homeGalleryLikers', {galleryId: galleryId})
        };
    }


})();
