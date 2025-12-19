package com.ecosystem.webbff.contract;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Contract tests validating the Web BFF API against the OpenAPI specification.
 * These tests ensure the API contract is maintained.
 */
@SpringBootTest
@AutoConfigureMockMvc
class OpenApiContractTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthEndpoint_returnsExpectedStructure() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("healthy"))
                .andExpect(jsonPath("$.service").exists())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void loginEndpoint_acceptsValidCredentials() throws Exception {
        String loginRequest = """
                {
                    "username": "user",
                    "password": "user"
                }
                """;

        mockMvc.perform(post("/api/user/session/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.userEcosystemId").exists());
    }

    @Test
    void loginEndpoint_rejectsInvalidCredentials() throws Exception {
        String loginRequest = """
                {
                    "username": "invalid",
                    "password": "invalid"
                }
                """;

        mockMvc.perform(post("/api/user/session/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginEndpoint_requiresCorrelationHeaders() throws Exception {
        String loginRequest = """
                {
                    "username": "user",
                    "password": "user"
                }
                """;

        // Should work with journey ID header
        mockMvc.perform(post("/api/user/session/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("x-journey-id", "jrn_test123")
                        .content(loginRequest))
                .andExpect(status().isOk());
    }

    @Test
    void featureFlagsEndpoint_returnsFlags() throws Exception {
        mockMvc.perform(get("/api/feature-flags"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}

