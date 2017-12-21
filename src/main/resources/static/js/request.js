function placesSearch() {
    var rest = $("#type-rest").val();
    var location = $("#location").val();
    var radius = $("#radius").val();

    if (rest === "") {
        if (location !== "") {
            $.ajax({
                type: "POST",
                cache: false,
                url: '/addressSearch',
                data: {
                    'address': location
                },
                success: function (response) {
                    deleteMarkers();
                    createMarker(response.data);
                }
            });
        }
    } else if (location !== "") {
        $.ajax({
            type: "POST",
            cache: false,
            url: '/placesSearch',
            data: {
                'location': location, /*(location !== ""? location: ),*/
                'type-rest': rest,
                'radius': (radius !== "" ? radius : 10000)
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
