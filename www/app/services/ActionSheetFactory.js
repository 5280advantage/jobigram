(function () {
    'use strict';
    angular.module('starter').factory('ActionSheet', ActionSheetFactory);

    function ActionSheetFactory($ionicActionSheet, Camera, $cordovaActionSheet, $q) {

        return {
            show : show,
            image: image
        };

        function image() {
            var defer = $q.defer();
            show({
                title     : 'Choose an option',
                cancelText: 'Cancel',
                options   : [{text: 'Photo Library'}, {text: 'Photo'}]
            }).then(function (option) {
                var sourceType;
                if (option === 1) {
                    sourceType = 'photoLibrary';
                }

                if (option === 2) {
                    sourceType = 'camera';
                }
                return Camera.getPicture({sourceType: sourceType});
            }).then(defer.resolve).catch(defer.reject);

            return defer.promise;
        }

        function show(params) {

            var defer = $q.defer();

            if (window.cordova) {

                var options = {
                    title                    : params.title,
                    buttonLabels             : _.map(params.options, function (item) {return item.text}),
                    addCancelButtonWithLabel : params.cancelText,
                    androidEnableCancelButton: true,
                    androidTheme             : window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
                };

                $cordovaActionSheet.show(options).then(function (btnIndex) {
                    if (btnIndex !== 3) {
                        defer.resolve(btnIndex);
                    }
                    defer.reject('cancel');
                });

            } else {
                var actionSheet = $ionicActionSheet.show({
                    buttons      : params.options,
                    titleText    : params.title,
                    cancelText   : params.cancelText,
                    cancel       : function () {
                        actionSheet();
                    },
                    buttonClicked: function (btnIndex) {
                        actionSheet();
                        if (btnIndex !== 3) {
                            defer.resolve(btnIndex);
                        }
                        defer.reject('cancel');
                    }
                });

            }
            return defer.promise;
        }
    }

})();
