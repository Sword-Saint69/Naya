package com.college.bus.pass;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassRepository extends JpaRepository<BusPass, Long> {
  List<BusPass> findByStudentIdOrderByIdDesc(Long studentId);
  Page<BusPass> findByStatus(String status, Pageable pageable);
  long countByAssignmentIdAndStatus(Long assignmentId, String status);
  boolean existsByStudentIdAndRouteIdAndAcademicYearAndStatus(
    Long studentId, Long routeId, String academicYear, String status);
}
