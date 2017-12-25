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
    final static Logger logger = Logger.getLogger(GeoPack.class);
    final static String baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    final static String directionUrl = "https://maps.googleapis.com/maps/api/directions/json";
    final static String nearbySearchUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";// путь к Geocoding API по
    final static String geocodingSearchUrl = "https://maps.googleapis.com/maps/api/geocode/json";// путь к Geocoding API по
    final static String apiKey = "AIzaSyBKt9YcXt6RY05eBFlp0pTHoVBvGaomY2U";
    /* AIzaSyCZ8WhzKOPGMPEWCTZ6igOpYJ9ceisZINM */

    /* Вычисление расстояния и времени между пунктами */

    public static Map<String, String> getDistanceInfo(Point origin, Point destination) {
        // HTTP
        Map<String, String> requestParams = Maps.newHashMap();
        Map<String, String> resultMap;

        String originAddress = getAddress(origin);
        String destinationAddress = getAddress(destination);

        requestParams.put("sensor", "false");// указывает, исходит ли запрос на геокодирование от устройства с датчиком
        requestParams.put("language", "ru");// язык данные на котором мы хочем получить
        requestParams.put("mode", "driving");// способ перемещения, может быть driving, walking, bicycling
        requestParams.put("origin", originAddress);// адрес отправного пункта маршрута
        requestParams.put("destination", destinationAddress);// адрес конечного пункта маршрута
        requestParams.put("key", apiKey);

        String url = directionUrl + '?' + encodeParams(requestParams);// РіРµРЅРµСЂРёСЂСѓРµРј РїСѓС‚СЊ СЃ РїР°СЂР°РјРµС‚СЂР°РјРё
        JSONObject response;// РґРµР»Р°РµРј Р·Р°РїСЂРѕСЃ Рє РІРµР±СЃРµСЂРІРёСЃСѓ Рё РїРѕР»СѓС‡Р°РµРј РѕС‚ РЅРµРіРѕ РѕС‚РІРµС‚

        try {
            response = JsonReader.read(url);
        } catch (IOException e) {
            logger.error("Возникла ошибка во время получения расстояния и времени между пунктами, url: " + url);
            return null;
        }

        JSONObject location = response.getJSONArray("routes").getJSONObject(0);
        location = location.getJSONArray("legs").getJSONObject(0);

        resultMap = new HashMap<>();
        resultMap.put("duration", location.getJSONObject("duration").getString("text"));
        resultMap.put("distance", location.getJSONObject("distance").getString("text"));

        return resultMap;
    }

    /* Геокодирование */
    public static String getAddress(Point point) {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("language", "ru");// язык данные на котором мы хочем получить
        requestParams.put("sensor", "false");// исходит ли запрос на геокодирование от устройства с датчиком местоположения
        // текстовое значение широты/долготы, для которого следует получить ближайший понятный человеку адрес, догота и
        // широта разделяется запятой, берем из предыдущего примера
        requestParams.put("latlng", String.valueOf(point.getLat()) + "," + String.valueOf(point.lng));
        final String url = baseUrl + '?' + encodeParams(requestParams);// генерируем путь с параметрами
        System.out.println(url);// Путь, что бы можно было посмотреть в браузере ответ службы
        JSONObject response;// делаем запрос к вебсервису и получаем от него ответ
        try {
            response = JsonReader.read(url);
        } catch (IOException e) {
            logger.error("Возникла ошибка во время получения адреса по координатам");
            return null;
        }

        JSONObject location = response.getJSONArray("results").getJSONObject(0);
        return location.getString("formatted_address");
    }

    public static JSONArray getResponseGeocodingSearchUrl(Map<String, String> requestParams) throws IOException {
        String url = geocodingSearchUrl + '?' + encodeParams(requestParams);// генерируем путь с параметрами
        JSONObject response = JsonReader.read(url);// делаем запрос к вебсервису и получаем от него ответ
        return response.getJSONArray("results");
    }

    public static JSONObject getJsonPoint(String address) throws IOException {
        JSONArray response = getPointByLocation(address);
        JSONObject location = response.getJSONObject(0);
        location = location.getJSONObject("geometry");
        location = location.getJSONObject("location");
        return location;
    }

    public static Point getPoint(String address) throws IOException {
        JSONObject location = getJsonPoint(address);
        Point point = new Point(location.getDouble("lng"), location.getDouble("lat"));
        return point;
    }

    public static JSONArray getResponseNearbySearch(Map<String, String> requestParams) throws IOException {
        String url = nearbySearchUrl + '?' + encodeParams(requestParams);// генерируем путь с параметрами
        JSONObject response = JsonReader.read(url);// делаем запрос к вебсервису и получаем от него ответ
        return response.getJSONArray("results");
    }

    /* Геодекодирование - запрос по центру, радиусу и типу отдыха */
    public static JSONArray getPoints(String keyWord, String location, String radius) throws IOException {
        Point locationPoint = GeoPack.getPoint(location);
        Map<String, String> requestParams = Maps.newHashMap();
        //requestParams.put("sensor", "false");// указывает, исходит ли запрос на геокодирование от устройства с датчиком местоположения
        requestParams.put("key", apiKey);
        requestParams.put("location", locationPoint.getLat() + "," + locationPoint.getLng());
        requestParams.put("radius", radius);
        requestParams.put("language", "ru");
        requestParams.put("keyword", keyWord);
        return getResponseNearbySearch(requestParams);
    }

    /* Геодекодирование - запрос по центру, радиусу и типу отдыха */
    public static JSONArray getPointsByCurrentMarker(String keyWord, String lat, String lng, String radius) throws IOException {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("key", apiKey);
        requestParams.put("location", lat + "," + lng);
        requestParams.put("radius", radius);
        requestParams.put("language", "ru");
        requestParams.put("keyword", keyWord);
        return getResponseNearbySearch(requestParams);
    }

    /* Геодекодирование - pagination */
    public static JSONArray getPointsByPagination() throws IOException {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("key", apiKey);
        requestParams.put("pagetoken", "next_page_token");
        requestParams.put("language", "ru");
        return getResponseNearbySearch(requestParams);
    }

    /* Геодекодирование - поиск места*/
    public static JSONArray getPointByLocation(String address) throws IOException {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("key", apiKey);
        requestParams.put("address", address);
        requestParams.put("language", "ru");
        return getResponseGeocodingSearchUrl(requestParams);
    }

    public static double deg2rad(final double degree) {
        return degree * (Math.PI / 180);
    }

    public static ArrayList<Point> getListPoints(JSONObject response) {
        JSONArray results = response.getJSONArray("results");
        JSONObject point;
        ArrayList<Point> points = new ArrayList<>();
        double lat, lng;
//        for(Object o: results){
//            if ( o instanceof JSONObject ) {
//                point = ((JSONObject) o).getJSONObject("geometry").getJSONObject("location");
//                points.add(new Point(point.getDouble("lng"),point.getDouble("lat")));
//            }
//        }
        return points;
    }

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
