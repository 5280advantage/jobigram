(function () {
    'use strict';

    angular.module('app.main').controller('ProfilePhotoCtrl', ProfileController);

    function ProfileController($stateParams) {
        var vm       = this;

        vm.id = $stateParams.id;
    }


})();
