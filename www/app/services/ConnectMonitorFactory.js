(function () {
    'use strict';
    angular
        .module('starter')
        .factory('ConnectMonitor', ConnectMonitorFactory);

    function ConnectMonitorFactory($rootScope, $cordovaNetwork) {
        
        return {
            watch: watch
        };

        function watch() {

            if (ionic.Platform.isWebView()) {
                $rootScope.onLine = $cordovaNetwork.isOnline();
                $rootScope.$apply();


                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    console.log('went online');
                    $rootScope.onLine = true;
                    $rootScope.$apply();
                });

                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    console.log('went offline');
                    $rootScope.onLine = false;
                    $rootScope.$apply();
                });
            } else {
                $rootScope.onLine = navigator.onLine;
                $rootScope.$apply();

                window.addEventListener('online', function (e) {
                    console.log('went online');
                    $rootScope.onLine = true;
                    $rootScope.$apply();
                }, false);

                window.addEventListener('offline', function (e) {
                    console.log('went offline');
                    $rootScope.onLine = false;
                    $rootScope.$apply();
                }, false);
            }
        }

    }

})();
