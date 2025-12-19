package com.ecosystem.creditcard.reset;

import com.ecosystem.creditcard.repo.CreditCardRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Service for resetting credit card accounts to initial state.
 */
@Service
public class ResetService {

    private static final Logger log = LoggerFactory.getLogger(ResetService.class);

    private final CreditCardRepository repository;

    @Value("${credit-card.defaults.pre-approved-limit:5000.00}")
    private BigDecimal defaultLimit;

    public ResetService(CreditCardRepository repository) {
        this.repository = repository;
    }

    /**
     * Reset an account to its initial onboarded state.
     */
    public ResetResult resetAccount(String userEcosystemId) {
        BigDecimal initialLimit = calculateInitialLimit(userEcosystemId);

        // Create new account with reset state
        CreditCardRepository.CreditCardAccount newAccount =
                repository.createPreApprovedAccount(userEcosystemId, initialLimit);

        log.info("Reset account for user {}: limit ${}", userEcosystemId, initialLimit);

        return new ResetResult(
                true,
                initialLimit,
                initialLimit,
                "Account has been reset to initial state"
        );
    }

    private BigDecimal calculateInitialLimit(String userEcosystemId) {
        // Admin users get higher limit
        if (userEcosystemId != null && userEcosystemId.contains("admin")) {
            return defaultLimit.multiply(BigDecimal.valueOf(2));
        }
        return defaultLimit;
    }

    public record ResetResult(
            boolean success,
            BigDecimal creditLimit,
            BigDecimal availableLimit,
            String message
    ) {}
}

