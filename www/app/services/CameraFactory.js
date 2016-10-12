(function () {
    'use strict';
    angular.module('starter').service('Camera', CameraFactory);

    function CameraFactory($cordovaCamera, $q) {

        return {
            getPicture   : getPicture,
            resizeImage  : resizeImage,
            toBase64Image: toBase64Image
        };

        function getPicture(params) {

            var defer = $q.defer();
            if (window.cordova) {
                var sourceType = params.sourceType || Camera.PictureSourceType.CAMERA;
                if (params.sourceType === 'photoLibrary') {
                    sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                }
                if (params.sourceType === 'camera') {
                    sourceType = Camera.PictureSourceType.CAMERA;
                }

                var options = {
                    quality           : 70,
                    targetWidth       : 800,
                    targetHeight      : 800,
                    saveToPhotoAlbum  : false,
                    correctOrientation: true,
                    sourceType        : sourceType,
                    destinationType   : Camera.DestinationType.DATA_URL,
                    encodingType      : Camera.EncodingType.JPEG,
                };

                $cordovaCamera.getPicture(options).then(defer.resolve, defer.reject);
            } else {
                console.log('Input File');
                //defer.reject('Unsupported platform');

                var fileInput = angular.element('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
                fileInput[0].click();
                fileInput.on('change', function (evt) {
                    var tempImage = evt.currentTarget.files[0];
                    var reader    = new FileReader();
                    reader.onload = function (evt) {
                        defer.resolve(evt.target.result);
                    };
                    reader.readAsDataURL(tempImage);
                });
            }

            return defer.promise;
        }

        //https://github.com/timkalinowski/PhoneGap-Image-Resizer
        function toBase64Image(img_path, width, height) {
            var defer = $q.defer();
            window.imageResizer.resizeImage(defer.resolve, defer.reject, img_path, width || 1, height || 1, {
                imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                resizeType   : ImageResizer.RESIZE_TYPE_FACTOR,
                format       : 'jpg'
            });

            return defer.promise;
        }

        function resizeImage(img_path, width, height) {
            var defer = $q.defer();
            window.imageResizer.resizeImage(defer.resolve, defer.reject,  img_path, width || 640, height || 640, {
                imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                resizeType   : ImageResizer.RESIZE_TYPE_MIN_PIXEL,
                pixelDensity : true,
                storeImage   : false,
                photoAlbum   : false,
                format       : 'jpg'
            });

            return defer.promise;
        }

    }

})();
