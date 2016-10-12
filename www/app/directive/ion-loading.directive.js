(function () {
    'use strict';

    angular.module('starter')
           .directive('ionLoading', ionLoading)
           .run(runLoading)
           .factory('Loading', Loading);

    function ionLoading() {
        return {
            restrict: 'E',
            scope   : {
                icon   : '@',
                loading: '='
            },
            template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
        };
    }

    function runLoading($rootScope, $ionicLoading) {
        //Loading
        $rootScope.$on('ionicLoading:true', function (text) {
            $rootScope.loading = true;
            $ionicLoading.show(text);
        });
        $rootScope.$on('ionicLoading:false', function () {
            $rootScope.loading = false;
            $ionicLoading.hide();
        });
    }

    function Loading($rootScope, $cordovaProgress, $timeout) {
        var seconds = 0;

        return {
            start: showLoading,
            end  : hideLoading,
        };


        function showLoading(text) {
            if (window.cordova) {
                $cordovaProgress.showSimple();
            } else {
                $rootScope.$broadcast('ionicLoading:true', text);
            }
        }

        function hideLoading() {
            $timeout(function () {
                if (window.cordova) {
                    $cordovaProgress.hide();
                } else {
                    $rootScope.$broadcast('ionicLoading:false');
                }
            }, parseInt(seconds + '000'));
        }
    }
})();