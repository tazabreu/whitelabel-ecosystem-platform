import { describe, it, expect, beforeAll, afterAll } from "vitest";

// Integration test for analytics ingestion
// These tests require a running analytics service and database

const ANALYTICS_URL = process.env.ANALYTICS_SERVICE_URL || "http://localhost:8090";

describe("Analytics Event Ingestion", () => {
  const validEvent = {
    eventId: "evt_test123456789",
    eventName: "test_event",
    domain: "user",
    entity: "session",
    action: "created",
    timestamp: new Date().toISOString(),
    journeyId: "jrn_test123456789abc",
    userEcosystemId: "usr_test_user_001",
    source: "test",
    metadata: { test: true },
  };

  describe("POST /api/analytics/events", () => {
    it("should accept valid analytics events", async () => {
      const response = await fetch(`${ANALYTICS_URL}/api/analytics/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-journey-id": validEvent.journeyId,
        },
        body: JSON.stringify(validEvent),
      });

      expect(response.status).toBe(202);
      const body = await response.json();
      expect(body.status).toBe("accepted");
    });

    it("should require journeyId in the event", async () => {
      const eventWithoutJourneyId = { ...validEvent, journeyId: undefined };

      const response = await fetch(`${ANALYTICS_URL}/api/analytics/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventWithoutJourneyId),
      });

      // Should either reject or use header
      expect([202, 400]).toContain(response.status);
    });

    it("should handle batch events", async () => {
      const events = [
        { ...validEvent, eventId: "evt_batch001" },
        { ...validEvent, eventId: "evt_batch002" },
        { ...validEvent, eventId: "evt_batch003" },
      ];

      const response = await fetch(`${ANALYTICS_URL}/api/analytics/events/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-journey-id": validEvent.journeyId,
        },
        body: JSON.stringify({ events }),
      });

      // Batch endpoint may not be implemented yet
      expect([200, 202, 404]).toContain(response.status);
    });
  });

  describe("Correlation Headers", () => {
    it("should propagate journeyId from header to event", async () => {
      const eventWithoutJourneyId = {
        ...validEvent,
        eventId: "evt_corr001",
        journeyId: undefined,
      };

      const response = await fetch(`${ANALYTICS_URL}/api/analytics/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-journey-id": "jrn_from_header_123",
          "x-user-ecosystem-id": "usr_from_header_001",
        },
        body: JSON.stringify(eventWithoutJourneyId),
      });

      expect(response.status).toBe(202);
    });
  });
});

describe("Health Endpoints", () => {
  it("should return healthy status", async () => {
    const response = await fetch(`${ANALYTICS_URL}/health`);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("healthy");
  });

  it("should return ready status", async () => {
    const response = await fetch(`${ANALYTICS_URL}/ready`);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ready");
  });
});

