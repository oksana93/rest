function test(){

    $.ajax({
        type: "POST",
        cache: false,
        url: '/test',
        data: {
            'location': $("#location").val(),
            'type-rest': $("#type-rest").val(),
            'radius': $("#radius").val()
        },
        success: function (response) {

            //var html = "";
            $.each(response.data, function (i) {
                createMarker(response.data[i]);
                //html = html + response.data[i] + "<br/>";
            });
            //$('#container').html(html);
        }
    });
}
