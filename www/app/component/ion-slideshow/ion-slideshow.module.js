(function () {
    'use strict';
    angular.module('ion-slideshow', [])
           .directive('ionSlideshow', function ($ionicPopup, $ionicPopover, $rootScope, Loading, $translate, User, Gallery, Toast, $ionicModal) {
               return {
                   restrict: 'A',
                   scope   : {
                       ngModel: '=',
                       index  : '=',
                       canEdit: '='
                   },
                   link    : link
               };

               function link($scope, elem, attr) {

                   elem.bind('click', function () {
                       $scope.allImages   = $scope.ngModel;
                       $scope.activeSlide = $scope.index;

                       // Start Index
                       $scope.indexActual = $scope.index;

                       console.log($scope.index);

                       $ionicModal.fromTemplateUrl('app/component/ion-slideshow/image-popover.html', {
                           scope: $scope,
                       }).then(function (modal) {
                           $scope.modal = modal;
                           $scope.modal.show();
                       });

                       $scope.slideChanged = function (index) {
                           $scope.indexActual = index;
                       };

                       // Popover
                       $scope.openPopover  = function ($event) {
                           $ionicPopover.fromTemplateUrl('app/component/ion-slideshow/ion-slideshow.popover.html', {
                               scope: $scope
                           }).then(function (popover) {
                               $scope.slidepopover = popover;
                               $scope.slidepopover.show($event);
                           });
                       };
                       $scope.closePopover = function () {
                           $scope.slidepopover.hide();
                       };


                       $scope.editPhoto = function () {
                           $scope.closePopover();
                       };


                       $scope.deletePhoto = function () {
                           var index   = $scope.indexActual;
                           var gallery = $scope.allImages[index];
                           $scope.closePopover();

                           $ionicPopup
                               .confirm({
                                   title   : $translate.instant('deleteGalleryConfirmText'),
                                   template: $translate.instant('areSure')
                               })
                               .then(function (res) {
                                   if (res) {
                                       Loading.start();
                                       Gallery.get(gallery.id).then(function (gallery) {
                                           if (gallery) {
                                               Gallery.destroy(gallery).then(function () {
                                                   console.log('Photo deleted');
                                                   Toast.alert({
                                                       title: 'Photo',
                                                       text : 'Photo deleted'
                                                   });
                                                   $rootScope.$emit('photogrid:modal:reload', true);
                                                   $scope.closeModal();
                                                   Loading.end();
                                               });
                                           } else {
                                               $scope.onReload();
                                               Loading.end();
                                           }
                                       }).catch(function () {
                                           $scope.onReload();
                                           Loading.end();
                                       })

                                   }
                               });
                       };

                       // Close the modal
                       $scope.closeModal = function () {
                           $scope.modal.hide();
                           $scope.modal.remove()
                       };
                   });


               }
           });

})();