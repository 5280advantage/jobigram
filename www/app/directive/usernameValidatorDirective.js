(function () {
    'use strict';

    angular.module('starter').directive('usernameValidator', usernameValidatorDirective);

    function usernameValidatorDirective(User) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link    : usernameValidatorLink,
        };

        function usernameValidatorLink(scope, elem, attr, ngModel) {
            ngModel.$asyncValidators.username = function  (modelValue, viewValue) {
                if(viewValue) {
                    return User.validateUsername(viewValue);
                }
            }
        }
    }

})();