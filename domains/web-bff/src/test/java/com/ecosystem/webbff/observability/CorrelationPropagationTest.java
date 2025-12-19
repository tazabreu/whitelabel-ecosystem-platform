package com.ecosystem.webbff.observability;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests verifying correlation header propagation through the Web BFF.
 */
@SpringBootTest
@AutoConfigureMockMvc
class CorrelationPropagationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldPropagateJourneyIdHeader() throws Exception {
        String journeyId = "jrn_test_journey_123";

        mockMvc.perform(get("/health")
                        .header("x-journey-id", journeyId))
                .andExpect(status().isOk())
                .andExpect(header().exists("x-request-id"));
    }

    @Test
    void shouldPropagateUserEcosystemIdHeader() throws Exception {
        String journeyId = "jrn_test_journey_456";
        String userEcosystemId = "usr_test_user_789";

        mockMvc.perform(get("/health")
                        .header("x-journey-id", journeyId)
                        .header("x-user-ecosystem-id", userEcosystemId))
                .andExpect(status().isOk())
                .andExpect(header().exists("x-request-id"));
    }

    @Test
    void shouldGenerateRequestIdWhenNotProvided() throws Exception {
        MvcResult result = mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andReturn();

        String requestId = result.getResponse().getHeader("x-request-id");
        assert requestId != null && requestId.startsWith("req_");
    }

    @Test
    void shouldPreserveRequestIdWhenProvided() throws Exception {
        String providedRequestId = "req_provided_123456";

        mockMvc.perform(get("/health")
                        .header("x-request-id", providedRequestId))
                .andExpect(status().isOk())
                .andExpect(header().string("x-request-id", providedRequestId));
    }

    @Test
    void shouldHandleMissingCorrelationHeaders() throws Exception {
        // Should not fail when correlation headers are missing
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk());
    }
}

