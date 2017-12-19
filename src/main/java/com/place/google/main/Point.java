package com.place.google.main;

import java.io.Serializable;

public class Point implements Serializable {
    /**
     * Класс точки, хранит зачения в градусах
     */
    public double lat;
    public double lng;

    public Point(final double lng, final double lat)
    {
        this.lng = lng;
        this.lat = lat;
    }

    public double getLat()
    {
        return lat;
    }

    public void setLat(double lat)
    {
        this.lat = lat;
    }

    public double getLng()
    {
        return lng;
    }

    @Override
    public String toString()
    {
        return lat + "," + lng;
    }
}
