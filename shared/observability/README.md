# Observability Conventions

This document defines the observability standards for the ACME Ecosystem platform.

## Required Correlation Fields

All logs, traces, and events MUST include these fields when available:

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| `journeyId` | Unique identifier for a user session/journey | `jrn_<nanoid>` | `jrn_V1StGXR8_Z5jdHi6B-myT` |
| `userEcosystemId` | Stable user identifier across all products | `usr_<id>` | `usr_demo_user_001` |
| `traceId` | OpenTelemetry trace ID | W3C Trace Context | `4bf92f3577b34da6a3ce929d0e0e4736` |
| `spanId` | OpenTelemetry span ID | W3C Trace Context | `00f067aa0ba902b7` |

## Journey ID

The `journeyId` is generated at the frontend (web shell) when a user session begins:

1. Generated on first page load or login
2. Stored in session storage
3. Included in all API requests via `x-journey-id` header
4. Propagated through all service calls
5. Included in all analytics events

## User Ecosystem ID

The `userEcosystemId` is a stable identifier assigned when a user is created:

1. Generated during user creation/onboarding
2. Stored in the User service database
3. Returned on login/session creation
4. Included in all subsequent requests via `x-user-ecosystem-id` header
5. Used for cross-product analytics and personalization

## OpenTelemetry Integration

All services export telemetry via OTLP to the OpenTelemetry Collector:

- **Traces**: Distributed tracing for request flow
- **Metrics**: Service-level metrics (latency, errors, throughput)
- **Logs**: Structured JSON logs with correlation context

See:
- [headers.md](./headers.md) - HTTP header standards
- [otel.md](./otel.md) - OpenTelemetry configuration
- [java-logging.md](./java-logging.md) - Java logging configuration
- [ts-logging.md](./ts-logging.md) - TypeScript logging configuration

## Splunk Integration

When configured, telemetry flows to Splunk via the OTEL Collector:

```
Services → OTEL Collector → Splunk HEC
```

Environment variables:
- `SPLUNK_HEC_URL` - Splunk HEC endpoint
- `SPLUNK_HEC_TOKEN` - Splunk HEC token (secret)
- `SPLUNK_SOURCE` - Source identifier
- `SPLUNK_SOURCETYPE` - Source type (typically `_json`)
- `SPLUNK_INDEX` - Target index

