package com.ecosystem.creditcard.health;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Health check endpoints for the Credit Card Service.
 */
@RestController
public class HealthController {

    @Value("${spring.application.name:credit-card-service}")
    private String serviceName;

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "healthy",
                "service", serviceName,
                "timestamp", Instant.now().toString()
        );
    }

    @GetMapping("/ready")
    public Map<String, Object> ready() {
        // TODO: Add database and Kafka health checks
        return Map.of(
                "status", "ready",
                "service", serviceName,
                "timestamp", Instant.now().toString()
        );
    }
}

