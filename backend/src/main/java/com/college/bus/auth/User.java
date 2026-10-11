package com.college.bus.auth;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  @Column(unique = true, nullable = false)
  private String email;
  @Column(name = "password_hash", nullable = false)
  private String passwordHash;
  @Column(name = "college_id", nullable = false)
  private String collegeId;
  @Column(nullable = false)
  private String role = "STUDENT";
  @Column(name = "created_at")
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String n) { this.name = n; }
  public String getEmail() { return email; }
  public void setEmail(String e) { this.email = e; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String h) { this.passwordHash = h; }
  public String getCollegeId() { return collegeId; }
  public void setCollegeId(String c) { this.collegeId = c; }
  public String getRole() { return role; }
  public void setRole(String r) { this.role = r; }
  public Instant getCreatedAt() { return createdAt; }
}
