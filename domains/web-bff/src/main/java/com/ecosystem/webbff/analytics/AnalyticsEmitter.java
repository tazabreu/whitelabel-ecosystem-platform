package com.ecosystem.webbff.analytics;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Helper component for emitting analytics events from the Web BFF.
 * Provides convenient methods for common event types.
 */
@Component
public class AnalyticsEmitter {

    private final AnalyticsClient analyticsClient;

    public AnalyticsEmitter(AnalyticsClient analyticsClient) {
        this.analyticsClient = analyticsClient;
    }

    /**
     * Emit a generic analytics event.
     */
    public void emit(String eventName, String domain, String entity, String action,
                     String journeyId, String userEcosystemId, Map<String, Object> metadata) {
        analyticsClient.sendEvent(AnalyticsClient.AnalyticsEvent.builder()
                .eventId(generateEventId())
                .eventName(eventName)
                .domain(domain)
                .entity(entity)
                .action(action)
                .timestamp(Instant.now().toString())
                .journeyId(journeyId != null ? journeyId : "jrn_unknown")
                .userEcosystemId(userEcosystemId)
                .metadata(metadata != null ? metadata : Map.of())
                .build());
    }

    /**
     * Emit an event using request attributes for correlation.
     */
    public void emit(HttpServletRequest request, String eventName, String domain,
                     String entity, String action, Map<String, Object> metadata) {
        String journeyId = (String) request.getAttribute("journeyId");
        String userEcosystemId = (String) request.getAttribute("userEcosystemId");
        emit(eventName, domain, entity, action, journeyId, userEcosystemId, metadata);
    }

    // === User Domain Events ===

    public void emitLoggedIn(String journeyId, String userEcosystemId) {
        emit("logged_in", "user", "session", "created", journeyId, userEcosystemId, null);
    }

    public void emitLoggedOut(String journeyId, String userEcosystemId) {
        emit("logged_out", "user", "session", "ended", journeyId, userEcosystemId, null);
    }

    // === Credit Card Domain Events ===

    public void emitOfferViewed(String journeyId, String userEcosystemId, Map<String, Object> offerDetails) {
        emit("offer_viewed", "credit-card", "offer", "viewed", journeyId, userEcosystemId, offerDetails);
    }

    public void emitOnboardingSigned(String journeyId, String userEcosystemId, Map<String, Object> onboardingDetails) {
        emit("onboarding_signed", "credit-card", "onboarding", "signed", journeyId, userEcosystemId, onboardingDetails);
    }

    public void emitPurchaseSimulated(String journeyId, String userEcosystemId, Map<String, Object> purchaseDetails) {
        emit("purchase_simulated", "credit-card", "purchase", "simulated", journeyId, userEcosystemId, purchaseDetails);
    }

    public void emitLimitRaised(String journeyId, String userEcosystemId, Map<String, Object> limitDetails) {
        emit("limit_raised", "credit-card", "limit", "raised", journeyId, userEcosystemId, limitDetails);
    }

    public void emitAccountReset(String journeyId, String userEcosystemId) {
        emit("account_reset", "credit-card", "account", "reset", journeyId, userEcosystemId, null);
    }

    // === Navigation Events ===

    public void emitNavigation(String journeyId, String userEcosystemId, String from, String to) {
        emit("navigation", "platform", "navigation", "navigated", journeyId, userEcosystemId,
                Map.of("from", from != null ? from : "", "to", to != null ? to : ""));
    }

    private String generateEventId() {
        return "evt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }
}

