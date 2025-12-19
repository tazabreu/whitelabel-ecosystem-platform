import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { saveAnalyticsEvent } from "../repositories/analyticsEventRepo.js";
import { publishEventToKafka } from "../kafka/producer.js";
import { createCorrelatedLogger } from "../logger.js";
import { nanoid } from "nanoid";

// Schema for analytics events
const analyticsEventSchema = z.object({
  eventId: z.string().optional(),
  eventName: z.string().min(1).max(100),
  domain: z.enum(["user", "credit-card", "analytics", "platform"]),
  entity: z.string().optional(),
  action: z.string().optional(),
  timestamp: z.string().datetime().optional(),
  journeyId: z.string().optional(),
  userEcosystemId: z.string().optional(),
  traceId: z.string().optional(),
  spanId: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

interface EventsRequest {
  Body: AnalyticsEvent;
  Headers: {
    "x-journey-id"?: string;
    "x-user-ecosystem-id"?: string;
  };
}

export async function eventsRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/analytics/events
   * Ingest a single analytics event
   */
  fastify.post<EventsRequest>(
    "/api/analytics/events",
    async (request: FastifyRequest<EventsRequest>, reply: FastifyReply) => {
      const correlatedLogger = createCorrelatedLogger({
        journeyId: request.headers["x-journey-id"],
        userEcosystemId: request.headers["x-user-ecosystem-id"],
      });

      try {
        const rawEvent = request.body;

        // Validate event
        const parseResult = analyticsEventSchema.safeParse(rawEvent);
        if (!parseResult.success) {
          correlatedLogger.warn(
            { errors: parseResult.error.errors },
            "Invalid analytics event"
          );
          return reply.status(400).send({
            status: "error",
            message: "Invalid event format",
            errors: parseResult.error.errors,
          });
        }

        // Enrich event with correlation context and defaults
        const event: AnalyticsEvent = {
          ...parseResult.data,
          eventId: parseResult.data.eventId || `evt_${nanoid(16)}`,
          timestamp: parseResult.data.timestamp || new Date().toISOString(),
          journeyId:
            parseResult.data.journeyId ||
            request.headers["x-journey-id"] ||
            `jrn_${nanoid(21)}`,
          userEcosystemId:
            parseResult.data.userEcosystemId ||
            request.headers["x-user-ecosystem-id"],
        };

        // Save to database (async, non-blocking)
        saveAnalyticsEvent(event).catch((err) => {
          correlatedLogger.error({ err }, "Failed to save analytics event");
        });

        // Publish to Kafka (async, non-blocking)
        publishEventToKafka(event).catch((err) => {
          correlatedLogger.error({ err }, "Failed to publish event to Kafka");
        });

        correlatedLogger.info(
          { eventId: event.eventId, eventName: event.eventName },
          "Analytics event accepted"
        );

        return reply.status(202).send({
          status: "accepted",
          eventId: event.eventId,
        });
      } catch (error) {
        correlatedLogger.error({ error }, "Error processing analytics event");
        return reply.status(500).send({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  );

  /**
   * POST /api/analytics/events/batch
   * Ingest multiple analytics events
   */
  fastify.post("/api/analytics/events/batch", async (request, reply) => {
    const body = request.body as { events?: AnalyticsEvent[] };

    if (!body.events || !Array.isArray(body.events)) {
      return reply.status(400).send({
        status: "error",
        message: "Expected { events: [...] }",
      });
    }

    const results = await Promise.allSettled(
      body.events.map(async (event) => {
        const enrichedEvent = {
          ...event,
          eventId: event.eventId || `evt_${nanoid(16)}`,
          timestamp: event.timestamp || new Date().toISOString(),
          journeyId:
            event.journeyId ||
            (request.headers["x-journey-id"] as string) ||
            `jrn_${nanoid(21)}`,
        };

        await saveAnalyticsEvent(enrichedEvent);
        await publishEventToKafka(enrichedEvent);
        return enrichedEvent.eventId;
      })
    );

    const accepted = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return reply.status(202).send({
      status: "accepted",
      accepted,
      failed,
      total: body.events.length,
    });
  });
}

