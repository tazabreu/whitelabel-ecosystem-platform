package com.ecosystem.webbff.user;

import com.ecosystem.webbff.analytics.AnalyticsClient;
import com.ecosystem.webbff.auth.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Controller for user session management (login/logout).
 */
@RestController
@RequestMapping("/api/user/session")
public class UserSessionController {

    private static final Logger log = LoggerFactory.getLogger(UserSessionController.class);

    private final TokenService tokenService;
    private final AnalyticsClient analyticsClient;

    public UserSessionController(TokenService tokenService, AnalyticsClient analyticsClient) {
        this.tokenService = tokenService;
        this.analyticsClient = analyticsClient;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        String journeyId = (String) httpRequest.getAttribute("journeyId");

        log.info("Login attempt for user: {}", request.username());

        // Validate demo credentials
        DemoUser demoUser = validateDemoCredentials(request.username(), request.password());

        if (demoUser == null) {
            log.warn("Invalid login attempt for user: {}", request.username());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", "invalid_credentials",
                            "message", "Invalid username or password"
                    ));
        }

        // Generate demo token
        String token = tokenService.generateToken(demoUser.username(), demoUser.userEcosystemId(), demoUser.role());

        // Emit analytics event
        emitLoginEvent(journeyId, demoUser.userEcosystemId());

        log.info("Login successful for user: {} ({})", request.username(), demoUser.userEcosystemId());

        return ResponseEntity.ok(new LoginResponse(
                token,
                demoUser.userEcosystemId(),
                demoUser.username(),
                demoUser.role()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpRequest) {
        String journeyId = (String) httpRequest.getAttribute("journeyId");
        String userEcosystemId = (String) httpRequest.getAttribute("userEcosystemId");

        log.info("Logout for user: {}", userEcosystemId);

        // Emit logout event
        if (journeyId != null && userEcosystemId != null) {
            analyticsClient.sendEvent(AnalyticsClient.AnalyticsEvent.builder()
                    .eventId("evt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                    .eventName("logged_out")
                    .domain("user")
                    .entity("session")
                    .action("ended")
                    .timestamp(Instant.now().toString())
                    .journeyId(journeyId)
                    .userEcosystemId(userEcosystemId)
                    .build());
        }

        return ResponseEntity.ok(Map.of("status", "logged_out"));
    }

    private DemoUser validateDemoCredentials(String username, String password) {
        // Demo credentials for MVP
        if ("user".equals(username) && "user".equals(password)) {
            return new DemoUser("user", "usr_demo_user_001", "USER");
        }
        if ("admin".equals(username) && "admin".equals(password)) {
            return new DemoUser("admin", "usr_demo_admin_001", "ADMIN");
        }
        return null;
    }

    private void emitLoginEvent(String journeyId, String userEcosystemId) {
        if (journeyId == null) {
            journeyId = "jrn_unknown";
        }

        analyticsClient.sendEvent(AnalyticsClient.AnalyticsEvent.builder()
                .eventId("evt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .eventName("logged_in")
                .domain("user")
                .entity("session")
                .action("created")
                .timestamp(Instant.now().toString())
                .journeyId(journeyId)
                .userEcosystemId(userEcosystemId)
                .build());
    }

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {}

    public record LoginResponse(
            String token,
            String userEcosystemId,
            String username,
            String role
    ) {}

    private record DemoUser(String username, String userEcosystemId, String role) {}
}

