package com.college.bus.pass;

import com.college.bus.common.ApiResponse;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/passes")
public class AdminPassController {
  private final PassRepository passes;
  private final PassService service;

  public AdminPassController(PassRepository passes, PassService service) {
    this.passes = passes; this.service = service;
  }

  @GetMapping
  public ApiResponse<?> all(@RequestParam(required = false) String status) {
    if (status == null) return ApiResponse.ok(passes.findAll());
    return ApiResponse.ok(passes.findAll().stream()
      .filter(p -> status.equalsIgnoreCase(p.getStatus())).toList());
  }

  public record DecideReq(Long assignmentId, boolean feePaid) {}

  @PatchMapping("/{id}/approve")
  public ApiResponse<?> approve(@PathVariable Long id, @RequestBody DecideReq r) {
    if (r.assignmentId() == null) throw new IllegalArgumentException("assignmentId required");
    return ApiResponse.ok(service.approve(id, r.assignmentId(), r.feePaid()));
  }

  @PatchMapping("/{id}/reject")
  public ApiResponse<?> reject(@PathVariable Long id) {
    BusPass p = passes.findById(id).orElseThrow(() -> new IllegalArgumentException("pass not found"));
    if (!"PENDING".equals(p.getStatus())) throw new IllegalStateException("only PENDING can be rejected");
    p.setStatus("REJECTED");
    return ApiResponse.ok(passes.save(p));
  }
}
