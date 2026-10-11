package com.college.bus.transport;

import jakarta.persistence.*;

@Entity @Table(name = "buses")
public class Bus {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name = "bus_no", unique = true, nullable = false) private String busNo;
  private Integer capacity;
  @Column(name = "bus_type") private String busType = "STANDARD";
  private String status = "ACTIVE";
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public String getBusNo(){return busNo;} public void setBusNo(String s){this.busNo=s;}
  public Integer getCapacity(){return capacity;} public void setCapacity(Integer c){this.capacity=c;}
  public String getBusType(){return busType;} public void setBusType(String t){this.busType=t;}
  public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
}
