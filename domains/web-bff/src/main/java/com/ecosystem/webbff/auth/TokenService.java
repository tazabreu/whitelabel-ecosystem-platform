package com.ecosystem.webbff.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;

/**
 * Service for generating and validating demo tokens.
 * 
 * For MVP, uses simple demo tokens. Will be replaced with JWT/Supabase later.
 */
@Service
public class TokenService {

    @Value("${demo.auth.secret:demo-secret-change-in-prod}")
    private String secret;

    /**
     * Generate a demo token for a user.
     * Token format: demo_<username>_<userEcosystemId>_<role>_<timestamp>
     */
    public String generateToken(String username, String userEcosystemId, String role) {
        long timestamp = System.currentTimeMillis();
        String tokenData = String.format("demo_%s_%s_%s_%d", username, userEcosystemId, role, timestamp);
        return tokenData;
    }

    /**
     * Validate and parse a demo token.
     * Returns null if invalid.
     */
    public TokenInfo validateToken(String token) {
        if (token == null || !token.startsWith("demo_")) {
            return null;
        }

        String[] parts = token.split("_");
        if (parts.length < 5) {
            return null;
        }

        try {
            String username = parts[1];
            String userEcosystemId = parts[2];
            String role = parts[3];
            long timestamp = Long.parseLong(parts[4]);

            // Check token age (24 hours max for demo)
            long maxAge = 24 * 60 * 60 * 1000;
            if (System.currentTimeMillis() - timestamp > maxAge) {
                return null;
            }

            return new TokenInfo(username, userEcosystemId, role, timestamp);
        } catch (Exception e) {
            return null;
        }
    }

    public record TokenInfo(String username, String userEcosystemId, String role, long timestamp) {}
}

