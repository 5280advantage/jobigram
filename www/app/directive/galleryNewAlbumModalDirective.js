(function () {
    'use strict';

    angular.module('starter').directive('galleryNewAlbumModal', galleryNewAlbumModalDirective);

    function galleryNewAlbumModalDirective($ionicModal, AppConfig, $q, $rootScope, GalleryAlbum) {
        return {
            restrict: 'A',
            link    : galleryNewAlbumModalLink,
            scope   : {
                ngModel: '='
            }
        };

        function galleryNewAlbumModalLink($scope, elem, attr) {

            elem.bind('click', openModal);

            function openModal() {
                var defer = $q.defer();
                $scope.theme = AppConfig.theme;

                $scope.form = {
                    title      : '',
                    description: ''
                };


                $ionicModal.fromTemplateUrl('app/directive/galleryNewAlbumModalDirective.html', {
                    scope          : $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.createAlbum = function (rForm, form) {
                    console.log(rForm, form);
                    if (rForm.$valid) {
                        GalleryAlbum.create(angular.copy(form)).then(function (album) {
                            console.log('album created', album);
                            $scope.ngModel = album;
                            $scope.closeModal();
                            $rootScope.$emit('selectAlbum', album);
                            $rootScope.$emit('albumGrid:reload', album);
                        });
                    } else {

                    }
                };

                $scope.closeModal = function () {
                    $scope.modal.hide();
                };

                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $scope.selectAlbum = function (album) {
                    $scope.ngModel = album;
                    $scope.closeModal();
                };

                return defer.promise;
            }

        }
    }

})();