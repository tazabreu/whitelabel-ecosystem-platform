package com.ecosystem.webbff.creditcard;

import com.ecosystem.webbff.analytics.AnalyticsEmitter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.Map;

/**
 * Controller for credit card onboarding endpoints.
 */
@RestController
@RequestMapping("/api/credit-card/onboarding")
public class CreditCardOnboardingController {

    private static final Logger log = LoggerFactory.getLogger(CreditCardOnboardingController.class);

    private final WebClient webClient;
    private final AnalyticsEmitter analyticsEmitter;

    public CreditCardOnboardingController(
            WebClient.Builder webClientBuilder,
            @Value("${services.credit-card.url:http://localhost:8082}") String creditCardServiceUrl,
            AnalyticsEmitter analyticsEmitter) {
        this.webClient = webClientBuilder.baseUrl(creditCardServiceUrl).build();
        this.analyticsEmitter = analyticsEmitter;
    }

    /**
     * Sign/complete the credit card onboarding.
     */
    @PostMapping("/sign")
    public ResponseEntity<?> signOnboarding(
            @Valid @RequestBody SignatureRequest request,
            HttpServletRequest httpRequest) {

        String userEcosystemId = (String) httpRequest.getAttribute("userEcosystemId");
        String journeyId = (String) httpRequest.getAttribute("journeyId");

        // Validate signature text
        if (!isValidSignature(request.signature())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "invalid_signature",
                            "message", "Please type 'I agree' to confirm"
                    ));
        }

        log.info("Processing onboarding signature for user: {}", userEcosystemId);

        // For MVP, just log and return success
        // In production, this would call the Credit Card service

        // Emit analytics event
        analyticsEmitter.emitOnboardingSigned(journeyId, userEcosystemId,
                Map.of(
                        "signedAt", Instant.now().toString(),
                        "signatureText", request.signature()
                ));

        return ResponseEntity.ok(Map.of(
                "status", "ONBOARDED",
                "message", "Congratulations! Your credit card is now active.",
                "signedAt", Instant.now().toString()
        ));
    }

    private boolean isValidSignature(String signature) {
        return signature != null && signature.trim().toLowerCase().equals("i agree");
    }

    public record SignatureRequest(
            @NotBlank String signature
    ) {}
}

