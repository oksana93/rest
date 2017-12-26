package com.place.view;

import com.place.google.main.GeoPack;
import com.place.google.main.Point;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.*;

@Controller

public class MainController {
    private final String[] types =
            {"amusement_park", "aquarium", "art_gallery", "atm", "bar", "beauty_salon", "bicycle_store", "book_store",
                    "cafe", "campground", "casino", "clothing_store", "convenience_store", "department_store", "electronics_store",
                    "florist", "food", "furniture_store", "gym", "hair_care", "hardware_store", "health", "hindu_temple", "home_goods_store",
                    "laundry", "library", "liquor_store", "meal_delivery", "meal_takeaway", "movie_rental", "movie_theater", "moving_company",
                    "museum", "night_club", "painter", "park", "place_of_worship", "restaurant",
                    "shoe_store", "shopping_mall", "spa", "stadium", "store", "travel_agency", "zoo"};

    private String convertToMeters(String radiusKm) {
        Float radius = Float.valueOf(radiusKm) * 1000;
        return radius.toString();
    }

    @RequestMapping("/")
    public String user(Model model) {
        return "index";
    }

    @RequestMapping("/2")
    public String map(Model model) {
        return "map";
    }

    @RequestMapping(value = "/placeSearchByLocation", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placeSearchByLocation(@RequestParam("location") String location) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(
                    GeoPack.getPointByLocation(location)));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearchByKeyWord", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearch(
            @RequestParam("location") String location,
            @RequestParam("keyword") String keyword,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(
                    GeoPack.getPointsByKeyword(keyword, location, convertToMeters(radius))));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearchByCurrentMarkerAndKeyWord", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearchByCurrentMarker(
            @RequestParam("lat") String lat,
            @RequestParam("lng") String lng,
            @RequestParam("keyword") String keyword,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(GeoPack.getPointsByCurrentMarkerAndKeyWord(keyword, lat, lng, convertToMeters(radius))));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/getInfo", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, String> getPointInfo(
            @RequestParam("startPositionLat") String startPositionLat,
            @RequestParam("startPositionLng") String startPositionLng,
            @RequestParam("destinationPositionLat") String destinationPositionLat,
            @RequestParam("destinationPositionLng") String destinationPositionLng
    ) {
        Point startPosition = new Point(Double.parseDouble(startPositionLng), Double.parseDouble(startPositionLat));
        Point destinationPosition = new Point(Double.parseDouble(destinationPositionLng), Double.parseDouble(destinationPositionLat));

        Map<String, String> response = GeoPack.getDistanceInfo(startPosition, destinationPosition);
        return response;
    }


    private String setAnyType() {
        Random random = new Random();
        return types[random.nextInt(types.length - 1)];
    }

    private String setAnyRadius() {
        int radius = new Random().nextInt(45000) + 5000;
        return String.valueOf(radius);
    }


    @RequestMapping(value = "/lucky", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> luckyButton(
            @RequestParam("lat") String lat,
            @RequestParam("lng") String lng) {
        String type = setAnyType();
        String radius = setAnyRadius();
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            List<Object> result = GeoPack.toList(GeoPack.getPointsByCurrentMarkerAndType(type, lat, lng, radius));
            List<Object> responseResult = new ArrayList<>();
            if (result.size() != 0)
                responseResult.add(result.get(
                        new Random().nextInt(result.size() - 1)));
            response.put("data", responseResult);
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }
}
