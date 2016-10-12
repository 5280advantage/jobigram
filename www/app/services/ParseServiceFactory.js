(function () {
    'use strict';
    angular.module('starter').factory('Parse', ParseFactory);

    function ParseFactory($window, $rootScope) {
        var Parse  = $window.Parse;
        Parse.init = init;

        return Parse;

        function init(options) {
            Parse.initialize(options.appId);
            Parse.serverURL        = options.server;
            $rootScope.currentUser = Parse.User.current();
        }

    }

})();