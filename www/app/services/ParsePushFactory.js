(function () {
    'use strict';
    angular.module('starter').factory('ParsePush', ParsePushFactory);

    function ParsePushFactory(Parse, $q) {

        return {
            init            : init,
            on              : on,
            subscribe       : subscribe,
            getSubscriptions: getSubscriptions,
            unsubscribe     : unsubscribe,
            subscribeUser   : subscribeUser,
        };


        function init() {
            var defer = $q.defer();
            if (window.ParsePushPlugin) {
                ParsePushPlugin.getInstallationId(function (id) {
                    console.log("device installationId: " + id);
                    subscribeUser();
                    defer.resolve(id);
                }, function (e) {
                    console.log('error', e);
                    defer.reject(e);
                });
            } else {
                defer.reject('Not Parse Push');
            }
            return defer.promise;
        }

        function getSubscriptions() {
            var defer = $q.defer();
            ParsePushPlugin.getSubscriptions(function (subscriptions) {
                console.log(subscriptions);
                defer.resolve(subscriptions);
            }, function (e) {
                console.log('error', e);
                defer.reject(e);
            });
            return defer.promise;
        }


        function subscribeUser() {
            var defer = $q.defer();
            var user  = Parse.User.current();

            if (window.ParsePushPlugin && user) {
                subscribe(user.username);
            } else {
                defer.reject('Not device');
            }
            return defer.promise;
        }

        function on(event, callback) {
            if (window.ParsePushPlugin) {
                ParsePushPlugin.on(event, callback);
            }
        }

        function subscribe(channel) {
            var defer = $q.defer();
            if (window.ParsePushPlugin) {
                ParsePushPlugin.subscribe(channel, function (resp) {
                    console.log('Subcribe in channel', channel);
                    defer.resolve(resp);
                }, function (err) {
                    console.log('Not Subcribe in channel', channel);
                    defer.reject(err);
                });
            }
            return defer.promise;
        }

        function unsubscribe(channel) {
            var defer = $q.defer();
            if (window.ParsePushPlugin) {
                ParsePushPlugin.unsubscribe(channel, function (resp) {
                    console.log('Unsubcribe in channel', channel);
                    defer.resolve(resp);
                }, function (err) {
                    console.log('Not Unsubcribe in channel', channel);
                    defer.reject(err);
                });
            }
            return defer.promise;
        }
    }

})();
