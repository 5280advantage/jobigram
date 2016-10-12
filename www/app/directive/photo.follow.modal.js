(function () {
  'use strict';
  
  angular
    .module('starter')
    .directive('photogramFollow', photogramFollowDirective);

  function photogramFollowDirective($ionicModal, AppConfig, Photogram) {

    var path = AppConfig.path;

    return {
      restrict: 'A',
      scope: {
        user: '='
      },
      link: function (scope, elem, attr) {
        elem.bind('click', openModal);
        scope.closeModal = closeModal;

        function openModal() {
          $ionicModal.fromTemplateUrl(path + '/directive/follow/photogram.follow.modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modalFollow = modal;
            console.log('Open modal follow', scope.user);

            Photogram
              .getFollow(scope.user)
              .then(function (resp) {
                console.log(resp);
                scope.data = resp;
                scope.modalFollow.show();
              });

          });
        }

        function closeModal() {
          scope.modalFollow.hide();
          scope.modalFollow.remove();
        }
      }
    }
  }


})();
