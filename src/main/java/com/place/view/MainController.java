package com.place.view;

import com.place.google.main.GeoPack;
import com.place.google.main.Point;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MainController {

    @RequestMapping("/")
    public String user(Model model) {

        return "index";
    }

    @RequestMapping("/2")
    public String map(Model model) {
        return "map";
    }

    @RequestMapping(value = "/placesSearch", method = RequestMethod.POST)
    public
    @ResponseBody  Map<String, Object> placesSearch(
            @RequestParam("location") String location,
            @RequestParam("type-rest") String type,
            @RequestParam("radius") String radius)
    {
        Map<String, Object> response = new HashMap<>();
        try
        {
            response.put("result", "success");
            response.put("data",GeoPack.toList(GeoPack.getPoints(type,location,radius)));
            return response;
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        return response;
    }

    @RequestMapping(value = "/addressSearch", method = RequestMethod.POST)
    public
    @ResponseBody  Map<String, Object> addressSearch(@RequestParam("address") String address)
    {
        Map<String, Object> response = new HashMap<>();
        try
        {
            JSONObject jsonPoint = GeoPack.getJsonPoint(address);
            JSONObject resultJson = new JSONObject();
            resultJson.put("lng", jsonPoint.getDouble("lng"));
            resultJson.put("lat", jsonPoint.getDouble("lat"));


            response.put("result", "success");
            response.put("data",resultJson);
            return response;
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        return response;
    }
}
