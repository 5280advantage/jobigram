(function () {
    'use strict';

    angular.module('app.main').controller('LoadingCtrl', LoadingController);

    function LoadingController($scope, Parse, $ionicPlatform, $cordovaSplashscreen, AppConfig, $state) {
        var user = Parse.User.current();

        if (user) {
            if (user) {
                $state.go(AppConfig.routes.home, {
                    clear: true
                });
            } else {
                $state.go('avatar', {
                    clear: true
                });
            }
        } else {
            $state.go(AppConfig.routes.login, {
                clear: true
            });
        }

        $scope.$on('$ionicView.loaded', function () {
            $ionicPlatform.ready(function () {
                if (navigator && navigator.splashscreen) {
                    $cordovaSplashscreen.hide();
                }
            });
        });

    }

})();
