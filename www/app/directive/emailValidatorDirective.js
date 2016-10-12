(function () {
    'use strict';

    angular.module('starter').directive('emailValidator', emailValidatorDirective);

    function emailValidatorDirective(User) {
        return {
            require: 'ngModel',
            link    : emailValidatorLink,
        };

        function emailValidatorLink(scope, elem, attr,ngModel) {
            ngModel.$asyncValidators.email = function  (modelValue, viewValue) {
                if(viewValue) {
                console.log(elem, viewValue);
                    return User.validateEmail(viewValue);
                }
            }
        }
    }

})();