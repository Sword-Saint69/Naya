package com.college.bus.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
  private final JwtUtil jwt;
  public JwtFilter(JwtUtil jwt) { this.jwt = jwt; }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String h = req.getHeader("Authorization");
    if (h != null && h.startsWith("Bearer ")) {
      try {
        var claims = jwt.parse(h.substring(7)).getPayload();
        if ("access".equals(claims.get("type", String.class))) {
          String role = claims.get("role", String.class);
          var auth = new UsernamePasswordAuthenticationToken(
            claims.getSubject() + ":" + claims.get("email", String.class), null,
            List.of(new SimpleGrantedAuthority("ROLE_" + role)));
          SecurityContextHolder.getContext().setAuthentication(auth);
        }
      } catch (Exception ignored) { SecurityContextHolder.clearContext(); }
    }
    chain.doFilter(req, res);
  }
}
