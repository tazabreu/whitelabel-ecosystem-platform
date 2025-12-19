package com.ecosystem.creditcard.offer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Service for managing credit card offers.
 */
@Service
public class OfferService {

    private static final Logger log = LoggerFactory.getLogger(OfferService.class);

    @Value("${credit-card.defaults.pre-approved-limit:5000.00}")
    private BigDecimal defaultPreApprovedLimit;

    /**
     * Get the pre-approved offer for a user.
     */
    public Optional<CreditCardOffer> getPreApprovedOffer(String userEcosystemId) {
        log.debug("Getting pre-approved offer for user: {}", userEcosystemId);

        // For MVP, return a default offer
        // In production, this would check eligibility and calculate limits

        BigDecimal limit = calculatePreApprovedLimit(userEcosystemId);

        CreditCardOffer offer = new CreditCardOffer(
                "offer_" + userEcosystemId.hashCode(),
                userEcosystemId,
                limit,
                OfferStatus.PRE_APPROVED
        );

        return Optional.of(offer);
    }

    private BigDecimal calculatePreApprovedLimit(String userEcosystemId) {
        // MVP: Admin users get higher limit
        if (userEcosystemId != null && userEcosystemId.contains("admin")) {
            return defaultPreApprovedLimit.multiply(BigDecimal.valueOf(2));
        }
        return defaultPreApprovedLimit;
    }

    public record CreditCardOffer(
            String offerId,
            String userEcosystemId,
            BigDecimal preApprovedLimit,
            OfferStatus status
    ) {}

    public enum OfferStatus {
        PRE_APPROVED,
        ACCEPTED,
        EXPIRED,
        DECLINED
    }
}

