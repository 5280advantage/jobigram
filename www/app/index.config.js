(function () {
    'use strict';

    angular
        .module('starter')
        .run(startParse)
        // Ionic Configuration
        .config(configIonic)
        .run(runIonic)
        // Facebook
        .run(runFacebook)
        .config(configFacebook)
        // ImgCache
        .run(runImgCache)
        .config(configImgCache)
        // AngularJS Perfomance
        .config(configCompile)
    ;


    function configImgCache(ImgCacheProvider) {
        // or more options at once
        ImgCacheProvider.setOptions({
            debug             : false,
            usePersistentCache: true
        });

        // ImgCache library is initialized automatically,
        // but set this option if you are using platform like Ionic -
        // in this case we need init imgcache.js manually after device is ready
        ImgCacheProvider.manualInit = true;
    }

    function runImgCache($ionicPlatform, ImgCache) {
        $ionicPlatform.ready(function () {

            // IMG Cache
            ImgCache.$init();
        });
    }

    function configCompile($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

    function startParse(AppConfig, Parse, $ionicPlatform, ParsePush, $localStorage, $location, $rootScope) {

        // Parse Start
        Parse.init({
            appId : AppConfig.parse.appId,
            server: AppConfig.parse.server,
        });

        // Parse User is Null
        if (!$rootScope.currentUser) {
            $location.path('/');
        }

        // Parse Push Notification
        $ionicPlatform.ready(function () {
            var user = Parse.User.current();
            if (user) {
                ParsePush.init();

            }
        })

        if (!$localStorage.unit) {
            $localStorage.unit = AppConfig.map.unit;
        }

        if (!$localStorage.mapType) {
            $localStorage.mapType = AppConfig.map.type;
        }
    }

    function runIonic($ionicPlatform, $rootScope, amMoment, $translate, $cordovaGlobalization, $cordovaSplashscreen, AppConfig) {

        // Set Theme Color
        $rootScope.theme = AppConfig.theme;

        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
                window.StatusBar.styleLightContent();
            }


            var lang = $translate.use();
            if (lang) {
                $translate.use(lang);
                amMoment.changeLocale(lang);

            } else {
                if (typeof navigator.globalization !== 'undefined') {
                    $cordovaGlobalization.getPreferredLanguage().then(function (language) {
                        $translate.use((language.value).split('-')[0]);
                        amMoment.changeLocale(language.value);
                    }, null);
                }
            }
            // Remove back button android
            //$ionicPlatform.registerBackButtonAction(function (event) {
            //    event.preventDefault();
            //}, 100);


            // Hide Splash Screen
            if (navigator && navigator.splashscreen) {
                $cordovaSplashscreen.hide();
            }


            //ConnectMonitor.watch();
            //
        });


    }

    function configIonic($ionicConfigProvider) {
        $ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.backButton.text(' ').icon('ion-ios-arrow-left');
        //$ionicConfigProvider.backButton.previousTitleText (false).text ('Voltar').icon ('ion-ios-arrow-left');
        //$ionicConfigProvider.views.transition ('platform');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        //$ionicConfigProvider.views.maxCache(1);
    }

// Facebook
    function configFacebook($facebookProvider, AppConfig) {
        if (!window.cordova) {
            $facebookProvider.setAppId(AppConfig.facebookAppId);
            $facebookProvider.setPermissions('id,name,email,user_likes,bio');
        }
    }

    function runFacebook() {

        if (!window.cordova) {
            var LangVar     = window.navigator.language || window.navigator.userLanguage;
            var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js     = d.createElement(s);
                js.id  = id;
                js.src = 'https://connect.facebook.net/' + userLangVar + '/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

    }

})
();
