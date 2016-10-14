(function () {
  'use strict';

  angular
    .module('starter')
    .directive('settingsModal', settingsModalDirective);

  function settingsModalDirective($ionicModal, $translate, AppConfig, amMoment,
                                  $cordovaInAppBrowser, Share, Auth, User, $state, $rootScope) {

    return {
      restrict: 'A',
      template: '',
      link: function (scope, elem) {

        elem.bind('click', openModal);
        scope.share = Share.share;

        scope.logout = function () {
          $state.go('logout');
          scope.closeSettingModal();
        };

        function init() {
          scope.form = Auth.getLoggedUser();
          scope.languages = AppConfig.locales;
          scope.language = $translate.use();
        }


        function openModal() {
          init();
          $ionicModal.fromTemplateUrl('app/directive/settings-modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modalSetting = modal;
            scope.modalSetting.show();
          });

          scope.$on('changeLanguage', function (ev, value) {
            User.update({lang: value});
            console.log(value);
            amMoment.changeLocale(value.code);
            $translate.use(value.code);
          });

          scope.closeSettingModal = function () {
            scope.modalSetting.hide();
            scope.modalSetting.remove();
          };
          
          scope.link = function (sref) {
            $state.go(sref);
            scope.closeModal();
          };

        }
      }
    };
  }


})();
