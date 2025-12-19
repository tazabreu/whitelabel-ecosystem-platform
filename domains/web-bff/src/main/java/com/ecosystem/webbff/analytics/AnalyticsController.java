package com.ecosystem.webbff.analytics;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

/**
 * Controller for analytics event passthrough from web shell to Analytics service.
 */
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsController.class);

    private final WebClient webClient;

    public AnalyticsController(
            WebClient.Builder webClientBuilder,
            @Value("${services.analytics.url:http://localhost:8090}") String analyticsServiceUrl) {
        this.webClient = webClientBuilder
                .baseUrl(analyticsServiceUrl)
                .build();
    }

    /**
     * Pass through analytics events to the Analytics service.
     * Enriches events with correlation context from request.
     */
    @PostMapping("/events")
    public ResponseEntity<?> postEvent(
            @RequestBody Map<String, Object> event,
            HttpServletRequest request) {

        // Enrich event with correlation context from headers/attributes
        String journeyId = (String) request.getAttribute("journeyId");
        String userEcosystemId = (String) request.getAttribute("userEcosystemId");

        if (journeyId != null && !event.containsKey("journeyId")) {
            event.put("journeyId", journeyId);
        }
        if (userEcosystemId != null && !event.containsKey("userEcosystemId")) {
            event.put("userEcosystemId", userEcosystemId);
        }

        log.debug("Forwarding analytics event: {}", event.get("eventName"));

        // Forward to Analytics service asynchronously
        webClient.post()
                .uri("/api/analytics/events")
                .header("x-journey-id", journeyId != null ? journeyId : "")
                .header("x-user-ecosystem-id", userEcosystemId != null ? userEcosystemId : "")
                .bodyValue(event)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(5))
                .doOnSuccess(response -> log.debug("Analytics event forwarded successfully"))
                .doOnError(error -> log.warn("Failed to forward analytics event: {}", error.getMessage()))
                .onErrorResume(e -> Mono.empty())
                .subscribe();

        // Return accepted immediately (don't block on Analytics service)
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(Map.of("status", "accepted"));
    }

    /**
     * Batch event passthrough.
     */
    @PostMapping("/events/batch")
    public ResponseEntity<?> postBatchEvents(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {

        String journeyId = (String) request.getAttribute("journeyId");
        String userEcosystemId = (String) request.getAttribute("userEcosystemId");

        // Forward to Analytics service
        webClient.post()
                .uri("/api/analytics/events/batch")
                .header("x-journey-id", journeyId != null ? journeyId : "")
                .header("x-user-ecosystem-id", userEcosystemId != null ? userEcosystemId : "")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(10))
                .onErrorResume(e -> Mono.empty())
                .subscribe();

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(Map.of("status", "accepted"));
    }
}

