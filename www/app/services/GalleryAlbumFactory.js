(function () {
    'use strict';
    angular.module('starter').factory('GalleryAlbum', GalleryFactory);

    function GalleryFactory(Parse) {

        var fields = [
            'title',
            'qtyPhotos',
            'image',
            'imageThumb'
        ];

        var ParseObject = Parse.Object.extend('GalleryAlbum', {}, {
            get    : get,
            create : put,
            update : put,
            destroy: destroy,
            photos : photos,
            list   : list
        });

        function list(params) {
            return Parse.Cloud.run('listAlbum', params);
        }

        function photos(params) {
            return Parse.Cloud.run('photoAlbum', params);
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
