package com.ecosystem.webbff.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Authentication filter for the Web BFF.
 * Validates demo tokens and extracts user information.
 * 
 * For MVP, uses simple demo tokens. Will be replaced with proper JWT/Supabase auth later.
 */
@Component
@Order(10) // After correlation filter
public class AuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AuthFilter.class);

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    // Paths that don't require authentication
    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/user/session/login",
            "/health",
            "/actuator",
            "/api/feature-flags"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip auth for public paths
        if (isPublicPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            // For MVP, allow unauthenticated requests but log a warning
            log.debug("No valid Authorization header for path: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        // For MVP, just extract the user ecosystem ID from a simple token format
        // Format: demo_<userEcosystemId>_<timestamp>
        try {
            DemoTokenInfo tokenInfo = parseDemoToken(token);
            if (tokenInfo != null) {
                request.setAttribute("userEcosystemId", tokenInfo.userEcosystemId());
                request.setAttribute("username", tokenInfo.username());
                request.setAttribute("role", tokenInfo.role());
                MDC.put("userEcosystemId", tokenInfo.userEcosystemId());
            }
        } catch (Exception e) {
            log.warn("Failed to parse demo token: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private DemoTokenInfo parseDemoToken(String token) {
        // Demo token format: demo_<username>_<userEcosystemId>_<role>_<timestamp>
        if (!token.startsWith("demo_")) {
            return null;
        }

        String[] parts = token.split("_");
        if (parts.length < 5) {
            return null;
        }

        return new DemoTokenInfo(parts[1], parts[2], parts[3]);
    }

    private record DemoTokenInfo(String username, String userEcosystemId, String role) {}
}

