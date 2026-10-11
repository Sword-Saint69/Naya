package com.college.bus.transport;

import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
  List<Assignment> findByRouteIdAndActiveTrue(Long routeId);
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select a from Assignment a where a.id = :id")
  Optional<Assignment> lockById(@Param("id") Long id);
}
