'use strict';
    var map;
    var infowindow;


    function initMap() {

        var pyrmont = {lat: 53.212702, lng: 50.178725};

        map = new google.maps.Map(document.getElementById("map_canvas"), {
            center: pyrmont,
            zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        // PlacesService - contains methods related to searching for
        // places and retrieving details about a place.
        var request = {
            location: pyrmont,
            radius: 1000,
            query: ['кинотеатр']
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
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
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    }
$(function(){

    initMap();
})
