package com.college.bus.pass;

import java.time.LocalDate;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PassExpiryJob {
  private final PassRepository passes;
  public PassExpiryJob(PassRepository passes) { this.passes = passes; }

  @Scheduled(cron = "0 0 2 * * *")
  @Transactional
  public void expire() {
    List<BusPass> actives = passes.findAll().stream()
      .filter(p -> "ACTIVE".equals(p.getStatus())
        && p.getValidTo() != null && p.getValidTo().isBefore(LocalDate.now()))
      .toList();
    for (BusPass p : actives) p.setStatus("EXPIRED");
    passes.saveAll(actives);
  }
}
