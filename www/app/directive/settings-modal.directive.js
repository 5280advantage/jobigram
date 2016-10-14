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
          scope.selectedTmp= [];
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

          scope.closeIndustryModal = function(){
            scope.modalIndustry.hide();
            scope.modalIndustry.remove();
          }

          scope.openIndustrySelectModal = function () {
            _.each($rootScope.selected,function(n){
              scope.selectedTmp.push(n);
            })
            $ionicModal.fromTemplateUrl('app/directive/industries-modal.html', {
              scope: scope
            }).then(function (modal) {
              scope.modalIndustry = modal;
              scope.modalIndustry.show();
            });
          }

          scope.addToSelected = function(tag){
            if(_.indexOf($rootScope.selected,tag)==-1 && _.indexOf(scope.selectedTmp,tag)==-1) {
              scope.selectedTmp.push(tag);
            }
            else{
              scope.selectedTmp.splice(_.indexOf(scope.selectedTmp,tag),1);
            }
            console.log(scope.selectedTmp);
            console.log($rootScope.selected);
          }

          scope.link = function (sref) {
            $state.go(sref);
            scope.closeModal();
          };

          scope.isSelectedTmp = function(industry){
            return _.indexOf(scope.selectedTmp,industry)!=-1;
          }

          scope.setSelected = function(){
            $rootScope.selected = [];
            _.each(scope.selectedTmp, function(n){
              $rootScope.selected.push(n);
            });
            scope.selectedTmp = [];
            scope.modalIndustry.hide();
            scope.modalIndustry.remove();
          }
        }
      }
    };
  }


})();
