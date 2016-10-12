(function () {
    'use strict';

    angular.module('app.main').controller('UserAvatarCtrl', UserAvatarController);

    function UserAvatarController(User, Parse, $translate, $scope, Loading, Auth, AppConfig, $rootScope, $state, Toast) {

        init();


        function init() {
            var user    = Parse.User.current();
            $scope.form = {
                name    : user.name,
                email   : user.email,
                status  : user.status,
                gender  : user.gender,
                username: user.username
            };
            console.log($scope.form);
            console.log($scope.formFields);
        }

        $scope.submitAvatar = function (rForm, form) {
            console.log(form);
            Loading.start();

            if (rForm.$valid) {
                var dataForm = angular.copy(form);
                console.log(dataForm);

                User.update(dataForm).then(function (resp) {
                    console.log(resp);
                    $rootScope.currentUser = Parse.User.current();
                    $state.go(AppConfig.routes.home, {
                        clear: true
                    });
                    Loading.end();
                });
            } else {
                Toast.alert({
                    title: $translate.instant('invalidForm'),
                    text : $translate.instant('fillAllFields')
                });
                Loading.end();
            }

        }

    }


})();
