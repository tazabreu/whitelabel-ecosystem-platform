package com.ecosystem.webbff.creditcard;

import com.ecosystem.webbff.analytics.AnalyticsEmitter;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Controller for credit card offer endpoints.
 */
@RestController
@RequestMapping("/api/credit-card")
public class CreditCardOfferController {

    private static final Logger log = LoggerFactory.getLogger(CreditCardOfferController.class);

    private final WebClient webClient;
    private final AnalyticsEmitter analyticsEmitter;

    @Value("${feature.flags.credit-cards.pre-approved-offers:false}")
    private boolean preApprovedOffersEnabled;

    public CreditCardOfferController(
            WebClient.Builder webClientBuilder,
            @Value("${services.credit-card.url:http://localhost:8082}") String creditCardServiceUrl,
            AnalyticsEmitter analyticsEmitter) {
        this.webClient = webClientBuilder.baseUrl(creditCardServiceUrl).build();
        this.analyticsEmitter = analyticsEmitter;
    }

    /**
     * Get the user's credit card offer.
     */
    @GetMapping("/offer")
    public ResponseEntity<?> getOffer(HttpServletRequest request) {
        String userEcosystemId = (String) request.getAttribute("userEcosystemId");
        String journeyId = (String) request.getAttribute("journeyId");

        // Check feature flag
        if (!preApprovedOffersEnabled) {
            return ResponseEntity.ok(Map.of(
                    "featureEnabled", false,
                    "message", "Pre-approved offers are not currently available"
            ));
        }

        // For MVP, return a mock pre-approved offer
        // In production, this would call the Credit Card service
        if (userEcosystemId == null) {
            userEcosystemId = "usr_demo_user_001";
        }

        BigDecimal preApprovedLimit = userEcosystemId.contains("admin") 
                ? new BigDecimal("10000.00") 
                : new BigDecimal("5000.00");

        log.info("Returning credit card offer for user: {}", userEcosystemId);

        // Emit analytics event
        analyticsEmitter.emitOfferViewed(journeyId, userEcosystemId,
                Map.of("limit", preApprovedLimit.doubleValue()));

        return ResponseEntity.ok(Map.of(
                "offerId", "offer_" + userEcosystemId.hashCode(),
                "preApprovedLimit", preApprovedLimit,
                "status", "PRE_APPROVED"
        ));
    }
}

