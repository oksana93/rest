function placesSearch() {
    var result = [];
    var rest = $("#type-rest").val();
    var location = $("#location").val();
    var radius = $("#radius").val();

    deletePlaces();
    deleteMarkers();
    var opennow = document.getElementById("opennow");
    if (location !== "") { // найти места относительно выбранного положения
        if (rest !== "") {
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
                    setWindowPlaces(result);
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
                setWindowPlaces(result);
                $.each(result, function (i) {
                    setLocationMarker(result[i], location);
                });
            }
        });
    }
    else if (rest !== "") { // найти места по типу отдыха (от текущего положения)
        $.ajax({
            type: "POST",
            cache: false,
            url: '/placesSearchByCurrentMarker',
            data: {
                'lat': startPosition.lat,
                'lng': startPosition.lng,
                'type-rest': rest,
                'radius': (radius !== "" ? radius : 10)
            },
            success: function (response) {
                result = response.data;
                setWindowPlaces(result);
                $.each(result, function (i) {
                    setPlacesMarkers(result[i]);
                });
            }
        });
    }
}
