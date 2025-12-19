package com.ecosystem.user.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

/**
 * Demo authentication service for MVP.
 * Will be replaced with Supabase integration later.
 */
@Service
public class DemoAuthService {

    private static final Logger log = LoggerFactory.getLogger(DemoAuthService.class);

    // Demo users - in production, this would come from Supabase
    private static final Map<String, DemoUser> DEMO_USERS = Map.of(
            "user", new DemoUser("user", "user", "usr_demo_user_001", "USER"),
            "admin", new DemoUser("admin", "admin", "usr_demo_admin_001", "ADMIN")
    );

    /**
     * Authenticate a user with demo credentials.
     */
    public Optional<AuthResult> authenticate(String username, String password) {
        log.debug("Authenticating user: {}", username);

        DemoUser user = DEMO_USERS.get(username);
        if (user == null || !user.password().equals(password)) {
            log.warn("Authentication failed for user: {}", username);
            return Optional.empty();
        }

        log.info("Authentication successful for user: {}", username);
        return Optional.of(new AuthResult(user.userEcosystemId(), user.username(), user.role()));
    }

    /**
     * Get user info by ecosystem ID.
     */
    public Optional<UserInfo> getUserByEcosystemId(String userEcosystemId) {
        return DEMO_USERS.values().stream()
                .filter(u -> u.userEcosystemId().equals(userEcosystemId))
                .findFirst()
                .map(u -> new UserInfo(u.userEcosystemId(), u.username(), u.role()));
    }

    public record DemoUser(String username, String password, String userEcosystemId, String role) {}

    public record AuthResult(String userEcosystemId, String username, String role) {}

    public record UserInfo(String userEcosystemId, String username, String role) {}
}

