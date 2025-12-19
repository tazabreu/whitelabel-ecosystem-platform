# Quickstart: ACME Ecosystem MVP (Local)

**Feature**: `001-acme-ecosystem-mvp`  
**Date**: 2025-12-19

This quickstart describes the intended local bring-up for the ecosystem platform.
Implementation will follow this contract.

## Prerequisites

- Docker Desktop
- Node (LTS)
- Java (latest LTS)

## Local bring-up goals

- One command starts the core dependencies (datastores, event mesh, observability collector).
- Services can be started locally (or containerized) and talk to the shared dependencies.

## Default local endpoints (planned)

- Web shell: `http://localhost:3000`
- Web BFF: `http://localhost:8080`
- User service: `http://localhost:8081`
- Credit Card service: `http://localhost:8082`
- Analytics service: `http://localhost:8090`
- Redpanda: `localhost:9092`
- OpenTelemetry Collector: `http://localhost:4317` (OTLP gRPC), `http://localhost:4318` (OTLP HTTP)

## Demo credentials (MVP)

- `user:user`
- `admin:admin`

## Observability configuration

All components MUST support vendor-neutral OpenTelemetry exporting via OTLP env vars.

Recommended env var set:

- `OTEL_SERVICE_NAME`
- `OTEL_RESOURCE_ATTRIBUTES` (include `deployment.environment`, `service.version`)
- `OTEL_EXPORTER_OTLP_ENDPOINT` (points to the collector)

Splunk HEC (configured later):

- `SPLUNK_HEC_URL`
- `SPLUNK_HEC_TOKEN` (secret)
- `SPLUNK_SOURCE` (optional)
- `SPLUNK_SOURCETYPE` (optional)
- `SPLUNK_INDEX` (optional)

## Feature flags

- `credit-cards.pre-approved-offers` is the primary MVP flag controlling the credit-card widget behavior.

## Developer-only design system view

The web shell SHOULD include a dev-only route (non-production) that renders key shadcn/ui primitives
and the whitelabel theme tokens for quick visual verification.


