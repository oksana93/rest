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
            //var html = "";
            $.each(response.data, function (i) {
                createMarker(response.data[i]);
                //html = html + response.data[i] + "<br/>";
            });
            //$('#container').html(html);
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
