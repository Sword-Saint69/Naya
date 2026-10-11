package com.college.bus.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
  private final SecretKey key;
  private final long accessMs;
  private final long refreshMs;

  public JwtUtil(@Value("${app.jwt.secret}") String secret,
                 @Value("${app.jwt.access-ms}") long accessMs,
                 @Value("${app.jwt.refresh-ms}") long refreshMs) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
    this.accessMs = accessMs;
    this.refreshMs = refreshMs;
  }

  public String accessToken(Long userId, String email, String role) {
    return build(userId, email, role, accessMs, "access");
  }
  public String refreshToken(Long userId, String email, String role) {
    return build(userId, email, role, refreshMs, "refresh");
  }

  private String build(Long userId, String email, String role, long ttl, String type) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
      .subject(String.valueOf(userId))
      .claim("email", email).claim("role", role).claim("type", type)
      .issuedAt(new Date(now)).expiration(new Date(now + ttl))
      .signWith(key).compact();
  }

  public Jws<Claims> parse(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
  }
}
