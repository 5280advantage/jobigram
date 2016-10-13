(function () {
    'use strict';

    angular.module('starter').directive('linkedinLogin', LinkedInLoginDirective);

    function LinkedInLoginDirective(Loading, $state, $q, $translate, AppConfig, LinkedIn, Dialog, User, $rootScope) {
        return {
            restrict: 'E',
            link    : linkedinLoginLink,
            template: '<button class="button button-block button-linkedin margin-top-0"><i class="icon ion-social-linkedin"></i> <ion-spinner ng-if="loading"></ion-spinner> <span ng-if="!loading">{{ me.name || \'loginWithLinkedIn\'| translate}}</span> </button>',
        };

        function linkedinLoginLink(scope, elem, attr) {

            scope.linkedinStatus = null;

            elem.bind('click', onLoginViaLinkedIn);


            function onLoginViaLinkedIn() {

                LinkedIn.getCurrentUser().then(function (response) {

                    if (response.status === 'connected') {
                        processLinkedInLogin(response);
                    } else {
                        LinkedIn.logIn().then(function (authData) {
                            processLinkedInLogin(authData);
                        });
                    }
                });
            }

            function processLinkedInLogin(fbAuthData) {

                Loading.start('Conectando com o LinkedIn')
                var fbData, newUser;

                return LinkedIn.me().then(function (data) {
                    fbData = data;
                    return User.findByEmail(data.email);
                }).then(function (user) {

                    if (!user.id) {
                        newUser = true;
                        return User.signInViaLinkedIn(fbAuthData);
                    }

                    var authData = user.get('authData');
                    if (authData) {
                        if (authData.linkedin.id === fbData.id) {
                            return User.signInViaLinkedIn(fbAuthData);
                        }
                    } else {
                        var deferred = $q.defer();
                        deferred.reject('LinkedIn error');
                        return deferred.promise;
                    }
                }).then(function () {
                    return User.updateWithLinkedInData(fbData);
                }).then(function (user) {
                    $rootScope.currentUser = user;
                    $rootScope.$broadcast('onUserLogged');
                    Loading.end();
                    if (newUser) {
                        $state.go('avatar', {clear: true})
                    } else {
                        $state.go(AppConfig.routes.home, {clear: true});
                    }
                    Loading.end();
                }, function (error) {
                    Loading.end();
                    Dialog.alert(error);
                })
            }

        }
    }

})();
