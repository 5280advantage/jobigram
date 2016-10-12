(function () {
    'use strict';
    angular.module('starter').factory('Geolocation', GeolocationFactory);

    function GeolocationFactory($ionicPlatform, $q) {
        return {
            getCurrentPosition: getCurrentPosition
        };

        function getCurrentPosition($cordovaGeolocation) {
            var defer = $q.defer();

            $ionicPlatform.ready(function () {
                var options = {
                    maximumAge        : 3000,
                    timeout           : 1000,
                    enableHighAccuracy: true
                };

                var options = {timeout: 10000, enableHighAccuracy: true};

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            // Get current cordinates.
                            console.log(position);
                            defer.resolve(position);
                        },
                        function(error) {
                            defer.reject(error);
                        },
                        {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
                    );
                }
                
                //$cordovaGeolocation.getCurrentPosition(options).then(defer.resolve).catch(defer.reject);

                //navigator.geolocation.getCurrentPosition(
                //    defer.resolve,
                //    defer.reject,
                //    options);
            });

            return defer.promise;
        }
    }

})();