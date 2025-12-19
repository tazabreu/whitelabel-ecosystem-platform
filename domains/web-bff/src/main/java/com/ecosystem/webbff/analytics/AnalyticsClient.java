package com.ecosystem.webbff.analytics;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

/**
 * Client for sending analytics events to the Analytics service.
 * Uses best-effort delivery with buffering for resilience.
 */
@Component
public class AnalyticsClient {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsClient.class);

    private final WebClient webClient;
    private final String analyticsServiceUrl;

    public AnalyticsClient(
            WebClient.Builder webClientBuilder,
            @Value("${services.analytics.url:http://localhost:8090}") String analyticsServiceUrl) {
        this.analyticsServiceUrl = analyticsServiceUrl;
        this.webClient = webClientBuilder
                .baseUrl(analyticsServiceUrl)
                .build();
    }

    /**
     * Send an analytics event to the Analytics service.
     * Uses fire-and-forget pattern with best-effort delivery.
     *
     * @param event The analytics event to send
     */
    public void sendEvent(AnalyticsEvent event) {
        webClient.post()
                .uri("/api/analytics/events")
                .bodyValue(event)
                .retrieve()
                .bodyToMono(Void.class)
                .timeout(Duration.ofSeconds(5))
                .doOnSuccess(v -> log.debug("Analytics event sent: {}", event.eventName()))
                .doOnError(e -> log.warn("Failed to send analytics event: {} - {}", event.eventName(), e.getMessage()))
                .onErrorResume(e -> Mono.empty()) // Best-effort: don't fail the request
                .subscribe();
    }

    /**
     * Analytics event record matching the JSON schema.
     */
    public record AnalyticsEvent(
            String eventId,
            String eventName,
            String domain,
            String entity,
            String action,
            String timestamp,
            String journeyId,
            String userEcosystemId,
            String traceId,
            String spanId,
            String source,
            Map<String, Object> metadata
    ) {
        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private String eventId;
            private String eventName;
            private String domain;
            private String entity;
            private String action;
            private String timestamp;
            private String journeyId;
            private String userEcosystemId;
            private String traceId;
            private String spanId;
            private String source = "web-bff";
            private Map<String, Object> metadata = Map.of();

            public Builder eventId(String eventId) {
                this.eventId = eventId;
                return this;
            }

            public Builder eventName(String eventName) {
                this.eventName = eventName;
                return this;
            }

            public Builder domain(String domain) {
                this.domain = domain;
                return this;
            }

            public Builder entity(String entity) {
                this.entity = entity;
                return this;
            }

            public Builder action(String action) {
                this.action = action;
                return this;
            }

            public Builder timestamp(String timestamp) {
                this.timestamp = timestamp;
                return this;
            }

            public Builder journeyId(String journeyId) {
                this.journeyId = journeyId;
                return this;
            }

            public Builder userEcosystemId(String userEcosystemId) {
                this.userEcosystemId = userEcosystemId;
                return this;
            }

            public Builder traceId(String traceId) {
                this.traceId = traceId;
                return this;
            }

            public Builder spanId(String spanId) {
                this.spanId = spanId;
                return this;
            }

            public Builder source(String source) {
                this.source = source;
                return this;
            }

            public Builder metadata(Map<String, Object> metadata) {
                this.metadata = metadata;
                return this;
            }

            public AnalyticsEvent build() {
                return new AnalyticsEvent(
                        eventId, eventName, domain, entity, action,
                        timestamp, journeyId, userEcosystemId,
                        traceId, spanId, source, metadata
                );
            }
        }
    }
}

