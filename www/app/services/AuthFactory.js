(function () {
    'use strict';
    angular.module('starter').factory('Auth', function (Parse, $q) {

        var mSessionToken = null;
        return {
            getLoggedUser  : getLoggedUser,
            setSessionToken: setSessionToken,
            ensureLoggedIn : ensureLoggedIn,
            recoverPassword: recoverPassword,
            resetPassword  : resetPassword,
            logIn          : logIn,
            logOut         : logOut
        };

        function getLoggedUser() {
            return Parse.User.current();
        }

        function setSessionToken(sessionToken) {
            mSessionToken = sessionToken;
        }

        function ensureLoggedIn() {
            var defer = $q.defer();

            if (mSessionToken === null) {
                defer.reject('Session token invalid');
                return defer.promise;
            }

            if (!Parse.User.current()) {
                Parse.User.become(mSessionToken).then(defer.resolve, defer.reject);
            } else {
                defer.resolve(Parse.User.current());
            }

            return defer.promise;
        }

        function recoverPassword(email) {
            var defer = $q.defer();
            Parse.User.requestPasswordReset(email, {
                success: defer.resolve,
                error  : defer.reject
            });

            return defer.promise;
        }

        function resetPassword(email) {

            var defer = $q.defer();

            Parse.User.requestPasswordReset(email, {
                success: defer.resolve,
                error  : defer.reject
            });

            return defer.promise;
        }

        function logIn(obj) {
            var defer = $q.defer();

            Parse.User.logIn(obj.username, obj.password, {
                success: defer.resolve,
                error  : defer.reject
            });

            return defer.promise;
        }

        function logOut() {
            var defer = $q.defer();
            Parse.User.logOut().then(defer.resolve, defer.reject);
            return defer.promise;
        }


    });

})();
