package com.ecosystem.creditcard.onboarding;

import org.springframework.stereotype.Component;

/**
 * Validates digital signatures for credit card onboarding.
 */
@Component
public class SignatureValidator {

    private static final String REQUIRED_SIGNATURE = "i agree";

    /**
     * Validate that the signature text matches the required format.
     */
    public ValidationResult validate(String signatureText) {
        if (signatureText == null || signatureText.isBlank()) {
            return new ValidationResult(false, "Signature is required");
        }

        if (!signatureText.trim().toLowerCase().equals(REQUIRED_SIGNATURE)) {
            return new ValidationResult(false, "Please type 'I agree' to confirm");
        }

        return new ValidationResult(true, null);
    }

    public record ValidationResult(boolean isValid, String errorMessage) {
        public boolean isInvalid() {
            return !isValid;
        }
    }
}

