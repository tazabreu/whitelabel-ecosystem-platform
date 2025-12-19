import Fastify from "fastify";
import cors from "@fastify/cors";
import { logger } from "./logger.js";
import { eventsRoutes } from "./routes/events.js";
import { closePool } from "./repositories/analyticsEventRepo.js";
import { disconnectProducer } from "./kafka/producer.js";

const PORT = parseInt(process.env.ANALYTICS_PORT || "8090", 10);
const HOST = process.env.ANALYTICS_HOST || "0.0.0.0";

const app = Fastify({
  logger: logger,
});

// Register CORS
await app.register(cors, {
  origin: true,
});

// Health check endpoint
app.get("/health", async () => {
  return {
    status: "healthy",
    service: "analytics-service",
    timestamp: new Date().toISOString(),
  };
});

// Readiness check endpoint
app.get("/ready", async () => {
  // TODO: Add DB and Kafka connectivity checks
  return {
    status: "ready",
    service: "analytics-service",
    timestamp: new Date().toISOString(),
  };
});

// Register analytics event routes
await app.register(eventsRoutes);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, "Received shutdown signal");
  
  try {
    await app.close();
    await closePool();
    await disconnectProducer();
    logger.info("Graceful shutdown complete");
    process.exit(0);
  } catch (error) {
    logger.error({ error }, "Error during shutdown");
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start server
try {
  await app.listen({ port: PORT, host: HOST });
  logger.info(`Analytics service listening on ${HOST}:${PORT}`);
} catch (err) {
  logger.error(err);
  process.exit(1);
}

export { app };

