package com.ecosystem.creditcard.limit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Service for credit limit policy and adjustments.
 */
@Service
public class LimitPolicyService {

    private static final Logger log = LoggerFactory.getLogger(LimitPolicyService.class);

    @Value("${credit-card.defaults.raise-limit-increment:2000.00}")
    private BigDecimal defaultIncrement;

    @Value("${credit-card.limits.max:50000.00}")
    private BigDecimal maxLimit;

    /**
     * Calculate the new limit when raising.
     */
    public LimitAdjustmentResult raiseLimit(String userEcosystemId, BigDecimal currentLimit) {
        return raiseLimit(userEcosystemId, currentLimit, defaultIncrement);
    }

    /**
     * Calculate the new limit when raising by a specific amount.
     */
    public LimitAdjustmentResult raiseLimit(String userEcosystemId, BigDecimal currentLimit, BigDecimal increment) {
        BigDecimal newLimit = currentLimit.add(increment);

        // Cap at max limit
        if (newLimit.compareTo(maxLimit) > 0) {
            if (currentLimit.compareTo(maxLimit) >= 0) {
                return new LimitAdjustmentResult(
                        false,
                        currentLimit,
                        currentLimit,
                        BigDecimal.ZERO,
                        "Maximum credit limit reached"
                );
            }
            BigDecimal actualIncrement = maxLimit.subtract(currentLimit);
            return new LimitAdjustmentResult(
                    true,
                    currentLimit,
                    maxLimit,
                    actualIncrement,
                    "Limit raised to maximum"
            );
        }

        log.info("Raised limit for user {}: ${} -> ${}", userEcosystemId, currentLimit, newLimit);

        return new LimitAdjustmentResult(
                true,
                currentLimit,
                newLimit,
                increment,
                "Limit increased by $" + increment
        );
    }

    /**
     * Check if a user is eligible for a limit increase.
     */
    public boolean isEligibleForIncrease(String userEcosystemId, BigDecimal currentLimit) {
        // MVP: Always eligible unless at max
        return currentLimit.compareTo(maxLimit) < 0;
    }

    public record LimitAdjustmentResult(
            boolean success,
            BigDecimal oldLimit,
            BigDecimal newLimit,
            BigDecimal increment,
            String message
    ) {}
}

