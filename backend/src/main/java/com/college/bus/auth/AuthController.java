package com.college.bus.auth;

import com.college.bus.common.ApiResponse;
import com.college.bus.config.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.Map;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtUtil jwt;

  public AuthController(UserRepository users, PasswordEncoder encoder, JwtUtil jwt) {
    this.users = users; this.encoder = encoder; this.jwt = jwt;
  }

  public record RegisterReq(@NotBlank String name, @Email @NotBlank String email,
    @NotBlank @Size(min = 6) String password, @NotBlank String collegeId) {}
  public record LoginReq(@Email @NotBlank String email, @NotBlank String password) {}

  @PostMapping("/register")
  public ApiResponse<?> register(@Valid @RequestBody RegisterReq r) {
    if (users.existsByEmail(r.email())) throw new IllegalArgumentException("email already registered");
    User u = new User();
    u.setName(r.name()); u.setEmail(r.email().toLowerCase());
    u.setPasswordHash(encoder.encode(r.password()));
    u.setCollegeId(r.collegeId()); u.setRole("STUDENT");
    users.save(u);
    return ApiResponse.ok(Map.of("id", u.getId(), "email", u.getEmail()));
  }

  @PostMapping("/login")
  public ApiResponse<?> login(@Valid @RequestBody LoginReq r) {
    User u = users.findByEmail(r.email().toLowerCase())
      .orElseThrow(() -> new IllegalArgumentException("invalid credentials"));
    if (!encoder.matches(r.password(), u.getPasswordHash()))
      throw new IllegalArgumentException("invalid credentials");
    return ApiResponse.ok(Map.of(
      "access", jwt.accessToken(u.getId(), u.getEmail(), u.getRole()),
      "refresh", jwt.refreshToken(u.getId(), u.getEmail(), u.getRole()),
      "role", u.getRole(), "id", u.getId()));
  }

  @PostMapping("/refresh")
  public ApiResponse<?> refresh(@RequestBody Map<String, String> body) {
    var claims = jwt.parse(body.get("refresh")).getPayload();
    if (!"refresh".equals(claims.get("type", String.class)))
      throw new IllegalArgumentException("invalid refresh token");
    Long id = Long.valueOf(claims.getSubject());
    User u = users.findById(id).orElseThrow(() -> new IllegalArgumentException("user gone"));
    return ApiResponse.ok(Map.of("access",
      jwt.accessToken(u.getId(), u.getEmail(), u.getRole())));
  }
}
