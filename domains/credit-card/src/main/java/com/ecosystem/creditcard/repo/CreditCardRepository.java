package com.ecosystem.creditcard.repo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Repository for credit card account data.
 * MVP: Uses in-memory storage. Production would use PostgreSQL.
 */
@Repository
public class CreditCardRepository {

    private static final Logger log = LoggerFactory.getLogger(CreditCardRepository.class);

    // In-memory storage for MVP
    private final Map<String, CreditCardAccount> accounts = new ConcurrentHashMap<>();

    /**
     * Find account by user ecosystem ID.
     */
    public Optional<CreditCardAccount> findByUserEcosystemId(String userEcosystemId) {
        return Optional.ofNullable(accounts.get(userEcosystemId));
    }

    /**
     * Create or update an account.
     */
    public CreditCardAccount save(CreditCardAccount account) {
        accounts.put(account.userEcosystemId(), account);
        log.debug("Saved credit card account for user: {}", account.userEcosystemId());
        return account;
    }

    /**
     * Create a pre-approved account for a user.
     */
    public CreditCardAccount createPreApprovedAccount(String userEcosystemId, BigDecimal limit) {
        CreditCardAccount account = new CreditCardAccount(
                "acc_" + userEcosystemId.hashCode(),
                userEcosystemId,
                AccountStatus.PRE_APPROVED,
                limit,
                limit,
                null,
                null,
                Instant.now(),
                Instant.now()
        );
        return save(account);
    }

    /**
     * Mark an account as onboarded with signature.
     */
    public CreditCardAccount onboard(String userEcosystemId, String signatureText) {
        CreditCardAccount existing = accounts.get(userEcosystemId);
        if (existing == null) {
            throw new IllegalStateException("Account not found for user: " + userEcosystemId);
        }

        CreditCardAccount updated = new CreditCardAccount(
                existing.accountId(),
                existing.userEcosystemId(),
                AccountStatus.ONBOARDED,
                existing.creditLimit(),
                existing.availableLimit(),
                signatureText,
                Instant.now(),
                existing.createdAt(),
                Instant.now()
        );

        return save(updated);
    }

    public record CreditCardAccount(
            String accountId,
            String userEcosystemId,
            AccountStatus status,
            BigDecimal creditLimit,
            BigDecimal availableLimit,
            String signatureText,
            Instant signedAt,
            Instant createdAt,
            Instant updatedAt
    ) {}

    public enum AccountStatus {
        PRE_APPROVED,
        ONBOARDED,
        ACTIVE,
        SUSPENDED,
        CLOSED
    }
}

