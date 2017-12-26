/*------------------------------------------------------*/
/* icon - images */
var iconCurrentPosition = {
    url: '/images/start_marker.png',
    scaledSize: new google.maps.Size(47, 47)
};
var iconPlacesPosition = {
    url: '/images/places_marker.png',
    scaledSize: new google.maps.Size(47, 47)
};
var iconCenterPlacesPosition = {
    url: '/images/location_small.png',
    scaledSize: new google.maps.Size(47, 47)
};

/* maps and params */
var googleMap;
var options;
var zoom = 14;

/* positions */
var defaultCurrentPosition = {lat: 53.212702, lng: 50.178725};
var currentPosition;
var currentAddress = '';

/* infoWindow */
var infoWindowForCurrentPosition = new google.maps.InfoWindow();

/* markers */
var markerCurrentPosition;
var markerCenterPlaces;
var markers = [];

/* city */
var default_city = '';

/* rest's types */
/*------------------------------------------------------*/
/* html */
/* div */
$(document).ready(function () {
    $(".trigger").click(function () {
        $(".search-type-panel").toggle(false);
        $(".panel").toggle("fast").toggleClass("active");
        return false;
    });
    $(".search").click(function () {
        $(".search-type-panel").toggle(false);
        $(".city-panel").toggle(false);
        $(".hotel-panel").toggle(false);
        $(".places-panel").toggle(false);
        $(".place-panel").toggle(false);
        $(".search-panel").toggle().toggleClass("active");
        $(".search-help").toggle().toggleClass("active");
        return false;
    });
    $(".city").click(function () {
        $(".search-panel").toggle(false);
        $(".hotel-panel").toggle(false);
        $(".places-panel").toggle(false);
        $(".place-panel").toggle(false);
        $(".search-type-panel").toggle(false);
        $(".city-panel").toggle().toggleClass("active");
        return false;
    });
    $(".hotel").click(function () {
        $(".city-panel").toggle(false);
        $(".search-panel").toggle(false);
        $(".places-panel").toggle(false);
        $(".place-panel").toggle(false);
        $(".search-type-panel").toggle(false);
        $(".hotel-panel").toggle().toggleClass("active");
        return false;
    });
    $(".place").click(function () {
        $(".city-panel").toggle(false);
        $(".search-panel").toggle(false);
        $(".hotel-panel").toggle(false);
        $(".place-panel").toggle(false);
        $(".search-type-panel").toggle(false);
        $(".places-panel").toggle("fast").toggleClass("active");
        return false;
    });
    $(".search-keyword").click(function () {
        $(".search-type-panel").toggle(false);
        $(".search-keyword-panel").toggle().toggleClass("active");
        return false;
    });
    $(".search-type").click(function () {
        $(".search-keyword-panel").toggle(false);
        $(".search-type-panel").toggle().toggleClass("active");
        return false;
    });
    $(".place-next").click(function () {
        $('#page').val = parseInt($('#page').val) + 1;
    });
    $("#button-city").click(function () {
        default_city = document.getElementById('city').value;
        var location_keyword = document.getElementById('location-keyword');
        var location_type = document.getElementById('location-type');
        location_keyword.value = '';
        location_type.value = '';
    });
    $("#location-keyword").click(function () {
        var location_keyword = document.getElementById('location-keyword');
        location_keyword.value = default_city + ', ';
    });
    $("#location-type").click(function () {
        var location_type = document.getElementById('location-type');
        location_type.value = default_city + ', ';
    });
});


function windowDetailsForPlaces() {
    $(".city-panel").toggle(false);
    $(".hotel-panel").toggle(false);
    $(".search-panel").toggle(false);
    $(".places-panel").toggle(false);
    $(".place-panel").toggle("fast").toggleClass("active");
}

function setWindowPlaces() {
    $(".city-panel").toggle(false);
    $(".hotel-panel").toggle(false);
    $(".search-panel").toggle(false);
    $(".place-panel").toggle(false);
    $(".places-panel").toggle("fast").toggleClass("active");
}

