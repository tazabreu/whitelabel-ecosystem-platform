package com.ecosystem.webbff.observability;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filter that extracts correlation headers and adds them to the MDC for logging.
 * Also generates a request ID if not present.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationFilter extends OncePerRequestFilter {

    public static final String HEADER_JOURNEY_ID = "x-journey-id";
    public static final String HEADER_USER_ECOSYSTEM_ID = "x-user-ecosystem-id";
    public static final String HEADER_REQUEST_ID = "x-request-id";

    public static final String MDC_JOURNEY_ID = "journeyId";
    public static final String MDC_USER_ECOSYSTEM_ID = "userEcosystemId";
    public static final String MDC_REQUEST_ID = "requestId";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // Extract or generate correlation IDs
            String journeyId = request.getHeader(HEADER_JOURNEY_ID);
            String userEcosystemId = request.getHeader(HEADER_USER_ECOSYSTEM_ID);
            String requestId = request.getHeader(HEADER_REQUEST_ID);

            if (requestId == null || requestId.isEmpty()) {
                requestId = "req_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            }

            // Add to MDC for logging
            if (journeyId != null && !journeyId.isEmpty()) {
                MDC.put(MDC_JOURNEY_ID, journeyId);
            }
            if (userEcosystemId != null && !userEcosystemId.isEmpty()) {
                MDC.put(MDC_USER_ECOSYSTEM_ID, userEcosystemId);
            }
            MDC.put(MDC_REQUEST_ID, requestId);

            // Add request ID to response for debugging
            response.setHeader(HEADER_REQUEST_ID, requestId);

            // Store in request attributes for downstream use
            request.setAttribute(MDC_JOURNEY_ID, journeyId);
            request.setAttribute(MDC_USER_ECOSYSTEM_ID, userEcosystemId);
            request.setAttribute(MDC_REQUEST_ID, requestId);

            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}

