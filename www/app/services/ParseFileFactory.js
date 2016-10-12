(function () {
    'use strict';
    angular.module('starter').factory('ParseFile', ParseFile);

    function ParseFile(Parse, $q) {
        return {
            upload: upload
        };

        function upload(file, ext) {
            var defer    = $q.defer();
            var filename = 'file.jpg';

            if (ext) {
                filename.replace('.jpg', ext);
            }

            new Parse.File(filename, file)
                .save({
                    success: defer.resolve,
                    error  : defer.reject
                });
            return defer.promise;
        }
    }

})();
