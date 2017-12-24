function placesSearch() {
    var rest = $("#type-rest").val();
    var location = $("#location").val();
    var radius = $("#radius").val();

    if (rest === "") {
        if (location !== "") { // найти определенный адрес
            $.ajax({
                type: "POST",
                cache: false,
                url: '/placeSearchByLocation',
                data: {
                    'location': location
                },
                success: function (response) {
                    deleteMarkers();
                    $.each(response.data, function (i) {
                        setLocationMarker(response.data[i], location);
                    });
                }
            });
        }
    } else {
        if (location !== "") { // найти места по типу отдыха (от выбранного положения)
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
                    $.each(response.data, function (i) {
                        createMarker(response.data[i]);
                    });
                }
            });
        }
        else { // найти места по типу отдыха (от текущего положения)
            $.ajax({
                type: "POST",
                cache: false,
                url: '/placesSearchByCurrentMarker',
                data: {
                    'locationPoint': startPosition,
                    'type-rest': rest,
                    'radius': (radius !== "" ? radius : 10)
                },
                success: function (response) {
                    deleteMarkers();
                    $.each(response.data, function (i) {
                        createMarker(response.data[i]);
                    });
                }
            });
        }
    }
}
