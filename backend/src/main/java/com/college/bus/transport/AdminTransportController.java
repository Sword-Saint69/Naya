package com.college.bus.transport;

import com.college.bus.common.ApiResponse;
import com.college.bus.pass.PassRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminTransportController {
  private final BusRepository buses;
  private final DriverRepository drivers;
  private final RouteRepository routes;
  private final RouteStopRepository stops;
  private final AssignmentRepository assignments;
  private final PassRepository passes;

  public AdminTransportController(BusRepository buses, DriverRepository drivers,
      RouteRepository routes, RouteStopRepository stops,
      AssignmentRepository assignments, PassRepository passes) {
    this.buses = buses; this.drivers = drivers; this.routes = routes;
    this.stops = stops; this.assignments = assignments; this.passes = passes;
  }

  public record BusReq(@NotBlank String busNo, @NotNull @Min(1) Integer capacity, String busType) {}
  public record DriverReq(@NotBlank String name, @NotBlank String licenseNo, @NotBlank String phone) {}
  public record RouteReq(@NotBlank String routeNo, @NotBlank String source, @NotBlank String destination,
    Double distanceKm, BigDecimal fee) {}
  public record StopReq(@NotNull Long routeId, @NotBlank String stopName, @NotNull Integer sequence, String pickupTime) {}
  public record AssignReq(@NotNull Long busId, @NotNull Long driverId, @NotNull Long routeId,
    @NotBlank String shift, LocalDate effectiveFrom) {}

  @PostMapping("/buses")
  public ApiResponse<?> addBus(@Valid @RequestBody BusReq r) {
    Bus b = new Bus(); b.setBusNo(r.busNo()); b.setCapacity(r.capacity());
    b.setBusType(r.busType() == null ? "STANDARD" : r.busType());
    return ApiResponse.ok(buses.save(b));
  }

  @GetMapping("/buses")
  public ApiResponse<?> listBuses() { return ApiResponse.ok(buses.findAll()); }

  @PostMapping("/drivers")
  public ApiResponse<?> addDriver(@Valid @RequestBody DriverReq r) {
    Driver d = new Driver(); d.setName(r.name()); d.setLicenseNo(r.licenseNo()); d.setPhone(r.phone());
    return ApiResponse.ok(drivers.save(d));
  }

  @GetMapping("/drivers")
  public ApiResponse<?> listDrivers() { return ApiResponse.ok(drivers.findAll()); }

  @PostMapping("/routes")
  public ApiResponse<?> addRoute(@Valid @RequestBody RouteReq r) {
    Route route = new Route();
    route.setRouteNo(r.routeNo()); route.setSource(r.source()); route.setDestination(r.destination());
    route.setDistanceKm(r.distanceKm() == null ? 0 : r.distanceKm());
    route.setFee(r.fee() == null ? BigDecimal.ZERO : r.fee());
    return ApiResponse.ok(routes.save(route));
  }

  @PostMapping("/stops")
  public ApiResponse<?> addStop(@Valid @RequestBody StopReq r) {
    routes.findById(r.routeId()).orElseThrow(() -> new IllegalArgumentException("route not found"));
    RouteStop s = new RouteStop();
    s.setRouteId(r.routeId()); s.setStopName(r.stopName());
    s.setSequence(r.sequence()); s.setPickupTime(r.pickupTime());
    return ApiResponse.ok(stops.save(s));
  }

  @PostMapping("/assignments")
  public ApiResponse<?> assign(@Valid @RequestBody AssignReq r) {
    buses.findById(r.busId()).orElseThrow(() -> new IllegalArgumentException("bus not found"));
    drivers.findById(r.driverId()).orElseThrow(() -> new IllegalArgumentException("driver not found"));
    routes.findById(r.routeId()).orElseThrow(() -> new IllegalArgumentException("route not found"));
    Assignment a = new Assignment();
    a.setBusId(r.busId()); a.setDriverId(r.driverId()); a.setRouteId(r.routeId());
    a.setShift(r.shift().toUpperCase());
    a.setEffectiveFrom(r.effectiveFrom() == null ? LocalDate.now() : r.effectiveFrom());
    return ApiResponse.ok(assignments.save(a));
  }

  @GetMapping("/assignments")
  public ApiResponse<?> listAssignments() { return ApiResponse.ok(assignments.findAll()); }

  @GetMapping("/capacity")
  public ApiResponse<?> capacity(@RequestParam(required = false) Long routeId) {
    List<Assignment> list = routeId == null ? assignments.findAll()
      : assignments.findByRouteIdAndActiveTrue(routeId);
    List<Map<String, Object>> out = new ArrayList<>();
    for (Assignment a : list) {
      Bus b = buses.findById(a.getBusId()).orElse(null);
      int cap = b == null ? 0 : b.getCapacity();
      long used = passes.countByAssignmentIdAndStatus(a.getId(), "ACTIVE");
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("assignmentId", a.getId()); m.put("routeId", a.getRouteId());
      m.put("busId", a.getBusId()); m.put("capacity", cap);
      m.put("used", used); m.put("free", cap - used);
      out.add(m);
    }
    return ApiResponse.ok(out);
  }
}
