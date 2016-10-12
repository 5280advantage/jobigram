(function () {
    'use strict';

    angular.module('app.main').directive('userAvatar', userAvatarDirective);

    function userAvatarDirective(ActionSheet, $rootScope, ParseFile, User) {
        return {
            restrict: 'A',
            scope   : {
                ngModel: '='
            },
            link    : function ($scope, elem) {

                elem.bind('click', openModal);

                function openModal() {
                    var tempImage;
                    var user        = $scope.ngModel;
                    var currentUser = $rootScope.currentUser;

                    console.log(user);
                    console.log(currentUser);

                    if (user.id != currentUser.id) {
                        return false;
                    }

                    ActionSheet.image().then(function (image) {
                        tempImage = image;
                        //return PhotoFilter.load(image);
                        return image;
                    }).then(function (form) {
                        $scope.loading = true;
                        ParseFile.upload({base64: form}).then(function (imageUploaded) {
                            User.setPhoto(imageUploaded).then(function (user) {
                                $rootScope.currentUser.photo = user.attributes.photo;
                                $scope.loading = false;
                            });
                        });
                    });
                }

            }
        };
    }

})();
