'use strict';
var iconYourPosition = {
    url: '/images/start_marker.png',
    scaledSize: new google.maps.Size(47, 47)
};
var iconPlacePosition = {
    url: '/images/places_marker.png',
    scaledSize: new google.maps.Size(47, 47)
};
var iconLocation = {
    url: '/images/location_small.png',
    scaledSize: new google.maps.Size(47, 47)
};

var infoWindowForPlaces = new google.maps.InfoWindow();
var defaultPosition = {lat: 53.212702, lng: 50.178725};
var zoom = 15;

var options; // geolocation's params
var googleMap;
var markerStartPosition; // geolocation (marker)
var markerLocation; // geolocation (marker)
var markers = []; // other markers

var startPosition; // geolocation (position)
var startLocation; // geolocation (position)
$(function () {
    initMap();
    initSearchWindow();
});

$(document).ready(function () {
    $(".trigger").click(function () {
        $(".panel").toggle("fast").toggleClass("active");
        return false;
    });
});


$(document).ready(function () {
    $(".search").click(function () {
        $(".city-panel").toggle(false);
        $(".hotel-panel").toggle(false);
        $(".search-panel").toggle("fast").toggleClass("active");
    });
});

$(document).ready(function () {
    $(".city").click(function () {
        $(".search-panel").toggle(false);
        $(".hotel-panel").toggle(false);
        $(".city-panel").toggle("fast").toggleClass("active");
        return false;
    });
});

$(document).ready(function () {
    $(".hotel").click(function () {
        $(".city-panel").toggle(false);
        $(".search-panel").toggle(false);
        $(".hotel-panel").toggle("fast").toggleClass("active");
        return false;
    });
});

function initMap() {
    if (navigator.geolocation) {
        options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.watchPosition(
            function (position) {

                startPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setTimeout(function () {
                    googleMap = new google.maps.Map(document.getElementById("map_canvas"), {
                        center: startPosition,
                        zoom: zoom,
                        navigationControlOptions: {
                            style: google.maps.NavigationControlStyle.SMALL
                        }
                    });

                    markerStartPosition = new google.maps.Marker({
                        map: googleMap,
                        position: startPosition,
                        icon: iconYourPosition,
                        size: "20px"
                    });

                    google.maps.event.addListener(markerStartPosition, 'click', function () {
                        infoWindowForPlaces.setContent('Текущее положение<br/>' +
                            'lat: ' + startPosition.lat + '<br/>' +
                            'lng: ' + startPosition.lng);
                        infoWindowForPlaces.open(googleMap, this);
                    });
                }, 500);
            },
            function (error) {
                handleLocationError(true, infoWindowForPlaces, googleMap.getCenter());
            },
            options);
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindowForPlaces, googleMap.getCenter());

        googleMap = new google.maps.Map(document.getElementById("map_canvas"), {
            center: defaultPosition,
            zoom: zoom,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            }
        });
        // mapRequest(defaultPosition, defaultRadius, defaultKeyWord);
        // service();
    }
}

function newGoogleMapByStartPosition(position) {
    googleMap = new google.maps.Map(document.getElementById("map_canvas"), {
        center: position,
        zoom: zoom,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        }
    });
}

function setStartPositionMarker(position) {
    markerStartPosition = new google.maps.Marker({
        map: googleMap,
        position: position,
        icon: iconYourPosition,
        label: {
            color: 'red',
            fontWeight: 'bold',
            text: 'Текущее положение\nlat: ' + position.lat + '\nlng: ' + position.lng,
            fontSize: "20px"
        }
    });
}

function setLocationMarker(place, location) {
    markerLocation = new google.maps.Marker({
        map: googleMap,
        position: place.geometry.location,
        icon: iconLocation,
        label: {
            color: 'red',
            fontWeight: 'bold',
            text: location,
            fontSize: "20px"
        }
    });
}

// function service() {
//     // PlacesService - contains methods related to searching for
//     // places and retrieving details about a place.
//     placesService = new google.maps.places.PlacesService(googleMap);
//     placesService.nearbySearch(request, callback);
// }

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed. Default position' :
        'Error: Your browser doesn\'t support geolocation. Default position');
}

// function callback(results, status) {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//         for (var i = 0; i < results.length; i++) {
//             createMarker(results[i]);
//         }
//     }
// }

function deleteMarkers() {
    if (markers.length > 0) {
        markers.forEach(function callback(marker, markers) {
            marker.setMap(null);
        });
    }
}

function createMarker(place) {
    var marker = new google.maps.Marker({
        icon: iconPlacePosition,
        map: googleMap,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindowForPlaces.setContent(place.name);
        infoWindowForPlaces.open(googleMap, this);
    });
    markers[markers.length + 1] = marker;
}

function initSearchWindow() {
    var location = document.getElementById('location');
    var typeRest = document.getElementById('type-rest');
    var radius = document.getElementById('radius');
    var button = document.getElementById('button');
    var searchBox2 = new google.maps.places.SearchBox(location);
}