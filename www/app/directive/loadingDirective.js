(function () {
  'use strict';

  angular
    .module('starter')
    .directive('loading', PhotogramLoadingDirective);

  function PhotogramLoadingDirective() {
    return {
      restrict: 'E',
      scope   : {
        loading: '=',
        icon   : '@'
      },
      template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
    };
  }

})();
