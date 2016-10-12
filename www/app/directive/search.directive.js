(function () {
  'use strict';

  angular
    .module('starter')
    .directive('ionSearch', ionSearchDirective);

  function ionSearchDirective($timeout) {

    return {
      restrict   : 'E',
      scope      : {
        getData: '&source',
        ngModel: '=?',
        search : '=?filter'
      },
      templateUrl: 'app/module/photogram/directive/search/search-directive.html',
      link       : function (scope, element, attrs) {
        attrs.minLength = attrs.minLength || 0;
        scope.placeholder = attrs.placeholder || '';
        scope.clear = function () {
          console.log('Limpar campo');
          scope.input = '';
          scope.$apply();
        };

        if (attrs.class) {
          element.addClass(attrs.class);
        }

        if (attrs.source) {
          scope.$watch('search.value', watchSearch);
        }

        function watchSearch(newValue) {
          if (newValue.length > attrs.minLength) {
            $timeout(function () {
              scope
                .getData({
                  str: newValue
                })
                .then(function (results) {
                  scope.ngModel = results;
                });
            }, 1000);
          } else {
            scope.ngModel = [];
          }
        }

      }

    };
  }


})();
