(function () {
    'use strict';

    angular.module('starter').directive('signinModal', signinModalDirective);

    function signinModalDirective($ionicModal, Loading, User, $translate, $state, Toast, $ionicPopup, AppConfig, $rootScope) {
        return {
            restrict: 'A',
            link    : signinModalLink,
        };

        function signinModalLink($scope, elem, attr) {
            elem.bind('click', function () {

                $scope.routeLogged = AppConfig.routes.home;

                $scope.form = {
                    username: '',
                    password: ''
                };

                $scope.submitLogin = function (rForm, data) {
                    var form = angular.copy(data);
                    if (rForm.$valid) {
                        if( ionic.Platform.isIOS() ) {
                            Loading.start();
                        }
                        User.signIn(form).then(function (data) {
                            console.log(data);
                            $rootScope.currentUser = data;
                            $state.go($scope.routeLogged, {
                                clear: true
                            });
                            $scope.closeModal();
                            $rootScope.$emit('photolist:reload');
                            if( ionic.Platform.isIOS() ) {
                                Loading.end();
                            }
                        }).catch(function (resp) {
                            // Toast.alert({
                            //     title: 'Error',
                            //     text : $translate.instant('incorrectEmail')
                            // });
                            // Loading.end();
                            if( ionic.Platform.isIOS() ) {
                                Loading.end();
                            }
                        });
                    } else {
                        return false;
                    }
                };


                $scope.forgotPass = function () {

                    // An elaborate, custom popup
                    $scope.data = {};
                    $ionicPopup.show({
                        template: '<input type="email" ng-model="data.email">',
                        title   : $translate.instant('recoveryPass'),
                        subTitle: $translate.instant('fillEmail'),
                        scope   : $scope,
                        buttons : [
                            {text: $translate.instant('cancel')},
                            {
                                text : '<b >' + $translate.instant('submit') + '</b>',
                                type : 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.data.email) {
                                        //don't allow the user to close unless he enters wifi password
                                        e.preventDefault();
                                    } else {
                                        if( ionic.Platform.isIOS() ) {
                                            Loading.start();
                                        }
                                        User.recoverPassword($scope.data.email).then(function (resp) {
                                            Toast.alert({
                                                title: 'Alert',
                                                text : $translate.instant('recoverySuccess')
                                            });
                                            if( ionic.Platform.isIOS() ) {
                                                Loading.end();
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    });

                };

                $ionicModal.fromTemplateUrl('app/directive/SigninModalDirective.html', {
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
