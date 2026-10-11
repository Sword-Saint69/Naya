package com.college.bus.transport;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity @Table(name = "routes")
public class Route {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name = "route_no", unique = true, nullable = false) private String routeNo;
  private String source; private String destination;
  @Column(name = "distance_km") private Double distanceKm = 0.0;
  private BigDecimal fee = BigDecimal.ZERO;
  private String status = "ACTIVE";
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public String getRouteNo(){return routeNo;} public void setRouteNo(String s){this.routeNo=s;}
  public String getSource(){return source;} public void setSource(String s){this.source=s;}
  public String getDestination(){return destination;} public void setDestination(String s){this.destination=s;}
  public Double getDistanceKm(){return distanceKm;} public void setDistanceKm(Double d){this.distanceKm=d;}
  public BigDecimal getFee(){return fee;} public void setFee(BigDecimal f){this.fee=f;}
  public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
}
