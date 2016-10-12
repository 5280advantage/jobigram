(function () {
  'use strict';

 angular
    .module('starter')
    .directive('heart', heartDirective);

  function heartDirective() {
    return {
      restrict: 'A',
      scope: {
        item: '='
      },
      link: heartLink
    };

    function heartLink(scope, elem, attr) {
      elem.bind('click', function () {
        console.log(scope.item);
        elem.addClass('happy');
      });
    }
  }

})();
