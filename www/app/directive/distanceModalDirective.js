(function () {
    'use strict';

    angular.module('starter').directive('distanceModal', distanceModalDirective);

    function distanceModalDirective($localStorage, $ionicModal) {
        return {
            restrict: 'A',
            link    : distanceModalLink
        };

        function distanceModalLink($scope, elem, attr) {

            elem.bind('click', function () {
                    $scope.storage   = $localStorage;
                    $scope.distances = [
                        {
                            val : 0.20,
                            text: 'perto'
                        },
                        {
                            val : 0.60,
                            text: 'longe'
                        },
                        {
                            val : 1.00,
                            text: '1 ' + $scope.storage.unit
                        },
                        {
                            val : 5.00,
                            text: '5 ' + $scope.storage.unit
                        },
                        {
                            val : 10.00,
                            text: '10 ' + $scope.storage.unit
                        },
                        {
                            val : 25.00,
                            text: '25 ' + $scope.storage.unit
                        },
                        {
                            val : 50.00,
                            text: '50 ' + $scope.storage.unit
                        },
                        {
                            val : 100.00,
                            text: '100 ' + $scope.storage.unit
                        },
                    ];

                    $ionicModal.fromTemplateUrl('app/directive/distanceModal.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();

                    });

                    $scope.onDistanceSelected = function (distance) {
                        console.log('Distance', distance);
                    };

                    $scope.closeDistanceModal = function () {
                        $scope.modal.hide();
                        $scope.modal.remove();
                    };


                }
            );
        }
    }

})
();