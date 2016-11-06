(function () {
    'use strict';
    angular.module('starter').factory('GalleryComment', GalleryComment);

    function GalleryComment(Parse, $translate) {

        var fields = [
            'text',
            'user',
        ];

        var ParseObject = Parse.Object.extend('GalleryComment', {}, {
            get    : get,
            create : put,
            update : put,
            destroy: destroy,
            all    : all,
        });


        function all(params) {
            var query = new Parse.Query(this);
            // Order Table
            query.include('user');
            query.ascending('createdAt');
            query.equalTo('gallery', params.gallery);
            query.limit(params.limit);
            query.skip((params.page * params.limit) - params.limit);
            return query.find();
        }

        // Parse Crud
        function get(galleryId) {
            return new Parse.Query(this).include('profile').get(galleryId);
        }

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

        function destroy(item) {
            return item.destroy();
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
