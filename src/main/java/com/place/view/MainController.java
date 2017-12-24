package com.place.view;

import com.place.google.main.GeoPack;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller

public class MainController {

    private String convertToMeters(String radiusKm) {
        Integer radius = Integer.valueOf(radiusKm)*1000;
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
            response.put("data",GeoPack.toList(GeoPack.getPointByAddress(location)));
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
            response.put("data", GeoPack.toList(GeoPack.getPoints(type, location, convertToMeters(radius))));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearchByCurrentMarker", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearchByCurrentMarker(
            @RequestParam("location") Map<String, String> locationPoint,
            @RequestParam("type-rest") String type,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(GeoPack.getPointsByCurrentMarker(type, locationPoint, convertToMeters(radius))));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }
}
