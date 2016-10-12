(function () {
    'use strict';
    angular.module('starter').controller('UserIntroCtrl', UserIntroController);

    function UserIntroController($scope, $ionicPlatform, $ionicSlideBoxDelegate, $cordovaSplashscreen) {
        var vm              = this;
        var currentPlatform = window.ionic.Platform.platform();
        vm.slideIndex       = 0;

        vm.slideChanged = function (index) {
            vm.slideIndex = index;
        };
        vm.next         = function () {
            $ionicSlideBoxDelegate.next();
        };
        vm.previous     = function () {
            $ionicSlideBoxDelegate.previous();
        };

        if (currentPlatform) {
            vm.device = (currentPlatform === 'android') ? 'android' : 'iphone';
        } else {
            vm.device = 'android';
        }

        vm.slides                          = [
            {
                text: 'STEP1',
                img : 'img/intro1.png'
            }, {
                text: 'STEP2',
                img : 'img/intro2.png'
            }, {
                text: 'STEP3',
                img : 'img/intro3.png'
            }, {
                text: 'STEP4',
                img : 'img/intro4.png'
            }, {
                text: 'STEP5',
                img : 'img/intro5.png'
            }, {
                text: 'STEP6',
                img : 'img/intro6.png'
            }, {
                text: 'STEP7',
                img : 'img/intro7.png'
            }
        ];
        window.localStorage['walkthrough'] = true;

        $scope.$on('$ionicView.loaded', function () {
            $ionicPlatform.ready(function () {
                if (navigator && navigator.splashscreen) {
                    $cordovaSplashscreen.hide();
                    window.StatusBar.styleLightContent()
                }
            });
        });
    }

})();