package com.college.bus.pass;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity @Table(name = "bus_passes")
public class BusPass {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name = "student_id", nullable = false) private Long studentId;
  @Column(name = "route_id", nullable = false) private Long routeId;
  @Column(name = "assignment_id") private Long assignmentId;
  @Column(name = "academic_year", nullable = false) private String academicYear;
  private String status = "PENDING";
  @Column(name = "valid_from") private LocalDate validFrom;
  @Column(name = "valid_to") private LocalDate validTo;
  @Column(name = "fee_paid") private Boolean feePaid = false;
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public Long getStudentId(){return studentId;} public void setStudentId(Long s){this.studentId=s;}
  public Long getRouteId(){return routeId;} public void setRouteId(Long r){this.routeId=r;}
  public Long getAssignmentId(){return assignmentId;} public void setAssignmentId(Long a){this.assignmentId=a;}
  public String getAcademicYear(){return academicYear;} public void setAcademicYear(String y){this.academicYear=y;}
  public String getStatus(){return status;} public void setStatus(String s){this.status=s;}
  public LocalDate getValidFrom(){return validFrom;} public void setValidFrom(LocalDate d){this.validFrom=d;}
  public LocalDate getValidTo(){return validTo;} public void setValidTo(LocalDate d){this.validTo=d;}
  public Boolean getFeePaid(){return feePaid;} public void setFeePaid(Boolean f){this.feePaid=f;}
}
