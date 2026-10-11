package com.college.bus.pass;

import com.college.bus.auth.UserRepository;
import com.college.bus.common.ApiResponse;
import com.college.bus.transport.RouteRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passes")
public class PassController {
  private final PassRepository passes;
  private final RouteRepository routes;
  private final PassService service;

  public PassController(PassRepository passes, RouteRepository routes, PassService service) {
    this.passes = passes; this.routes = routes; this.service = service;
  }

  private Long currentUserId() {
    String principal = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return Long.valueOf(principal.split(":")[0]);
  }

  public record ApplyReq(@NotNull Long routeId, @NotNull String academicYear) {}

  @PostMapping("/apply")
  public ApiResponse<?> apply(@Valid @RequestBody ApplyReq r) {
    routes.findById(r.routeId()).orElseThrow(() -> new IllegalArgumentException("route not found"));
    Long studentId = currentUserId();
    if (passes.existsByStudentIdAndRouteIdAndAcademicYearAndStatus(studentId, r.routeId(), r.academicYear(), "PENDING"))
      throw new IllegalStateException("already have a pending application");
    if (passes.existsByStudentIdAndRouteIdAndAcademicYearAndStatus(studentId, r.routeId(), r.academicYear(), "ACTIVE"))
      throw new IllegalStateException("already have an active pass");
    BusPass p = new BusPass();
    p.setStudentId(studentId); p.setRouteId(r.routeId());
    p.setAcademicYear(r.academicYear()); p.setStatus("PENDING");
    return ApiResponse.ok(passes.save(p));
  }

  @PostMapping("/{id}/renew")
  public ApiResponse<?> renew(@PathVariable Long id) {
    BusPass p = passes.findById(id).orElseThrow(() -> new IllegalArgumentException("pass not found"));
    if (!p.getStudentId().equals(currentUserId()))
      throw new IllegalArgumentException("not your pass");
    return ApiResponse.ok(service.renew(id));
  }

  @GetMapping("/me")
  public ApiResponse<?> mine() {
    return ApiResponse.ok(passes.findByStudentIdOrderByIdDesc(currentUserId()));
  }

  @GetMapping("/{id}/status")
  public ApiResponse<?> status(@PathVariable Long id) {
    BusPass p = passes.findById(id).orElseThrow(() -> new IllegalArgumentException("pass not found"));
    if (!p.getStudentId().equals(currentUserId()))
      throw new IllegalArgumentException("not your pass");
    return ApiResponse.ok(Map.of("status", p.getStatus(), "feePaid", p.getFeePaid(),
      "validFrom", String.valueOf(p.getValidFrom()), "validTo", String.valueOf(p.getValidTo())));
  }
}
