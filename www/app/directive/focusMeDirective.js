(function () {
    'use strict';
    angular.module('starter').directive('focusMe', focusMeDirective);

    function focusMeDirective($timeout, $rootScope) {
        return {
            restrict: 'A',
            link    : function (scope, element, attrs) {

                $rootScope.$on('openKeyboard', openKeyboard);

                openKeyboard();

                function openKeyboard() {
                    $timeout(function () {
                        element[0].focus();
                        element[0].click();
                        if (window.cordova) {
                            cordova.plugins.Keyboard.show();
                        }
                    }, 750);
                }
            }
        };
    }

})();
