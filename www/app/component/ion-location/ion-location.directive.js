(function () {
    'use strict';

    angular.module('ion-location').directive('ionLocation', ionLocationDirective);

    function ionLocationDirective($ionicModal, GeoService) {
        return {
            restrict: 'A',
            scope   : {
                location: '=ngModel'
            },
            link    : ionLocationLink
        };

        function ionLocationLink($scope, element) {


            element.bind('click', function () {
                function init() {
                    $scope.search             = {};
                    $scope.search.suggestions = [];
                    $scope.search.query       = '';
                }


                function selectPlace(place_id) {
                    GeoService.getDetails(place_id).then(function (location) {
                        GeoService.parseAddress(location).then(function (address) {
                            console.log(address);
                            $scope.location = address;
                            $scope.closeModalLocation();
                        })
                    });
                }

                init();

                $scope.findMe = function () {
                    $scope.loading = true;
                    GeoService.findMe().then(function (location) {
                        GeoService.searchAddress(location.address_normal).then(function (result) {
                            console.log(result);
                            $scope.search.suggestions = result;
                            $scope.loading            = false;
                        });
                    });
                };

                $scope.findMe();

                $scope.choosePlace = function (place) {
                    selectPlace(place.place_id);
                }

                $scope.modalLocation = $ionicModal.fromTemplate('<ion-modal-view>' +
                    '<ion-header-bar class="bar bar-positive item-input-inset">' +
                    '<ion-spinner ng-if="loading"></ion-spinner>' +
                    '<button class="button button-clear button-icon ion-navigate" ng-click="findMe()" ng-hide="loading"></button>' +
                    '<label class="item-input-wrapper">' +
                    '<input type="search" ng-model="search.query" ng-model-options="{ debounce: 1500 }" placeholder="{{ \'searchText\' | translate }}"></label>' +
                    '<button class="button button-clear" ng-click="closeModalLocation()" translate="cancel"></button>' +
                    '</ion-header-bar>' +
                    '<ion-content padding="false">' +
                    '<ion-list>' +
                    '<div class="center padding" ng-if="loading1"><ion-spinner ></ion-spinner></div>' +
                    '<ion-item ng-repeat="suggestion in search.suggestions" ng-click="choosePlace(suggestion)" ng-bind="suggestion.description"></ion-item>' +
                    '<ion-item class="item-divider"><img src="https://developers.google.com/maps/documentation/places/images/powered-by-google-on-white.png"alt=""/></ion-item>' +
                    '</ion-list>' +
                    '</ion-content>' +
                    '</ion-modal-view>', {
                        scope          : $scope,
                        focusFirstInput: true
                    }
                );

                $scope.modalLocation.show();

                $scope.closeModalLocation = function () {
                    $scope.modalLocation.hide();
                    $scope.modalLocation.remove();
                };

                $scope.$watch('search.query', function (newValue) {
                    if (newValue) {
                        $scope.loading1           = true;
                        $scope.search.suggestions = [];
                        GeoService.searchAddress(newValue).then(function (result) {
                            console.log(result);
                            $scope.search.suggestions = result;
                            $scope.loading1           = false;
                        });
                    }
                });


            });

        }
    }
})();