/*------------------------------------------------------*/
/* init function */
$(function () {
    initMap();
   setTimeout(function() {
       initSearchWindow();
   },500);
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

                currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                var geocoder = new google.maps.Geocoder;
                var latlng = {lat: currentPosition.lat, lng: currentPosition.lng};
                geocoder.geocode({'location': latlng}, function (results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            currentAddress = results[1].formatted_address;
                            default_city = results[1].address_components[1].long_name;
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });

                setTimeout(function () {
                    googleMap = new google.maps.Map(document.getElementById("map_canvas"), {
                        center: currentPosition,
                        zoom: zoom,
                        navigationControlOptions: {
                            style: google.maps.NavigationControlStyle.SMALL
                        }
                    });

                    markerCurrentPosition = new google.maps.Marker({
                        map: googleMap,
                        position: currentPosition,
                        icon: iconCurrentPosition,
                        draggable: true,
                        size: "20px"
                    });

                    google.maps.event.addListener(markerCurrentPosition, 'click', function () {
                        infoWindowForCurrentPosition.setContent('Текущее положение<br/>' +
                            'lat: ' + currentPosition.lat + '<br/>' +
                            'lng: ' + currentPosition.lng + '<br/>' +
                            currentAddress);
                        infoWindowForCurrentPosition.open(googleMap, this);
                    });

                    google.maps.event.addListener(markerCurrentPosition, 'dragend', function (event) {
                        setNewCurrentPositionMarker(event.latLng.lat(), event.latLng.lng());  // Координаты маркера
                    });
                }, 500);
            },
            function (error) {
                handleLocationError(true, infoWindowForCurrentPosition, googleMap.getCenter());
            },
            options);
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindowForCurrentPosition, googleMap.getCenter());

        googleMap = new google.maps.Map(document.getElementById("map_canvas"), {
            center: defaultCurrentPosition,
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

function initSearchWindow() {
    getRestTypes();

    var location_keyword = document.getElementById('location-keyword');
    var location_type = document.getElementById('location-type');

    var options_location = {
        language: 'ru'
    };
    var autocomplete_location_keyword = new google.maps.places.Autocomplete(location_keyword, options_location);
    var autocomplete_location_type = new google.maps.places.Autocomplete(location_type, options_location);
    var options_city = {
        types: ['(cities)']
    };
    var autocomplete_cities = new google.maps.places.Autocomplete(city, options_city);

}

/*------------------------------------------------------*/

/* new city - new map */
function newGoogleMapByStartPosition(position) {
    markerCurrentPosition.setMap(null);
    googleMap = new google.maps.Map(document.getElementById("map_canvas"), {
        center: position,
        zoom: zoom,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        }
    });
}

/*------------------------------------------------------*/

/* new markerCurrentPosition */
function setNewCurrentPositionMarker(lat, lng) {
    currentPosition.lat = lat;
    currentPosition.lng = lng;

    markerCurrentPosition.setMap(null);
    markerCurrentPosition = new google.maps.Marker({
        map: googleMap,
        position: currentPosition,
        icon: iconCurrentPosition,
        draggable: true,
        size: "20px"
    });

    google.maps.event.addListener(markerCurrentPosition, 'click', function () {
        infoWindowForCurrentPosition.setContent('Текущее положение<br/>' +
            'lat: ' + currentPosition.lat + '<br/>' +
            'lng: ' + currentPosition.lng);
        infoWindowForCurrentPosition.open(googleMap, this);
    });

    google.maps.event.addListener(markerCurrentPosition, 'dragend', function (event) {
        infoWindowForCurrentPosition.close();
        setNewCurrentPositionMarker(event.latLng.lat(), event.latLng.lng());  // Координаты маркера
    });
}

/*------------------------------------------------------*/
/* place-panel */

/* places */
var places = [];
var placeHrefElements = [];

function deletePlaces() {
    var ol = document.getElementById("ol");
    ol.innerHTML = '';
    placeHrefElements = [];
    places = [];
}

function setDetailsForPlaces(place) {
    var placePanel = document.getElementById("place-panel");

    var placeInfoBlock = document.getElementById("placeInfo");

    if (placeInfoBlock) {
        placeInfoBlock.innerHTML = '';
    }
    else {
        placeInfoBlock = document.createElement("div");
        placeInfoBlock.id = 'placeInfo';
    }

    var name = document.createElement("p");
    name.innerHTML = "Адрес: " + place.name;

    var distance = document.createElement("p");
    distance.innerHTML = "Расстояние от начальной точки: " + place.distance;

    var duration = document.createElement("p");
    duration.innerHTML = "Время пути: " + place.duration;

    var cost = document.createElement("p");
    cost.innerHTML = "Стоимость ('Туда-Назад'): " + place.cost;

    placeInfoBlock.appendChild(name);
    placeInfoBlock.appendChild(distance);
    placeInfoBlock.appendChild(duration);
    placeInfoBlock.appendChild(cost);

    placePanel.appendChild(placeInfoBlock);

}

/*------------------------------------------------------*/

/* places-panel */

function createWindowPlaces(result) {
    var ol = document.getElementById("ol");
    $.each(result, function (i) {
        var h3 = document.createElement("h3");
        h3.innerHTML = (result[i].name === undefined ? 'Address' : result[i].name);
        h3.setAttribute("style", "color: rgba(0,0,0,0.6)");
        var a = document.createElement("a");
        a.class = 'place';
        a.setAttribute("style", "color: rgba(64, 167, 179, 1)ж; font-size: 14px");
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
}

/*------------------------------------------------------*/

/* markers */
function deleteMarkers() {
    if (markers.length > 0) {
        markers.forEach(function callback(marker, markers) {
            marker.setMap(null);
        });
    }
    markers = [];
}

/* new location (center) */
function setCenterPlacesMarker(place) {
    markerCenterPlaces = new google.maps.Marker({
        map: googleMap,
        position: place.geometry.location,
        icon: iconCenterPlacesPosition
    });
    places[places.length + 1] = place;
    google.maps.event.addListener(markerCenterPlaces, 'click', function () {
        infoWindowForCurrentPosition.setContent(place.formatted_address);
        infoWindowForCurrentPosition.open(googleMap, this);
        infoWindowForCurrentPosition.gm_bindings_.maxWidth = 150;
    });
}

function setPlacesMarkers(place) {
    var marker = new google.maps.Marker({
        icon: iconPlacesPosition,
        map: googleMap,
        position: place.geometry.location
    });
    places[places.length + 1] = place;
    google.maps.event.addListener(marker, 'click', function () {
        infoWindowForCurrentPosition.setContent(place.name);
        infoWindowForCurrentPosition.open(googleMap, this);
    });
    markers[markers.length + 1] = marker;
}

/*------------------------------------------------------*/

/* filters */
function setFilterToPlaces() {
    $.each(places, function (i) {
        if (places[i].opennow === "true")
            places[i].setAnimation(google.maps.Animation.BOUNCE);
        else
            markers[i].setAnimation(null);
    });
}