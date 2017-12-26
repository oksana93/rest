function placesSearch() {
    var result = [];
    var rest = $("#type-rest").val();
    var location = $("#location").val();
    var radius = $("#radius").val();
    var opennow = document.getElementById("opennow");
    document.getElementById("place-next").style.visibility = "hidden";

    deletePlaces();
    deleteMarkers();
    setWindowPlaces();
    if (location !== "") { // найти места относительно выбранного положения
        if (rest !== "") {
            document.getElementById("place-next").style.visibility = "visible";
            $.ajax({
                type: "POST",
                cache: false,
                url: '/placesSearch',
                data: {
                    'location': location,
                    'type-rest': rest,
                    'radius': (radius !== "" ? radius : 10)
                },
                success: function (response) {
                    result = response.data;
                    createWindowPlaces(result);
                    $.each(result, function (i) {
                        setPlacesMarkers(result[i]);
                    });
                }
            });
        }
        $.ajax({
            type: "POST",
            cache: false,
            url: '/placeSearchByLocation',
            data: {
                'location': location
            },
            success: function (response) {
                result = response.data;
                createWindowPlaces(result)
                $.each(result, function (i) {
                    setCenterPlacesMarker(result[i], location);
                });
            }
        });
    }
    else if (rest !== "") { // найти места по типу отдыха (от текущего положения)
        document.getElementById("place-next").style.visibility = "visible";
        $.ajax({
            type: "POST",
            cache: false,
            url: '/placesSearchByCurrentMarker',
            data: {
                'lat': currentPosition.lat,
                'lng': currentPosition.lng,
                'type-rest': rest,
                'radius': (radius !== "" ? radius : 10)
            },
            success: function (response) {
                result = response.data;
                createWindowPlaces(result);
                $.each(result, function (i) {
                    setPlacesMarkers(result[i]);
                });
            }
        });
    }
}

function getNextPlaces() {
    deletePlaces();
    deleteMarkers();
    $.ajax({
        type: "POST",
        cache: false,
        url: '/placesPagination',
        data: {},
        success: function (response) {
            result = response.data;
            createWindowPlaces()
            $.each(result, function (i) {
                setPlacesMarkers(result[i]);
            });
        }
    });
}

function citySearch() {
    deletePlaces();
    deleteMarkers();
    setWindowPlaces();
    document.getElementById("place-next").style.visibility = "hidden";
    var city = $("#city").val();
    if (city !== "") {
        $.ajax({
            type: "POST",
            cache: false,
            url: '/placeSearchByLocation',
            data: {
                'location': city
            },
            success: function (response) {
                result = response.data;
                createWindowPlaces(result)
                $.each(result, function (i) {
                    var position = result[i].geometry.location;
                    newGoogleMapByStartPosition(position)
                    setNewCurrentPositionMarker(position.lat, position.lng);
                });
            }
        });
    }
}

function lucky() {
    deletePlaces();
    deleteMarkers();
    setWindowPlaces();
    document.getElementById("place-next").style.visibility = "hidden";
    $.ajax({
        type: "POST",
        cache: false,
        url: '/lucky',
        data: {
            'lat': currentPosition.lat,
            'lng': currentPosition.lng,
        },
        success: function (response) {
            result = response.data;
            createWindowPlaces(result)
            $.each(result, function (i) {
                setPlacesMarkers(result[i]);
            });
        }
    });
}

function getInfoToDistance(place) {
    var result = [];
    $.ajax({
        type: "POST",
        cache: false,
        url: '/getInfo',
        data: {
            'startPositionLat': currentPosition.lat,
            'startPositionLng': currentPosition.lng,
            'destinationPositionLat': place.geometry.location.lat,
            'destinationPositionLng': place.geometry.location.lng
        },
        success: function (response) {
            setDetailsForPlaces(response)
        }
    });
}