package com.college.bus.transport;

import jakarta.persistence.*;

@Entity @Table(name = "route_stops")
public class RouteStop {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name = "route_id", nullable = false) private Long routeId;
  @Column(name = "stop_name", nullable = false) private String stopName;
  private Integer sequence;
  @Column(name = "pickup_time") private String pickupTime;
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public Long getRouteId(){return routeId;} public void setRouteId(Long r){this.routeId=r;}
  public String getStopName(){return stopName;} public void setStopName(String s){this.stopName=s;}
  public Integer getSequence(){return sequence;} public void setSequence(Integer s){this.sequence=s;}
  public String getPickupTime(){return pickupTime;} public void setPickupTime(String t){this.pickupTime=t;}
}
