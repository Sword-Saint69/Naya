package com.college.bus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BusPassApplication {
  public static void main(String[] args) {
    SpringApplication.run(BusPassApplication.class, args);
  }
}
