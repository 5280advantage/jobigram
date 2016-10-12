(function () {
    'use strict';

    angular.module('app.main').controller('MainTabCtrl', MainTabController);

    function MainTabController($localStorage, $ionicHistory, ParsePush, GalleryShare, $scope, $rootScope, PhotoService, $ionicPlatform, Gallery, ParseFile, Loading) {
        var vm = this;

        // Android Clear
        $ionicHistory.clearHistory();

        $scope.storage = $localStorage;
        function clearBadge() {
            $scope.badge = 0;
        }

        clearBadge();

        $rootScope.$on('activity:clear', function () {
            clearBadge();
        })

        $ionicPlatform.ready(function () {

            ParsePush.init().then(function () {
                ParsePush.on('openPN', function (pn) {
                    console.log('The user opened a notification:' + JSON.stringify(pn));
                    $scope.$applyAsync();
                });

                ParsePush.on('receivePN', function (pn) {
                    console.log('yo i got this push notification:' + JSON.stringify(pn));
                    $scope.badge++;
                    $scope.$applyAsync();
                });

                ParsePush.on('receivePN', function (message) {
                    console.log('message', message);
                    $scope.$applyAsync();
                });
            })
        });

        vm.postPhoto = function () {
            PhotoService.open().then(GalleryShare.show).then(function (form) {
                Loading.start();
                console.log(form);
                ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                    form.image = imageUploaded;
                    Gallery.create(form).then(function (item) {
                        $rootScope.$emit('photolist:reload');
                        Loading.end();
                    });
                });
            });
        };

    }
})();
