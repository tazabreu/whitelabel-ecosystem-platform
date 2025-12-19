package com.ecosystem.webbff.creditcard;

import com.ecosystem.webbff.analytics.AnalyticsEmitter;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Controller for credit card action endpoints (purchase simulation, raise limit, reset).
 */
@RestController
@RequestMapping("/api/credit-card")
public class CreditCardActionsController {

    private static final Logger log = LoggerFactory.getLogger(CreditCardActionsController.class);
    private static final Random random = new Random();

    private final AnalyticsEmitter analyticsEmitter;

    // In-memory state for MVP (per-user simulation state)
    private final Map<String, UserCreditState> userStates = new ConcurrentHashMap<>();

    @Value("${credit-card.defaults.pre-approved-limit:5000.00}")
    private BigDecimal defaultLimit;

    @Value("${credit-card.defaults.raise-limit-increment:2000.00}")
    private BigDecimal raiseLimitIncrement;

    public CreditCardActionsController(AnalyticsEmitter analyticsEmitter) {
        this.analyticsEmitter = analyticsEmitter;
    }

    /**
     * Get the current account state.
     */
    @GetMapping("/account")
    public ResponseEntity<?> getAccount(HttpServletRequest request) {
        String userEcosystemId = getUserEcosystemId(request);
        UserCreditState state = getOrCreateState(userEcosystemId);

        return ResponseEntity.ok(Map.of(
                "accountId", "acc_" + userEcosystemId.hashCode(),
                "status", "ONBOARDED",
                "creditLimit", state.creditLimit,
                "availableLimit", state.availableLimit
        ));
    }

    /**
     * Simulate a purchase with a random amount.
     */
    @PostMapping("/actions/simulate-purchase")
    public ResponseEntity<?> simulatePurchase(HttpServletRequest request) {
        String userEcosystemId = getUserEcosystemId(request);
        String journeyId = (String) request.getAttribute("journeyId");
        UserCreditState state = getOrCreateState(userEcosystemId);

        // Generate random purchase amount between $10 and $500
        BigDecimal amount = BigDecimal.valueOf(10 + random.nextDouble() * 490)
                .setScale(2, java.math.RoundingMode.HALF_UP);

        String status;
        String message;

        if (state.availableLimit.compareTo(amount) >= 0) {
            // Approved
            state.availableLimit = state.availableLimit.subtract(amount);
            status = "approved";
            message = "Purchase successful";
            log.info("Purchase approved for user {}: ${}", userEcosystemId, amount);
        } else {
            // Declined
            status = "declined";
            message = "Insufficient available credit";
            log.info("Purchase declined for user {}: ${} (available: ${})",
                    userEcosystemId, amount, state.availableLimit);
        }

        // Emit analytics
        analyticsEmitter.emitPurchaseSimulated(journeyId, userEcosystemId,
                Map.of("amount", amount.doubleValue(), "status", status));

        return ResponseEntity.ok(Map.of(
                "status", status,
                "amount", amount,
                "message", message,
                "remainingLimit", state.availableLimit
        ));
    }

    /**
     * Raise the credit limit.
     */
    @PostMapping("/actions/raise-limit")
    public ResponseEntity<?> raiseLimit(HttpServletRequest request) {
        String userEcosystemId = getUserEcosystemId(request);
        String journeyId = (String) request.getAttribute("journeyId");
        UserCreditState state = getOrCreateState(userEcosystemId);

        BigDecimal oldLimit = state.creditLimit;
        state.creditLimit = state.creditLimit.add(raiseLimitIncrement);
        state.availableLimit = state.availableLimit.add(raiseLimitIncrement);

        log.info("Raised limit for user {}: ${} -> ${}", userEcosystemId, oldLimit, state.creditLimit);

        // Emit analytics
        analyticsEmitter.emitLimitRaised(journeyId, userEcosystemId,
                Map.of("oldLimit", oldLimit.doubleValue(), "newLimit", state.creditLimit.doubleValue()));

        return ResponseEntity.ok(Map.of(
                "newLimit", state.creditLimit,
                "availableLimit", state.availableLimit,
                "message", "Limit increased by $" + raiseLimitIncrement
        ));
    }

    /**
     * Reset the account to initial state.
     */
    @PostMapping("/actions/reset")
    public ResponseEntity<?> reset(HttpServletRequest request) {
        String userEcosystemId = getUserEcosystemId(request);
        String journeyId = (String) request.getAttribute("journeyId");

        // Reset to initial state
        BigDecimal initialLimit = userEcosystemId.contains("admin")
                ? defaultLimit.multiply(BigDecimal.valueOf(2))
                : defaultLimit;

        UserCreditState state = new UserCreditState(initialLimit, initialLimit);
        userStates.put(userEcosystemId, state);

        log.info("Reset account for user {}: limit ${}", userEcosystemId, initialLimit);

        // Emit analytics
        analyticsEmitter.emitAccountReset(journeyId, userEcosystemId);

        return ResponseEntity.ok(Map.of(
                "status", "reset",
                "creditLimit", state.creditLimit,
                "availableLimit", state.availableLimit,
                "message", "Account has been reset"
        ));
    }

    private String getUserEcosystemId(HttpServletRequest request) {
        String userEcosystemId = (String) request.getAttribute("userEcosystemId");
        return userEcosystemId != null ? userEcosystemId : "usr_demo_user_001";
    }

    private UserCreditState getOrCreateState(String userEcosystemId) {
        return userStates.computeIfAbsent(userEcosystemId, id -> {
            BigDecimal initialLimit = id.contains("admin")
                    ? defaultLimit.multiply(BigDecimal.valueOf(2))
                    : defaultLimit;
            return new UserCreditState(initialLimit, initialLimit);
        });
    }

    private static class UserCreditState {
        BigDecimal creditLimit;
        BigDecimal availableLimit;

        UserCreditState(BigDecimal creditLimit, BigDecimal availableLimit) {
            this.creditLimit = creditLimit;
            this.availableLimit = availableLimit;
        }
    }
}

