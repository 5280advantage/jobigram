(function () {
    'use strict';
    angular.module('starter').factory('Share', ShareFactory);

    function ShareFactory($cordovaSocialSharing) {

        var TAG = 'ShareService';

        return {
            open: open
        };

        function open(item) {
            if (window.cordova && item) {
                //.share(message, subject, file, link)
                $cordovaSocialSharing.share(item.title, item.userName, item.image, item.url).then(function (result) {
                    console.log(result);
                }, function (err) {
                    console.warn(err);
                });
            } else {
                console.warn('[' + TAG + '] Unsupported platform');
            }
        }

    }
})();
