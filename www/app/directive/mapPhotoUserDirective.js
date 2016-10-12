(function () {
    'use strict';

    angular.module('starter').directive('mapPhotoUser', mapPhotoUserDirective);

    function mapPhotoUserDirective($state, $localStorage, Toast, Gallery, Geolocation, Dialog) {
        return {
            restrict: 'E',
            link    : mapPhotoUserLink,
            scope      : {
                username  : '=',
                load      : '=',
                onReload  : '=',
            },
            templateUrl: 'app/directive/mapPhotoUserDirective.html'
        };

        function mapPhotoUserLink($scope, elem, attr) {

            var markers      = [];
            var latlngbounds = new google.maps.LatLngBounds();
            $scope.maxRating = 5;
            $scope.storage   = $localStorage;
            $scope.galleries = [];
            $scope.params    = {
                location: null,
                distance: 100.00,
                page    : 1,
                limit   : 10,
                username: $scope.username
            };
            $scope.loading   = true;
            $scope.map

            function init() {
                $scope.galleries = [];
                removeGallerys();
                removeMarkers();

                var position   = {
                    latitude : -18.8800397,
                    longitude: -47.05878999999999
                };
                var mapOptions = {
                    center   : setPosition(position),
                    zoom     : 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
            }

            init();
            myPosition();


            function myPosition() {
                Geolocation.getCurrentPosition().then(function (position) {

                    console.log(position);

                    $scope.params.location = {
                        latitude : position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    var marker = {
                        position: setPosition($scope.params.location),
                        title   : 'I am here',
                        id      : 0
                    }

                    addMarker(marker);

                    // Set center locale
                    $scope.map.setCenter(setPosition($scope.params.location));

                    loadGallerys();
                }, function (error) {
                    $scope.params.location = null;

                    var errorMessage;
                    if (error.code === 1 || error.code === 3) {
                        errorMessage = 'errorGpsDisabledText';
                    } else {
                        errorMessage = 'errorLocationMissingText';
                    }
                    Dialog.alert(errorMessage);

                });
            }

            function setPosition(location) {
                if (location) {
                    return new google.maps.LatLng(location.latitude, location.longitude);
                }
            }

            function addMarker(item) {


                var markerOption = {
                    id       : item.id,
                    map      : $scope.map,
                    position : item.position,
                    title    : item.title,
                    animation: google.maps.Animation.DROP
                };

                if (item.icon) {
                    var size          = 40;
                    markerOption.icon = {
                        url       : item.icon,
                        size      : new google.maps.Size(size, size),
                        scaledSize: new google.maps.Size(size, size),
                        origin    : new google.maps.Point(0, 0),
                        anchor    : new google.maps.Point(size / 4, size / 4),
                    };
                }

                // VariÃ¡vel que define as opÃ§Ãµes do marcador
                var marker = new google.maps.Marker(markerOption);

                // Procedimento que mostra a Info Window atravÃ©s de um click no marcador
                google.maps.event.addListener(marker, 'click', function () {
                    // Open Profile
                    //if(item.username) {
                    //    $state.go('tab.mapProfile', {username: item.username})
                    //}

                    console.log(item.username);

                });

                markers.push(marker);

                new MarkerClusterer($scope.map, markers, {
                    imagePath: '../img/m'
                });

                latlngbounds.extend(item.position);
                $scope.map.fitBounds(latlngbounds);
            }

            function setGallerys(galleries) {
                $scope.galleries = galleries;
                galleries.map(function (item) {

                    if (item.location) {
                        var marker = {
                            map     : $scope.map,
                            id      : item.id,
                            position: setPosition(item.location),
                            title   : item.title,
                            image   : item.image.url(),
                            icon    : item.imageThumb.url(),
                            //username: item.user.attributes.username
                        };

                        addMarker(marker)
                    }
                });


            }

            function loadGallerys() {
                $scope.loading = true;
                Gallery.feed($scope.params).then(function (galleries) {

                    if (galleries.length > 0) {
                        setGallerys(galleries);
                    } else {
                        Dialog.alert('galleriesNotFoundText');
                    }

                    $scope.loading = false;

                }, function () {
                    Toast.show('errorText');
                });
            }

            function removeGallerys() {
                $scope.galleries = [];
            }

            function removeMarkers() {
                markers.map(function (item) {
                    item.setMap(null);
                });
                markers = [];
            };

            $scope.onSearchHere = function () {
                $scope.params.location.latitude  = $scope.map.getCenter().lat();
                $scope.params.location.longitude = $scope.map.getCenter().lng();
                removeGallerys();
                removeMarkers();
                loadGallerys();
            }

            $scope.onGalleryClicked = function (item) {
                console.log(item);
            };
        }
    }

})();