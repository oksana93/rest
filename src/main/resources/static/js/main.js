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

var zoom = 15;

var options; // geolocation's params
var googleMap;

var defaultPosition = {lat: 53.212702, lng: 50.178725};
var startPosition; // geolocation (position)

var infoWindowForStartPosition = new google.maps.InfoWindow();
var infoWindowForPlaces = new google.maps.InfoWindow();

var markerStartPosition; // geolocation (marker)
var markerLocation; // location
var markers = []; // other markers

var places = []

$(function () {
    initMap();
    initSearchWindow();
});

$(document).ready(function () {
    $(".trigger").click(function () {
        $(".panel").toggle("fast").toggleClass("active");
        return false;
    });
    $(".search").click(function () {
        $(".city-panel").toggle(false);
        $(".hotel-panel").toggle(false);
        $(".places-panel").toggle(false);
        $(".place-panel").toggle(false);
        $(".search-panel").toggle("fast").toggleClass("active");
        return false;
    });
    $(".city").click(function () {
        $(".search-panel").toggle(false);
        $(".hotel-panel").toggle(false);
        $(".places-panel").toggle(false);
        $(".place-panel").toggle(false);
        $(".city-panel").toggle("fast").toggleClass("active");
        return false;
    });
    $(".hotel").click(function () {
        $(".city-panel").toggle(false);
        $(".search-panel").toggle(false);
        $(".places-panel").toggle(false);
        $(".place-panel").toggle(false);
        $(".hotel-panel").toggle("fast").toggleClass("active");
        return false;
    });
    $(".place").click(function () {
        $(".city-panel").toggle(false);
        $(".search-panel").toggle(false);
        $(".hotel-panel").toggle(false);
        $(".place-panel").toggle(false);
        $(".places-panel").toggle("fast").toggleClass("active");
        return false;
    });
});

function initSearchWindow() {
    var location = document.getElementById('location');
    var rest = document.getElementById('rest');
    var radius = document.getElementById('radius');
    var button = document.getElementById('button');
    var searchBox2 = new google.maps.places.SearchBox(location);
}

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
                        draggable: true,
                        size: "20px"
                    });

                    google.maps.event.addListener(markerStartPosition, 'click', function () {
                        infoWindowForPlaces.setContent('Текущее положение<br/>' +
                            'lat: ' + startPosition.lat + '<br/>' +
                            'lng: ' + startPosition.lng);
                        infoWindowForPlaces.open(googleMap, this);
                    });

                    google.maps.event.addListener(markerStartPosition, 'dragend', function (event) {
                        setStartPositionMarker(event.latLng.lat(), event.latLng.lng());  // Координаты маркера
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
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed. Default position' :
        'Error: Your browser doesn\'t support geolocation. Default position');
}

/* new city */
function newGoogleMapByStartPosition(position) {
    markerStartPosition.setMap(null);
    googleMap = new google.maps.Map(document.getElementById("map_canvas"), {
        center: position,
        zoom: zoom,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        }
    });
}

/* new StartPositionMarker */
function setStartPositionMarker(lat, lng) {
    startPosition.lat = lat;
    startPosition.lng = lng;

    markerStartPosition = new google.maps.Marker({
        map: googleMap,
        position: startPosition,
        icon: iconYourPosition,
        draggable: true,
        size: "20px"
    });

    google.maps.event.addListener(markerStartPosition, 'click', function () {
        infoWindowForPlaces.setContent('Текущее положение<br/>' +
            'lat: ' + startPosition.lat + '<br/>' +
            'lng: ' + startPosition.lng);
        infoWindowForPlaces.open(googleMap, this);
    });

    google.maps.event.addListener(markerStartPosition, 'dragend', function (event) {
        infoWindowForPlaces.close();
        setStartPositionMarker(event.latLng.lat(), event.latLng.lng());  // Координаты маркера
    });
}

var placeHrefElements = [];

