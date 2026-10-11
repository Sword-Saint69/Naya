package com.college.bus.transport;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {
  List<RouteStop> findByRouteIdOrderBySequenceAsc(Long routeId);
}
