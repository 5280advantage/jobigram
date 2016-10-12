(function () {
    'use strict';

    angular.module('app.main').controller('UserMergeCtrl', UserMergeController);

    function UserMergeController(Auth, $scope, $rootScope, AppConfig, Facebook, $state, Toast) {
        var vm        = this;

        init();
        function init() {
            if ($rootScope.tempUser) {
                $scope.form = {
                    email   : $rootScope.tempUser.attributes.email,
                    username: $rootScope.tempUser.attributes.username,
                    password: ''
                };
            } else {
                $state.go('user.intro', {clear: true});
            }
        }

        $scope.submitMerge = function (rForm, form) {

            console.log(rForm);
            console.table(form);
            if (vm.form.password !== '') {
                console.log(form);
                Auth.logIn(form).then(function (user) {
                    console.log(user);
                    $rootScope.currentUser = user;
                    if (Auth.getLoggedUser()) {
                        Facebook.link(Parse.User.current()).then(function (resp) {
                            console.log(resp);
                            $state.go(AppConfig.routes.home, {
                                clear: true
                            });
                        }).catch(function (resp) {
                            console.log(resp);
                            Toast.alert({
                                title: 'Ops',
                                text : resp.message
                            });
                        });
                    }


                }).catch(function (resp) {
                    Toast.alert({
                        title: 'Ops',
                        text : resp.message
                    });
                });
            } else {
                Toast.alert({
                    title: ('Invalid form'),
                    text : ('Please enter your email')
                });
            }

        };

    }


})();
