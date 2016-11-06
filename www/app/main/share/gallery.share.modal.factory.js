(function () {
    'use strict';
    angular.module('starter').factory('GalleryShare', GalleryShareFactory);

    function GalleryShareFactory($q, $rootScope, User, $ionicModal) {
        var tempImage;
        return {
            show: show
        };

        function show(image) {
            var user    = Parse.User.current();
            User.profile(user.username).then(function (data) {
                console.log("profile",data);
            });
            console.log("user", user);
            var defer  = $q.defer();
            var $scope = $rootScope.$new();

            $scope.image = image;
            $scope.form  = {
                title        : '',
                facebookShare: true,
                privacity    : 'public'
            };

            //Mentios
            // shows the use of dynamic values in mentio-id and mentio-for to link elements
            $scope.searchPeople = function (term) {
                var peopleList = [];
                return User.getFollowing().then(function (response) {
                    _.each(response, function (item) {
                        item.imageUrl = item.photo ? item.photo._url : 'img/user.png';
                        item.bio      = item.status;
                        if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                            peopleList.push(item);
                        }
                    });
                    $scope.people = peopleList;
                    //console.log(peopleList);
                    return $q.when(peopleList);
                });
            };

            $scope.getPeopleTextRaw = function (item) {
                return '@' + item.username;
            };

            $scope.theme = $rootScope.theme;

            $ionicModal.fromTemplateUrl('app/main/share/share-modal.html', {
                scope          : $scope,
                focusFirstInput: true
            }).then(function (modal) {
                $scope.modalFilter = modal;
                $scope.modalFilter.show();
            });

            $scope.closeAddress = function () {
                $scope.form.address = {};
            };

            $scope.close = function () {
                $scope.modalFilter.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            $scope.submit = function (rForm, form) {
                if (rForm.$valid) {
                    var form   = angular.copy($scope.form);
                    form.image = $scope.image;
                    tempImage  = '';
                    $scope.close();
                    defer.resolve(form);
                } else {
                    console.log('Error', rForm);
                }
            };

            return defer.promise;
        }

    }

})();