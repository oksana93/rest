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
            {"accounting", "airport","amusement_park","aquarium","art_gallery","atm","bakery","bank","bar","beauty_salon","bicycle_store","book_store","bowling_alley","bus_station","cafe","campground",
            "car_dealer","car_rental","car_repair","car_wash","casino","cemetery","church","city_hall","clothing_store","convenience_store","courthouse","dentist","department_store","doctor","electrician",
            "electronics_store","embassy","establishment","finance","fire_station","florist","food","funeral_home","furniture_store","gas_station","general_contractor",
            "grocery_or_supermarket","gym","hair_care","hardware_store","health","hindu_temple","home_goods_store","hospital","insurance_agency","jewelry_store","laundry","lawyer",
            "library","liquor_store","local_government_office","locksmith","lodging","meal_delivery","meal_takeaway","mosque","movie_rental","movie_theater","moving_company","museum","night_club","painter",
            "park","parking","pet_store","pharmacy","physiotherapist","place_of_worship","plumber","police","post_office","real_estate_agency","restaurant","roofing_contractor","rv_park","school",
            "shoe_store","shopping_mall","spa","stadium","storage","store","subway_station","synagogue","taxi_stand","train_station","transit_station","travel_agency","university","veterinary_care","zoo"};

    private String convertToMeters(String radiusKm) {
        Float radius = Float.valueOf(radiusKm)*1000;
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
            response.put("data",GeoPack.toList(
                    GeoPack.getPointByLocation(location)));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearch", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearch(
            @RequestParam("location") String location,
            @RequestParam("type-rest") String type,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(
                    GeoPack.getPoints(type, location, convertToMeters(radius))));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearchByCurrentMarker", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearchByCurrentMarker(
            @RequestParam("lat") String lat,
            @RequestParam("lng") String lng,
            @RequestParam("type-rest") String type,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(GeoPack.getPointsByCurrentMarker(type, lat, lng, convertToMeters(radius))));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesPagination", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesPagination() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(GeoPack.getPointsByPagination()));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }


    @RequestMapping(value = "/getInfo", method = RequestMethod.POST)
    public @ResponseBody
    Map<String,String> getPointInfo(
            @RequestParam("startPositionLat") String startPositionLat,
            @RequestParam("startPositionLng") String startPositionLng,
            @RequestParam("destinationPositionLat") String destinationPositionLat,
            @RequestParam("destinationPositionLng") String destinationPositionLng
    )
    {
        Point startPosition=new Point(Double.parseDouble(startPositionLng),Double.parseDouble(startPositionLat));
        Point destinationPosition=new Point(Double.parseDouble(destinationPositionLng),Double.parseDouble(destinationPositionLat));

        Map<String,String> response = GeoPack.getDistanceInfo(startPosition,destinationPosition);
        return response;
    }


    private String setAnyType() {
        Random random = new Random();
        return types[random.nextInt(types.length-1)];
    }

    private String setAnyRadius() {
        int radius = new Random().nextInt(40000)+10000;
        return String.valueOf(radius);
    }


    @RequestMapping(value = "/lucky", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> lucky(
            @RequestParam("lat") String lat,
            @RequestParam("lng") String lng) {
        String type = setAnyType();
        String radius = setAnyRadius();
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            List<Object> result = GeoPack.toList(GeoPack.getPointsByCurrentMarker(type, lat, lng, radius));
            List<Object> responseResult = new ArrayList<>();
            responseResult.add(result.get(new Random().nextInt(result.size() == 0? 0: result.size()-1)));
            response.put("data", responseResult);
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }
}
