# OpenTelemetry Configuration

Vendor-neutral observability using OpenTelemetry (OTEL) across all services.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Web Shell   │     │ Java Service │     │  TS Service  │
│  (Browser)   │     │ (Spring Boot)│     │  (Node.js)   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ OTLP/HTTP          │ OTLP/HTTP          │ OTLP/HTTP
       │                    │                    │
       └────────────────────┼────────────────────┘
                            ▼
                  ┌──────────────────┐
                  │  OTEL Collector  │
                  │    (local)       │
                  └────────┬─────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌──────────┐      ┌──────────┐
    │ Console │      │Prometheus│      │  Splunk  │
    │ (debug) │      │ (metrics)│      │  (prod)  │
    └─────────┘      └──────────┘      └──────────┘
```

## Environment Variables

All services read these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector endpoint | `http://localhost:4318` |
| `OTEL_SERVICE_NAME` | Service name for traces | (service-specific) |
| `OTEL_RESOURCE_ATTRIBUTES` | Additional resource attributes | `deployment.environment=local` |
| `OTEL_TRACES_EXPORTER` | Trace exporter type | `otlp` |
| `OTEL_METRICS_EXPORTER` | Metrics exporter type | `otlp` |
| `OTEL_LOGS_EXPORTER` | Logs exporter type | `otlp` |

## Java (Spring Boot)

Add to `application.yml`:

```yaml
otel:
  exporter:
    otlp:
      endpoint: ${OTEL_EXPORTER_OTLP_ENDPOINT:http://localhost:4318}
  resource:
    attributes:
      service.name: ${spring.application.name}
      deployment.environment: ${DEPLOYMENT_ENVIRONMENT:local}
```

Dependencies in `build.gradle.kts`:

```kotlin
implementation("io.opentelemetry:opentelemetry-api:1.44.1")
implementation("io.opentelemetry:opentelemetry-sdk:1.44.1")
implementation("io.opentelemetry:opentelemetry-exporter-otlp:1.44.1")
implementation("io.opentelemetry.instrumentation:opentelemetry-spring-boot-starter:2.10.0")
```

## TypeScript (Node.js)

Initialize in entry point:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/traces',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/metrics',
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

## Correlation Context

Ensure all services propagate W3C Trace Context headers:

- `traceparent`: Trace ID and span ID
- `tracestate`: Vendor-specific trace data

Custom correlation fields (`journeyId`, `userEcosystemId`) are propagated via:

1. Custom HTTP headers (see [headers.md](./headers.md))
2. Span attributes
3. Log MDC/context

## Local Development

The OTEL Collector runs in Docker Compose and exports to:

1. **Console** (debug) - See all telemetry in collector logs
2. **Prometheus** (metrics) - Scrape at `http://localhost:8889/metrics`

For production, configure Splunk exporter in the collector config.

