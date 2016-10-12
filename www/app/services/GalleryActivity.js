(function () {
    'use strict';
    angular.module('starter').factory('GalleryActivity', function (Parse) {

        var fields = [
            'title',
            'gallery',
            'image',
            'imageThumb',
            'fromUser',
            'toUser',
        ];

        var ParseObject = Parse.Object.extend('GalleryActivity', {}, {
            get    : get,
            create : put,
            update : put,
            destroy: destroy,
            feed   : feed,
            all    : all,
        });

        function feed(params) {
            return Parse.Cloud.run('feedActivity', params);
        }

        function all(params) {
            var query = new Parse.Query(this);

            if (params.filter != '') {
                query.contains('words', params.filter);
            }

            // Order Table
            if (params.order) {
                if (params.order.indexOf('-') < -1) {
                    query.ascending(params.order);
                } else {
                    query.descending(params.order.replace('-'));
                }
            }

            if (params.date && params.date !== null) {
                var start = moment(params.date).startOf('day');
                var end   = moment(params.date).endOf('day');
                query.greaterThanOrEqualTo('createdAt', start.toDate());
                query.lessThanOrEqualTo('createdAt', end.toDate());
            }

            if (params.status && params.status !== null) {

                if (params.status === 'pending') {
                    query.doesNotExist('isApproved');
                } else if (params.status === 'rejected') {
                    query.equalTo('isApproved', false);
                } else if (params.status === 'approved') {
                    query.equalTo('isApproved', true);
                }

            }

            query.include(['gallery', 'fromUser', 'toUser']);
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

    });

})();
