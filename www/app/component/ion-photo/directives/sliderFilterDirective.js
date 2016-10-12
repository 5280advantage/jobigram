(function () {
    'use strict';

    angular.module('ion-photo').directive('sliderFilter', sliderFilterDirective);

    function sliderFilterDirective() {
        return {
            restrict: 'E',
            link    : sliderFilterLink,
            scope   : {
                filter: '='
            },
            template: '<div class="item range range-positive"> ' +
            '<input type="range" name="filter.slider.name" min="-100" max="100" step="1" ng-model="filter.slider.value"  > ' +
            '</div>'
        };

        function sliderFilterLink(scope, elem, attr) {

            console.log(scope.filter);

            scope.$watch('filter.slider.value', function (value) {
                if (value) {
                    scope.filter.slider.value = parseInt(value);
                    scope.filter.setSlider(scope.filter.slider);
                }
            });
        }
    }

})();