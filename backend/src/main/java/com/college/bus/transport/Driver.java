package com.college.bus.transport;

import jakarta.persistence.*;

@Entity @Table(name = "drivers")
public class Driver {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private String name;
  @Column(name = "license_no", unique = true, nullable = false) private String licenseNo;
  private String phone;
  private String status = "ACTIVE";
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public String getName(){return name;} public void setName(String s){this.name=s;}
  public String getLicenseNo(){return licenseNo;} public void setLicenseNo(String s){this.licenseNo=s;}
  public String getPhone(){return phone;} public void setPhone(String s){this.phone=s;}
  public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
}
