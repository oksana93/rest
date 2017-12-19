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
            $('#pac-button').click();
        }
    });
}
