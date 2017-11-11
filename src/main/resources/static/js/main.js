'use strict';


    function initializeMap() {
        var myLatlng = new google.maps.LatLng(50.022451, 36.227070);
        var myOptions = {
            zoom: 10,
            scrollwheel: false,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_LEFT
            }
        }
    }
