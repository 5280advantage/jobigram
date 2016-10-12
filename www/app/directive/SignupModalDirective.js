(function () {
    'use strict';

    angular.module('starter').directive('signupModal', signupModalDirective);

    function signupModalDirective(AppConfig, Loading, User, $state, Toast, $ionicModal, $rootScope) {
        return {
            restrict: 'A',
            link    : signupModalLink,
        };

        function signupModalLink($scope, elem, attr) {
            elem.bind('click', function () {

                $scope.routeLogged = AppConfig.routes.home;

                $scope.form = {
                    username: '',
                    email   : '',
                    password: ''
                };

                $scope.submitRegister = function (rForm, data) {
                    if (rForm.$valid) {
                        Loading.start();
                        var form = angular.copy(data);
                        User.signUp(form).then(function (resp) {
                            console.log(resp);

                            // After register, login
                            User.signIn({
                                username: form.username,
                                password: form.password
                            }).then(function (data) {
                                console.log(data);
                                $rootScope.currentUser = Parse.User.current();
                                $state.go('avatar', {
                                    clear: true
                                });
                                Loading.end();
                                $rootScope.$emit('photolist:reload');
                                $scope.closeModal();
                            }).catch(function (resp) {
                                console.log(resp);
                                Toast.alert({
                                    title: 'Alert',
                                    text : resp.error
                                });
                                Loading.end();
                            });
                        }).catch(function (resp) {
                            console.log(resp);
                            Toast.alert({
                                title: 'Alert',
                                text : resp.error
                            });
                            Loading.end();
                        });
                    }


                };

                $ionicModal.fromTemplateUrl('app/directive/SignupModalDirective.html', {
                    scope          : $scope,
                    animation      : 'slide-in-up',
                    focusFirstInput: true,
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.closeModal = function () {
                    $scope.modal.hide();
                };
                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });
            });
        }
    }

})();