function deletePlaces() {
    var placesPanel = document.getElementById("places-panel");
    placesPanel.innerHTML = '';
    placeHrefElements = [];
    places = [];
}

function setDetailsForPlaces(place) {
    var placePanel  = document.getElementById("place-panel");

    var placeInfoBlock = document.getElementById("placeInfo") ;

    if (placeInfoBlock)
    {
        placeInfoBlock.innerHTML = '';
    }
    else
    {
        placeInfoBlock = document.createElement("div");
        placeInfoBlock.id = 'placeInfo';
    }

    var name = document.createElement("p");
    name.innerHTML = "Адрес: "+place.name;

    var distance = document.createElement("p");
    distance.innerHTML = "Расстояние от начальной точки: "+place.distance;

    var duration = document.createElement("p");
    duration.innerHTML = "Время пути: "+place.duration;

    var cost = document.createElement("p");
    cost.innerHTML = "Стоимость ('Туда-Назад'): "+place.cost;

    placeInfoBlock.appendChild(name);
    placeInfoBlock.appendChild(distance);
    placeInfoBlock.appendChild(duration);
    placeInfoBlock.appendChild(cost);

    placePanel.appendChild(placeInfoBlock);

}

function windowDetailsForPlaces() {
    $(".city-panel").toggle(false);
    $(".hotel-panel").toggle(false);
    $(".search-panel").toggle(false);
    $(".places-panel").toggle(false);
    $(".place-panel").toggle("fast").toggleClass("active");
}

function setWindowPlaces(result) {
    var placesPanel = document.getElementById("places-panel");

    $(".city-panel").toggle(false);
    $(".hotel-panel").toggle(false);
    $(".search-panel").toggle(false);
    $(".place-panel").toggle(false);
    $(".places-panel").toggle("fast").toggleClass("active");

    var ol = document.createElement("ol");
    $.each(result, function (i) {
        var h3 = document.createElement("h3");
        h3.innerHTML = (result[i].name === undefined ? 'Address' : result[i].name);
        h3.setAttribute("style", "color: rgba(0,0,0,0.6)");
        var a = document.createElement("a");
        a.class = 'place';
        a.setAttribute("style", "color: rgba(64, 167, 179, 1)");
        a.text = (result[i].vicinity === undefined ? result[i].formatted_address : result[i].vicinity);
        a.href = '#';
        a.title = 'Получить полную информацию';
        a.onclick = function () {
            windowDetailsForPlaces();
            getInfoToDistance(result[i]);
        };

        var p = document.createElement("p");
        var li = document.createElement("li");

        p.appendChild(h3);
        p.appendChild(a);
        li.appendChild(p);
        ol.appendChild(li);
    });
    placesPanel.appendChild(ol);
}


function deleteMarkers() {
    if (markers.length > 0) {
        markers.forEach(function callback(marker, markers) {
            marker.setMap(null);
        });
    }
    markers = [];
}

/* new location */
function setLocationMarker(place) {
    markerLocation = new google.maps.Marker({
        map: googleMap,
        position: place.geometry.location,
        icon: iconLocation
    });
    places[places.length + 1] = place;
    google.maps.event.addListener(markerLocation, 'click', function () {
        infoWindowForPlaces.setContent(place.formatted_address);
        infoWindowForPlaces.open(googleMap, this);
        infoWindowForPlaces.gm_bindings_.maxWidth = 150;
    });
}

function setPlacesMarkers(place) {
    var marker = new google.maps.Marker({
        icon: iconPlacePosition,
        map: googleMap,
        position: place.geometry.location
    });
    places[places.length + 1] = place;
    google.maps.event.addListener(marker, 'click', function () {
        infoWindowForPlaces.setContent(place.name);
        infoWindowForPlaces.open(googleMap, this);
    });
    markers[markers.length + 1] = marker;
}

function setFilterToPlaces() {
    $.each(places, function (i) {
        if (places[i].opennow === "true")
            places[i].setAnimation(google.maps.Animation.BOUNCE);
        else
            markers[i].setAnimation(null);
    });
}