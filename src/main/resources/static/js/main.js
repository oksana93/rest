'use strict';
var defaultKeyWord = "Кинотеатр";
var defaultRadius = '2000';
var iconYourPosition = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
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
                        label: {
                            color: 'red',
                            fontWeight: 'bold',
                            text: 'You',
                            fontSize: "20px"
                        }
                    });

                    google.maps.event.addListener(markerStartPosition, 'click', function () {
                        infoWindowForPlaces.setContent('<p>Текущее положение</p>' +
                            '<p>lat: ' + startPosition.lat + '</p>' +
                            '<p>lng: ' + startPosition.lng);
                        infoWindowForPlaces.open(googleMap, this);
                    });

                    request = mapRequest(startPosition, defaultRadius, defaultKeyWord);
                    service();
                    initSearchWindow();
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
        initSearchWindow();
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

function createMarker(place) {
    var placeLoc = place.geometry.location;
    markers = new google.maps.Marker({
        map: googleMap,
        position: place.geometry.location
    });

    google.maps.event.addListener(markers, 'click', function () {
        infoWindowForPlaces.setContent(place.name);
        infoWindowForPlaces.open(googleMap, this);
    });
}

function initSearchWindow() {
    var form = document.getElementsByClassName("controls");
    var input = document.getElementById('pac-input');
    var button = document.getElementById('pac-button');
    var searchBox = new google.maps.places.SearchBox(input);
    //googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(form);
    // googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(button);

    // Bias the SearchBox results towards current map's viewport.
    googleMap.addListener('bounds_changed', function () {
        searchBox.setBounds(googleMap.getBounds());
    });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.get("pac-input");

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        // var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}