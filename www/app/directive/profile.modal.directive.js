(function () {
    'use strict';
    angular.module('starter').directive('profileModal', profileModalDirective);

    function profileModalDirective($ionicModal, User) {

        return {
            restrict: 'A',
            scope   : {
                username: '='
            },
            link    : profileModalLink
        };

        function profileModalLink(scope, elem) {
            elem.bind('click', function () {

                console.log(scope.username);

                User.profile(scope.username).then(function (data) {
                    console.log(data);
                    scope.user = data;
                    openModal();
                });

            });

            function openModal() {

                console.log(scope.user.attributes);

                $ionicModal.fromTemplateUrl('app/directive/profile-modal.html', {
                    scope: scope
                }).then(function (modal) {
                    scope.modalProfile  = modal;
                    scope.loadingFollow = true;
                    scope.changeTab     = changeTab;
                    scope.follow        = follow;
                    scope.closeModal    = closeModal;
                    scope.modalProfile.show();

                    changeTab('list');

                    function follow() {

                        scope.loadingFollow = true;
                        var status;

                        if (scope.user.follow) {
                            status = false;
                        } else {
                            status = true;
                        }

                        User.follow(scope.user.userObj.id).then(function (resp) {
                            console.log('Follow result', resp);
                            scope.user.isFollow = (resp === 'follow') ? true : false;
                            if (resp == 'follow') {
                                scope.user.followersTotal += 1;
                            }
                            if (resp == 'unfollow') {
                                scope.user.followersTotal -= 1;
                            }
                            scope.loadingFollow = false;
                        });


                    }

                    function closeModal() {
                        delete scope.data;
                        scope.modalProfile.hide();
                    }
                });

                // Cleanup the modal when we're done with it!
                scope.$on('$destroy', function () {
                    scope.modalProfile.remove();
                });
            }

            function changeTab(tab) {
                if (tab === 'list') {
                    scope.tab = {
                        list: true,
                        grid: false
                    };
                } else {
                    scope.tab = {
                        list: false,
                        grid: true
                    };
                }
            }


        }
    }

})();
