function placesSearch() {
    $.ajax({
        type: "POST",
        cache: false,
        url: '/placesSearch',
        data: {
            'location': $("#location").val(),
            'type-rest': $("#type-rest").val(),
            'radius': $("#radius").val()
        },
        success: function (response) {
            deleteMarkers();
            $.each(response.data, function (i) {
                createMarker(response.data[i]);
            });
        }
    });
}

function addressSearch() {
    if ($("#address").val() != "")
        $.ajax({
            type: "POST",
            cache: false,
            url: '/addressSearch',
            data: {
                'address': $("#address").val()
            },
            success: function (response) {
                deleteMarkers();
                createMarker(response.data);
            }
        });
}
