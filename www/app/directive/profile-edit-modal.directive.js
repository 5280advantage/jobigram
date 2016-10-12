(function () {
    'use strict';

    angular.module('starter').directive('profileModalEdit', profileModalEditDirective);

    function profileModalEditDirective($ionicModal, $rootScope, ParsePush, $localStorage, User, Loading, $state) {

        return {
            restrict: 'A',
            scope   : {
                user: '='
            },
            template: '',
            link    : function (scope, elem) {


                elem.bind('click', openModal);


                function init() {
                    scope.theme      = $rootScope.theme;
                    var user         = Parse.User.current().attributes;
                    scope.form       = {
                        name    : user.name,
                        email   : user.email,
                        status  : user.status,
                        photo   : user.photo,
                        username: user.username,
                        gender  : user.gender,
                        facebook: user.facebook
                    };
                }


                function openModal() {

                    scope.linkFacebook        = linkFacebook;
                    scope.logout              = logout;
                    scope.submitUpdateProfile = submitUpdateProfile;
                    scope.closeModal          = closeModal;
                    scope.currentUser         = $rootScope.currentUser;

                    init();

                    $ionicModal.fromTemplateUrl('app/directive/profile-edit-modal.html', {
                        scope: scope
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });

                    // Cleanup the modal when we're done with it!
                    scope.$on('$destroy', function () {
                        scope.modal.remove();
                    });

                }

                function logout() {
                    delete window.localStorage['Parse/myAppId/currentUser'];
                    delete window.localStorage['Parse/myAppId/installationId'];
                    $localStorage.$reset({});
                    $state.go('user.intro', {clear: true});
                    scope.closeModal();
                }

                function linkFacebook() {
                    User.facebookLink().then(function (resp) {
                        console.log(resp);
                    });
                }

                function submitUpdateProfile() {
                    var dataForm = angular.copy(scope.form);
                    Loading.start();

                    var username = Parse.User.current().username;

                    // Change Username Subscribe for Push
                    if (username != dataForm.username) {
                        ParsePush.unsubscribe(username);
                        ParsePush.subscribe(username);
                    }

                    User.update(dataForm).then(function (resp) {
                        scope.user             = resp;
                        $rootScope.currentUser = resp;
                        Loading.end();
                        scope.closeModal();
                    });
                }

                function closeModal() {
                    scope.modal.hide();
                }

            }
        };
    }

})();
