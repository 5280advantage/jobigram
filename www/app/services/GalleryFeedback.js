(function () {
    'use strict';
    angular.module('starter').factory('GalleryFeedback', GalleryFeedback);

    function GalleryFeedback(Parse) {

        var fields      = [
            'subject',
            'message',
            'user',
        ];
        var ParseObject = Parse.Object.extend('GalleryFeedback', {}, {
            create: put,

        });

        function put(item) {

            if (item.address && item.address.geo) {
                item.location = new Parse.GeoPoint(item.address.geo);
            }

            item.lang = $translate.use();

            if (!item.id) {
                var objPlace = new ParseObject();
                return objPlace.save(item);
            } else {
                return item.save();
            }

        }

        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (value) {
                    this.set(field, value);
                }
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(ParseObject.prototype, 'location', {
            get: function () {
                return this.get('location');
            },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });

        return ParseObject;

    }

})();
