'use strict';
var defaultKeyWord = 'Ресторан';
var defaultRadius = '10000';
var iconYourPosition = {
    url: '/images/start_marker.png',
    scaledSize: new google.maps.Size(67, 67)
};
var iconPlacePosition = {
    url: '/images/places_marker.png',
    scaledSize: new google.maps.Size(67, 67)
}
var infoWindowForPlaces = new google.maps.InfoWindow();
var defaultPosition = {lat: 53.212702, lng: 50.178725};
var zoom = 15;

var request; // map's params (markers, radius...)
var options; // geolocation's params
var placesService; // set markers
var googleMap;
var startPosition; // geolocation (position)
var markerStartPosition; // geolocation (marker)
var markers = []; // other markers

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
        // $("#location").text(
        //     "<p>Lng: " + startPosition.lng + "</p>" +
        //     "<p>Ltg: " + startPosition.lat + "</p>");
        // return false;
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
                        infoWindowForPlaces.setContent('<p>Текущее положение</p>' +
                            '<p>lat: ' + startPosition.lat + '</p>' +
                            '<p>lng: ' + startPosition.lng);
                        infoWindowForPlaces.open(googleMap, this);
                    });
                    // request = mapRequest(startPosition, defaultRadius, defaultKeyWord);
                    // service();
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

        mapRequest(defaultPosition, defaultRadius, defaultKeyWord);
        service();
        // initSearchWindow();
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

function setStartPosition(position) {
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

// request for search
function mapRequest(location, radius, query) {
    request = {
        location: location,
        radius: radius,
        name: [query]
    };
}

function service() {
    // PlacesService - contains methods related to searching for
    // places and retrieving details about a place.
    placesService = new google.maps.places.PlacesService(googleMap);
    placesService.nearbySearch(request, callback);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed. Default position' :
        'Error: Your browser doesn\'t support geolocation. Default position');
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function deleteMarkers() {
    if (markers.length > 0) {
        markers.forEach(function callback(marker, markers) {
            marker.setMap(null);
        });
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        icon: iconPlacePosition,
        map: googleMap,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindowForPlaces.setContent(place.name);
        infoWindowForPlaces.open(googleMap, this);
    });
    markers[markers.length+1] = marker;
}

function initSearchWindow() {
    var address = document.getElementById('address');
    var location = document.getElementById('location');
    var typeRest = document.getElementById('type-rest');
    var radius = document.getElementById('radius');
    var button = document.getElementById('button');
    var searchBox1 = new google.maps.places.SearchBox(address);
    var searchBox2 = new google.maps.places.SearchBox(location);

    // googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(location);
    // googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(typeRest);
    // googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(radius);
    // googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(button);


    // Bias the SearchBox results towards current map's viewport.
    // googleMap.addListener('bounds_changed', function () {
    //     searchBox.setBounds(googleMap.getBounds());
    // });
    //
    // searchBox.addListener('places_changed', function () {
    //     var places = searchBox.get("location");
    //
    //     if (places.length == 0) {
    //         return;
    //     }
    //
    //     // Clear out the old markers.
    //     markers.forEach(function (marker) {
    //         marker.setMap(null);
    //     });
    //     markers = [];
    //
    //     // For each place, get the icon, name and location.
    //     // var bounds = new google.maps.LatLngBounds();
    //     places.forEach(function (place) {
    //         if (!place.geometry) {
    //             console.log("Returned place contains no geometry");
    //             return;
    //         }
    //         var icon = {
    //             url: place.icon,
    //             size: new google.maps.Size(71, 71),
    //             origin: new google.maps.Point(0, 0),
    //             anchor: new google.maps.Point(17, 34),
    //             scaledSize: new google.maps.Size(25, 25)
    //         };
    //
    //         // Create a marker for each place.
    //         markers.push(new google.maps.Marker({
    //             map: map,
    //             icon: icon,
    //             title: place.name,
    //             position: place.geometry.location
    //         }));
    //
    //         if (place.geometry.viewport) {
    //             // Only geocodes have viewport.
    //             bounds.union(place.geometry.viewport);
    //         } else {
    //             bounds.extend(place.geometry.location);
    //         }
    //     });
    //     map.fitBounds(bounds);
    // });
}