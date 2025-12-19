import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
  base: {
    service: "analytics-service",
    env: process.env.DEPLOYMENT_ENVIRONMENT || "local",
  },
  // Redact sensitive fields
  redact: ["req.headers.authorization", "req.headers.cookie"],
});

/**
 * Create a child logger with correlation context
 */
export function createCorrelatedLogger(context: {
  journeyId?: string;
  userEcosystemId?: string;
  traceId?: string;
  spanId?: string;
}) {
  return logger.child({
    journeyId: context.journeyId,
    userEcosystemId: context.userEcosystemId,
    traceId: context.traceId,
    spanId: context.spanId,
  });
}

