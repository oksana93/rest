package com.place.google.main;

import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.collect.Iterables;
import com.google.common.collect.Maps;
import org.json.JSONObject;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;


public class GeoPack {
    final static Logger logger = Logger.getLogger(GeoPack.class);
    final static String proxy = "http://anonymouse.org/cgi-bin/anon-www.cgi/";
    final static String baseUrl = proxy + "http://maps.googleapis.com/maps/api/geocode/json";// путь к Geocoding API по

    /* Вычисление расстояния и времени между пунктами */
    public static Map<String,String> getDistanceInfo(Point origin, Point destination,String mode) {
        // HTTP
        Map<String, String> requestParams = Maps.newHashMap();
        Map<String, String> resultMap;

        String originAddress = getAddress(origin);
        String destinationAddress = getAddress(destination);

        requestParams.put("sensor", "false");// указывает, исходит ли запрос на геокодирование от устройства с датчиком
        requestParams.put("language", "ru");// язык данные на котором мы хочем получить
        requestParams.put("mode", mode);// способ перемещения, может быть driving, walking, bicycling
        requestParams.put("origin", originAddress);// адрес отправного пункта маршрута
        requestParams.put("destination", destinationAddress);// адрес конечного пункта маршрута
        String url = baseUrl + '?' + encodeParams(requestParams);// генерируем путь с параметрами
        JSONObject response;// делаем запрос к вебсервису и получаем от него ответ

        try
        {
            response = JsonReader.read(url);
        }
        catch (IOException e)
        {
            logger.error("Возникла ошибка во время получения расстояния и времени между пунктами, url: "+url);
            return null;
        }

        JSONObject location = response.getJSONArray("routes").getJSONObject(0);
        location = location.getJSONArray("legs").getJSONObject(0);

        resultMap=new HashMap<>();
        resultMap.put("duration",location.getJSONObject("duration").getString("text"));
        resultMap.put("distance",location.getJSONObject("distance").getString("text"));

        return resultMap;
    }

    /* Геокодирование */
    public static String getAddress(Point point){
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("language", "ru");// язык данные на котором мы хочем получить
        requestParams.put("sensor", "false");// исходит ли запрос на геокодирование от устройства с датчиком местоположения
        // текстовое значение широты/долготы, для которого следует получить ближайший понятный человеку адрес, догота и
        // широта разделяется запятой, берем из предыдущего примера
        requestParams.put("latlng", String.valueOf(point.getLat())+","+String.valueOf(point.lng));
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

    /* Геодекодирование */
    public static Point getPoint(final String address) throws IOException {
        Map<String, String> requestParams = Maps.newHashMap();
        requestParams.put("sensor", "false");// указывает, исходит ли запрос на геокодирование от устройства с датчиком местоположения
        requestParams.put("address", address);// адрес, который нужно геокодировать

        String url = baseUrl + '?' + encodeParams(requestParams);// генерируем путь с параметрами

        JSONObject response = JsonReader.read(url);// делаем запрос к вебсервису и получаем от него ответ

        JSONObject location = response.getJSONArray("results").getJSONObject(0);
        location = location.getJSONObject("geometry");
        location = location.getJSONObject("location");

        Point point = new Point(location.getDouble("lng"), location.getDouble("lat"));
        return point;
    }

    public static double deg2rad(final double degree) {
        return degree * (Math.PI / 180);
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
