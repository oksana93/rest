package com.place.view;

import com.place.google.main.GeoPack;
import com.place.google.main.Point;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@Controller

public class MainController {
    private static final Map<String,String> types = new HashMap<>();
    static {
        types.put("Парк аттракционов", "amusement_park");
        types.put("Аквариум", "aquarium");
        types.put("Художественная галерея", "art_gallery");
        types.put("Бар", "bar");
        types.put("Салон красоты", "beauty_salon");
        types.put("Для велосипедистов", "bicycle_store");
        types.put("Книжный магазин", "book_store");
        types.put("Интерес", "point_of_interest");
        types.put("Кафе", "cafe");
        types.put("Кемпинг", "campground");
        types.put("Казино", "casino");
        types.put("Магазин одежды", "clothing_store");
        types.put("Круглосуточный магазин", "convenience_store");
        types.put("Флорист", "florist");
        types.put("Еда", "food");
        types.put("Тренажерный зал", "gym");
        types.put("Парикмахерская", "hair_care");
        types.put("Магазин товаров для дома", "home_goods_store");
        types.put("Библиотека", "library");
        types.put("Ресторан", "restaurant");
        types.put("Алкогольный магазин", "liquor_store");
        types.put("Доставка еды", "meal_delivery");
        types.put("Еда навынос", "meal_takeaway");
        types.put("Фильм", "movie_rental");
        types.put("Кинотеатр", "movie_theater");
        types.put("Ночной клуб", "night_club");
        types.put("Для художников", "painter");
        types.put("Парк", "park");
        types.put("Место поклонения", "place_of_worship");
        types.put("Торговый центр", "shopping_mall");
        types.put("Спа-салон", "spa");
        types.put("Стадион", "stadium");
        types.put("Магазин", "store");
        types.put("Туристическое агенство", "travel_agency");
        types.put("Зоопарк", "zoo");
    }

    private final double MIN_FUEL_CONSUMPTION = 1;
    private final double MAX_FUEL_CONSUMPTION = 150;

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
            response.put("data", GeoPack.toList(
                    GeoPack.getPointByLocation(location)));
            response.put("result", "success");
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearchByKeyWord", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearchByKeyWord(
            @RequestParam("location") String location,
            @RequestParam("keyword") String keyword,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("data", GeoPack.toList(
                    GeoPack.getPointsByKeyword(keyword, location, convertToMeters(radius))));
            response.put("result", "success");
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearchByCurrentMarkerAndKeyWord", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearchByCurrentMarkerAndKeyWord(
            @RequestParam("lat") String lat,
            @RequestParam("lng") String lng,
            @RequestParam("keyword") String keyword,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("data", GeoPack.toList(GeoPack.getPointsByCurrentMarkerAndKeyWord(keyword, lat, lng, convertToMeters(radius))));
            response.put("result", "success");
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearchByType", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearchByType(
            @RequestParam("location") String location,
            @RequestParam("type") String type,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(
                    GeoPack.getPointsByType(types.get(type), location, convertToMeters(radius))));
            return response;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }

    @RequestMapping(value = "/placesSearchByCurrentMarkerAndType", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> placesSearchByCurrentMarkerAndType(
            @RequestParam("lat") String lat,
            @RequestParam("lng") String lng,
            @RequestParam("type") String type,
            @RequestParam("radius") String radius) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("result", "success");
            response.put("data", GeoPack.toList(GeoPack.getPointsByCurrentMarkerAndType(types.get(type), lat, lng, convertToMeters(radius))));
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
        List<String> typeKeys = new ArrayList<>(types.values());
        return typeKeys.get(random.nextInt(typeKeys.size() - 1));
    }

    private String setAnyRadius() {
        int radius = new Random().nextInt(45000) + 5000;
        return String.valueOf(radius);
    }

    @RequestMapping(value = "/lucky", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> luckyButton(
            @RequestParam("lat") String lat,
            @RequestParam("lng") String lng)
    {
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

    @RequestMapping(value = "/getCostFuelConsump", method = RequestMethod.POST)
    public @ResponseBody
    Map<String,Object> getCostFuelConsumption(
            @RequestParam("fuelType") String fuelType,
            @RequestParam("consumption") String consumption,
            @RequestParam("distance") String distance)
    {
        Map<String,Object> response = new HashMap<>();

        consumption = consumption.trim() ;
        double consumptionFuel = "".equals(consumption) ? 0 : Double.parseDouble(consumption);
        if (consumptionFuel < MIN_FUEL_CONSUMPTION || consumptionFuel > MAX_FUEL_CONSUMPTION)
        {
            response.put("error","Некорректное значение расхода топлива.");
            return response;
        }
        else
        {
            int costResult = (int) GeoPack.calculateCost(fuelType, consumptionFuel, Double.parseDouble(distance));
            response.put("cost", costResult);
            return response;
        }
    }

    @RequestMapping(value = "/getTypes", method = RequestMethod.POST)
    public @ResponseBody
    ArrayList<String> getTypes() {
        return new ArrayList<>(types.keySet());
    }

}
