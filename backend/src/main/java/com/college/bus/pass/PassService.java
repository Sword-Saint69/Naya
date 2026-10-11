package com.college.bus.pass;

import com.college.bus.transport.*;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PassService {
  private final PassRepository passes;
  private final AssignmentRepository assignments;
  private final BusRepository buses;

  public PassService(PassRepository passes, AssignmentRepository assignments, BusRepository buses) {
    this.passes = passes; this.assignments = assignments; this.buses = buses;
  }

  @Transactional
  public BusPass approve(Long passId, Long assignmentId, boolean feePaid) {
    BusPass p = passes.findById(passId).orElseThrow(() -> new IllegalArgumentException("pass not found"));
    if (!"PENDING".equals(p.getStatus())) throw new IllegalStateException("only PENDING can be approved");
    Assignment a = assignments.lockById(assignmentId)
      .orElseThrow(() -> new IllegalArgumentException("assignment not found"));
    if (!a.getRouteId().equals(p.getRouteId()))
      throw new IllegalArgumentException("assignment route mismatch");
    Bus b = buses.findById(a.getBusId()).orElseThrow(() -> new IllegalArgumentException("bus gone"));
    long used = passes.countByAssignmentIdAndStatus(a.getId(), "ACTIVE");
    if (used >= b.getCapacity()) throw new IllegalStateException("bus full");
    p.setAssignmentId(a.getId());
    p.setStatus("ACTIVE");
    p.setFeePaid(feePaid);
    p.setValidFrom(LocalDate.now());
    p.setValidTo(LocalDate.now().plusMonths(6));
    return passes.save(p);
  }

  @Transactional
  public BusPass renew(Long passId) {
    BusPass p = passes.findById(passId).orElseThrow(() -> new IllegalArgumentException("pass not found"));
    if (!"ACTIVE".equals(p.getStatus()) && !"EXPIRED".equals(p.getStatus()))
      throw new IllegalStateException("only ACTIVE/EXPIRED can renew");
    if (p.getAssignmentId() != null) {
      Assignment a = assignments.lockById(p.getAssignmentId())
        .orElseThrow(() -> new IllegalArgumentException("assignment gone"));
      Bus b = buses.findById(a.getBusId()).orElseThrow();
      long used = passes.countByAssignmentIdAndStatus(a.getId(), "ACTIVE");
      // exclude self if currently active
      if ("ACTIVE".equals(p.getStatus())) used -= 1;
      if (used >= b.getCapacity()) throw new IllegalStateException("bus full, cannot renew");
    }
    p.setStatus("PENDING");
    p.setFeePaid(false);
    return passes.save(p);
  }
}
