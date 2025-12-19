# TypeScript Logging Configuration

Structured JSON logging for TypeScript/Node.js services using Pino.

## Pino Configuration

```typescript
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  
  // Pretty print for local, JSON for production
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
  
  // Base fields included in every log
  base: {
    service: process.env.OTEL_SERVICE_NAME || "unknown-service",
    env: process.env.DEPLOYMENT_ENVIRONMENT || "local",
  },
  
  // Redact sensitive fields
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "password",
    "token",
  ],
});
```

## Child Loggers with Correlation

Create child loggers with correlation context:

```typescript
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

// Usage
const correlatedLogger = createCorrelatedLogger({
  journeyId: request.headers['x-journey-id'],
  userEcosystemId: request.headers['x-user-ecosystem-id'],
});

correlatedLogger.info({ action: 'user_login' }, 'User login successful');
```

## Fastify Integration

```typescript
import Fastify from "fastify";
import { logger } from "./logger.js";

const app = Fastify({
  logger: logger,
});

// Add correlation context to request logger
app.addHook('preHandler', async (request) => {
  const journeyId = request.headers['x-journey-id'] as string | undefined;
  const userEcosystemId = request.headers['x-user-ecosystem-id'] as string | undefined;
  
  // Create child logger with correlation context
  request.log = request.log.child({ journeyId, userEcosystemId });
});
```

## Dependencies

```json
{
  "dependencies": {
    "pino": "^9.5.0",
    "pino-pretty": "^13.0.0"
  }
}
```

## Example Log Output

### JSON (Production)

```json
{
  "level": 30,
  "time": 1734607845123,
  "service": "analytics-service",
  "env": "production",
  "journeyId": "jrn_V1StGXR8_Z5jdHi6B-myT",
  "userEcosystemId": "usr_demo_user_001",
  "msg": "Analytics event recorded",
  "eventName": "logged_in"
}
```

### Pretty Print (Local)

```
10:30:45 INFO (analytics-service): Analytics event recorded
    journeyId: "jrn_V1StGXR8_Z5jdHi6B-myT"
    userEcosystemId: "usr_demo_user_001"
    eventName: "logged_in"
```

## Best Practices

1. **Use child loggers** - Create context-specific loggers
2. **Log objects, not strings** - `logger.info({ userId }, 'User created')` not `logger.info('User created: ' + userId)`
3. **Consistent field names** - Use camelCase, match MDC names from Java
4. **Redact sensitive data** - Configure redaction for auth tokens, passwords
5. **Appropriate levels**:
   - `fatal`: Application crash
   - `error`: Unexpected errors
   - `warn`: Recoverable issues
   - `info`: Significant events
   - `debug`: Diagnostic details
   - `trace`: Very detailed tracing

