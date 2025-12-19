package com.ecosystem.creditcard.purchase;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

/**
 * Service for simulating credit card purchases.
 */
@Service
public class PurchaseSimulator {

    private static final Logger log = LoggerFactory.getLogger(PurchaseSimulator.class);
    private static final Random random = new Random();

    /**
     * Simulate a purchase with a random amount.
     */
    public PurchaseResult simulatePurchase(String userEcosystemId, BigDecimal availableLimit) {
        // Generate random amount between $10 and $500
        BigDecimal amount = BigDecimal.valueOf(10 + random.nextDouble() * 490)
                .setScale(2, RoundingMode.HALF_UP);

        return attemptPurchase(userEcosystemId, availableLimit, amount);
    }

    /**
     * Attempt a purchase for a specific amount.
     */
    public PurchaseResult attemptPurchase(String userEcosystemId, BigDecimal availableLimit, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return new PurchaseResult(
                    PurchaseStatus.DECLINED,
                    amount,
                    "Invalid purchase amount",
                    availableLimit
            );
        }

        if (availableLimit.compareTo(amount) >= 0) {
            BigDecimal newAvailable = availableLimit.subtract(amount);
            log.info("Purchase approved for user {}: ${} (remaining: ${})",
                    userEcosystemId, amount, newAvailable);

            return new PurchaseResult(
                    PurchaseStatus.APPROVED,
                    amount,
                    "Purchase successful",
                    newAvailable
            );
        } else {
            log.info("Purchase declined for user {}: ${} (available: ${})",
                    userEcosystemId, amount, availableLimit);

            return new PurchaseResult(
                    PurchaseStatus.DECLINED,
                    amount,
                    "Insufficient available credit",
                    availableLimit
            );
        }
    }

    public record PurchaseResult(
            PurchaseStatus status,
            BigDecimal amount,
            String message,
            BigDecimal remainingLimit
    ) {}

    public enum PurchaseStatus {
        APPROVED,
        DECLINED
    }
}

