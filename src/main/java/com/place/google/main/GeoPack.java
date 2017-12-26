package com.place.google.main;

import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.collect.Iterables;
import com.google.common.collect.Maps;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;


public class GeoPack {
    final static Logger LOGGER = Logger.getLogger(GeoPack.class);
    final static String GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
    final static String DIRECTION_URL = "https://maps.googleapis.com/maps/api/directions/json";
    final static String NEARBY_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";// путь к Geocoding API по
    final static String GEOCODING_SEARCH_URL = "https://maps.googleapis.com/maps/api/geocode/json";// путь к Geocoding API по

    final static String API_KEY = "AIzaSyBKt9YcXt6RY05eBFlp0pTHoVBvGaomY2U";
    /* API_KEY = AIzaSyCZ8WhzKOPGMPEWCTZ6igOpYJ9ceisZINM */

    /* Time and distance */

    private static double calculateCost(int distance,double rate)
    {
        return (distance/1000)*rate*2;
    }

    public static Map<String, String> getDistanceInfo(Point origin, Point destination) {
        Map<String, String> requestParams = Maps.newHashMap();
        Map<String, String> resultMap;

        String originAddress = getAddressByGeocode(origin);
        String destinationAddress = getAddressByGeocode(destination);
        requestParams.put("language", "ru");
        requestParams.put("mode", "driving");// driving, walking, bicycling - travel's way
        requestParams.put("origin", originAddress);// start position
        requestParams.put("destination", destinationAddress);// end position
        requestParams.put("key", API_KEY);

        String url = DIRECTION_URL + '?' + encodeParams(requestParams);
        JSONObject response;
        try {
            response = JsonReader.read(url);
        } catch (IOException e) {
            LOGGER.error("Возникла ошибка во время получения расстояния и времени между пунктами, url: " + url);
            return null;
        }

        JSONObject location = response.getJSONArray("routes").getJSONObject(0);
        location = location.getJSONArray("legs").getJSONObject(0);

        resultMap = new HashMap<>();
        resultMap.put("name",destinationAddress);
        resultMap.put("duration", location.getJSONObject("duration").getString("text"));
        resultMap.put("distance", location.getJSONObject("distance").getString("text"));
        resultMap.put("cost", String.valueOf(calculateCost((Integer) location.getJSONObject("distance").get("value"),4.0)+" руб."));

        return resultMap;
    }


    /* Geocoding */
    public static String getAddressByGeocode(Point point) {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("language", "ru");
        requestParams.put("latlng", String.valueOf(point.getLat()) + "," + String.valueOf(point.lng));
        final String url = GEOCODE_URL + '?' + encodeParams(requestParams);
        JSONObject response;
        try {
            response = JsonReader.read(url);
        } catch (IOException e) {
            LOGGER.error("Возникла ошибка во время получения адреса по координатам");
            return null;
        }
        JSONObject location = response.getJSONArray("results").getJSONObject(0);
        return location.getString("formatted_address");
    }

    /* Geodezy */
    public static Point getPointByAddress(String address) throws IOException {
        JSONArray response = getPointByLocation(address);
        JSONObject location = response.getJSONObject(0);
        location = location.getJSONObject("geometry");
        location = location.getJSONObject("location");
        Point point = new Point(location.getDouble("lng"), location.getDouble("lat"));
        return point;
    }

    public static JSONArray getResponseNearbySearch(Map<String, String> requestParams) throws IOException {
        String url = NEARBY_SEARCH_URL + '?' + encodeParams(requestParams);
        JSONObject response = JsonReader.read(url);
        return response.getJSONArray("results");
    }

    /* Geodezy - keyWord, location, radius*/
    public static JSONArray getPointsByKeyword(String keyWord, String location, String radius) throws IOException {
        Point locationPoint = GeoPack.getPointByAddress(location);
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("key", API_KEY);
        requestParams.put("location", locationPoint.getLat() + "," + locationPoint.getLng());
        requestParams.put("radius", radius);
        requestParams.put("language", "ru");
        requestParams.put("keyword", keyWord);
        return getResponseNearbySearch(requestParams);
    }

    /* Geodezy - type, location, radius*/
    public static JSONArray getPointsByType(String type, String location, String radius) throws IOException {
        Point locationPoint = GeoPack.getPointByAddress(location);
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("key", API_KEY);
        requestParams.put("location", locationPoint.getLat() + "," + locationPoint.getLng());
        requestParams.put("radius", radius);
        requestParams.put("language", "ru");
        requestParams.put("type", type);
        return getResponseNearbySearch(requestParams);
    }

    /* Geodezy - keyWord, currentLocation (lat, lng), radius */
    public static JSONArray getPointsByCurrentMarkerAndKeyWord(String keyWord, String lat, String lng, String radius) throws IOException {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("key", API_KEY);
        requestParams.put("location", lat + "," + lng);
        requestParams.put("radius", radius);
        requestParams.put("language", "ru");
        requestParams.put("keyword", keyWord);
        return getResponseNearbySearch(requestParams);
    }

    /* Geodezy - type, currentLocation (lat, lng), radius */
    public static JSONArray getPointsByCurrentMarkerAndType(String type, String lat, String lng, String radius) throws IOException {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("key", API_KEY);
        requestParams.put("location", lat + "," + lng);
        requestParams.put("radius", radius);
        requestParams.put("language", "ru");
        requestParams.put("type", type);
        return getResponseNearbySearch(requestParams);
    }

    /* Geodezy - position by address */
    public static JSONArray getPointByLocation(String address) throws IOException {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("key", API_KEY);
        requestParams.put("address", address);
        requestParams.put("language", "ru");
        String url = GEOCODING_SEARCH_URL + '?' + encodeParams(requestParams);
        JSONObject response = JsonReader.read(url);
        return response.getJSONArray("results");
    }

    /* --------------------------------------------------------------------- */

    public static List<Object> toList(JSONArray array) throws JSONException {
        List<Object> list = new ArrayList<Object>();
        for (int i = 0; i < array.length(); i++) {
            Object value = array.get(i);
            if (value instanceof JSONArray) {
                value = toList((JSONArray) value);
            } else if (value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            list.add(value);
        }
        return list;
    }

    public static Map<String, Object> toMap(JSONObject object) throws JSONException {
        Map<String, Object> map = new HashMap<>();

        Iterator<String> keysItr = object.keys();
        while (keysItr.hasNext()) {
            String key = keysItr.next();
            Object value = object.get(key);

            if (value instanceof JSONArray) {
                value = toList((JSONArray) value);
            } else if (value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            map.put(key, value);
        }
        return map;
    }

    /* --------------------------------------------------------------------- */

    public static String encodeParams(final Map<String, String> params) {
        final String paramsUrl = Joiner.on('&').join(// получаем значение вида key1=value1&key2=value2...
                Iterables.transform(params.entrySet(), new Function<Map.Entry<String, String>, String>() {

                    public String apply(final Map.Entry<String, String> input) {
                        try {
                            final StringBuffer buffer = new StringBuffer();
                            buffer.append(input.getKey());// получаем значение вида key=value
                            buffer.append('=');
                            buffer.append(URLEncoder.encode(input.getValue(), "utf-8"));// кодирует строку в
                            // соответствии со стандартом
                            // HTML 4.01
                            return buffer.toString();
                        } catch (final UnsupportedEncodingException e) {
                            throw new RuntimeException(e);
                        }
                    }
                }));
        return paramsUrl;
    }
}
