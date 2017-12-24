function placesSearch() {
    var result;
    var rest = $("#type-rest").val();
    var location = $("#location").val();
    var radius = $("#radius").val();

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
                    deleteMarkers();
                    result = response.data;
                    $.each(result, function (i) {
                        setPlacesMarkers(result[i]);
                    });
                    setWindowPlaces(result);
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
                deleteMarkers();
                result = response.data;
                $.each(result, function (i) {
                    setLocationMarker(result[i], location);
                });
                setWindowPlaces(result);
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
                deleteMarkers();
                result = response.data;
                $.each(result, function (i) {
                    setPlacesMarkers(result[i]);
                });
                setWindowPlaces(result);
            }
        });
    }
}
