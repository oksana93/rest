'use strict';
var defaultPlaces = "Места отдыха";
var placesService;
var googleMap;
var marketYourPosition;
var iconYourPosition = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
var request;
var options;
var infoWindowForPlaces = new google.maps.InfoWindow();
var yourPosition;

$(function () {
    initMap();
});

function initMap() {
    googleMap = new google.maps.Map(document.getElementById("map_canvas"), {
        center: yourPosition, //центрирование
        zoom: 15, // масштабирование
        navigationControlOptions: { // геолокация
            style: google.maps.NavigationControlStyle.SMALL
        }
    });

    if (navigator.geolocation) {
        options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
        navigator.geolocation.watchPosition(
            function (position) {
                yourPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                marketYourPosition = new google.maps.Marker({
                    map: googleMap,
                    position: yourPosition,
                    icon: iconYourPosition,
                    label: {
                        color: 'red',
                        fontWeight: 'bold',
                        text: 'You',
                        fontSize: "20px"
                    }
                });
            },
            function (error) {
                handleLocationError(true, infoWindowForPlaces, googleMap.getCenter());
            },
            options);
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindowForPlaces, googleMap.getCenter());
    }

    google.maps.event.addListener(marketYourPosition, 'click', function () {
        infoWindowForPlaces.setContent("You");
        infoWindowForPlaces.open(googleMap, this);
    });

    mapRequest(yourPosition, "500", "театр");
    service();
}

function mapRequest(location, radius, query) {
    request = {
        location: location,
        radius: radius,
        query: [query]
    };
}


function service() {
    // PlacesService - contains methods related to searching for
    // places and retrieving details about a place.
    placesService = new google.maps.places.PlacesService(googleMap);
    placesService.textSearch(request, callback);
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

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: googleMap,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindowForPlaces.setContent(place.name);
        infoWindowForPlaces.open(googleMap, this);
    });
}

