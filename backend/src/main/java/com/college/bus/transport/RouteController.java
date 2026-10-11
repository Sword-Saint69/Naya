package com.college.bus.transport;

import com.college.bus.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
  private final RouteRepository routes;
  private final RouteStopRepository stops;
  public RouteController(RouteRepository routes, RouteStopRepository stops) {
    this.routes = routes; this.stops = stops;
  }

  @GetMapping
  public ApiResponse<?> list() { return ApiResponse.ok(routes.findAll()); }

  @GetMapping("/{id}")
  public ApiResponse<?> one(@PathVariable Long id) {
    return ApiResponse.ok(routes.findById(id).orElseThrow(() -> new IllegalArgumentException("route not found")));
  }

  @GetMapping("/{id}/stops")
  public ApiResponse<?> stops(@PathVariable Long id) {
    return ApiResponse.ok(stops.findByRouteIdOrderBySequenceAsc(id));
  }
}
