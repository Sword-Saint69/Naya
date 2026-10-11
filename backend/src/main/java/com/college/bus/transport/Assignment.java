package com.college.bus.transport;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity @Table(name = "bus_assignments")
public class Assignment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name = "bus_id", nullable = false) private Long busId;
  @Column(name = "driver_id", nullable = false) private Long driverId;
  @Column(name = "route_id", nullable = false) private Long routeId;
  private String shift;
  @Column(name = "effective_from") private LocalDate effectiveFrom = LocalDate.now();
  private Boolean active = true;
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public Long getBusId(){return busId;} public void setBusId(Long b){this.busId=b;}
  public Long getDriverId(){return driverId;} public void setDriverId(Long d){this.driverId=d;}
  public Long getRouteId(){return routeId;} public void setRouteId(Long r){this.routeId=r;}
  public String getShift(){return shift;} public void setShift(String s){this.shift=s;}
  public LocalDate getEffectiveFrom(){return effectiveFrom;} public void setEffectiveFrom(LocalDate d){this.effectiveFrom=d;}
  public Boolean getActive(){return active;} public void setActive(Boolean a){this.active=a;}
}
