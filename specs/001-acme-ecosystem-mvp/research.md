# Research: ACME Ecosystem MVP

**Feature**: `001-acme-ecosystem-mvp`  
**Date**: 2025-12-19

This document records technical decisions and the rationale behind them.

## Decision: Observability is OpenTelemetry-first and vendor-neutral

**Decision**: Use OpenTelemetry across all services and the web shell, exporting via OTLP to an
OpenTelemetry Collector in local development and in production.

**Rationale**:
- OTLP + Collector gives us portability to Splunk, Datadog, Honeycomb, Dynatrace, and the LGTM stack.
- It keeps instrumentation consistent even when vendors change.

**Alternatives considered**:
- Vendor-specific SDKs/agents in each service (rejected: lock-in, inconsistent cross-service semantics).

## Decision: Logs are JSON and correlate by `journeyId` + `userEcosystemId`

**Decision**: Every service logs structured JSON and includes correlation fields:
- `journeyId`
- `userEcosystemId`
- `service.name`, `service.version`, `deployment.environment`
- request identifiers (where applicable): `traceId`, `spanId`, `requestId`

**Rationale**:
- JSON logs are parseable and consistent across Splunk and other platforms.
- Correlation fields make debugging and alerting tractable.

**Alternatives considered**:
- Human-only logs (rejected: poor searchability and correlation).

## Decision: Service language split (capability parity)

**Decision**:
- `domains/user`: Java (latest LTS) + Spring Boot (latest stable)
- `domains/credit-card`: Java (latest LTS) + Spring Boot (latest stable)
- `domains/analytics`: TypeScript (strict)
- `domains/web-bff`: Java (latest LTS) + Spring Boot (latest stable)

**Rationale**:
- Meets requirement: at least one TypeScript service (Analytics).
- Keeps Java services “equally capable” with consistent JSON logging and OpenTelemetry.

**Alternatives considered**:
- Put BFF in Node/TS (possible later; for MVP keep BFF consistent with Java stack).

## Decision: Kafka/Event mesh uses Redpanda locally

**Decision**: Use Redpanda as the local Kafka-compatible event mesh.

**Rationale**:
- Excellent local dev ergonomics and parity with Kafka semantics.
- Aligns to constitution requirement.

## Decision: Topic naming conventions

**Decision**: Use stable, explicit topic naming:

```text
ecosystem.{env}.{domain}.{entity}.{event}
```

Examples:
- `ecosystem.local.credit-card.application.submitted`
- `ecosystem.local.analytics.navigation.recorded`

**Rationale**:
- Easy to filter by environment and domain.
- Maps closely to event names (`com.ecosystem.{domain}.{entity}.{action}`) while staying Kafka-topic friendly.

**Alternatives considered**:
- Fewer segments (rejected: hard to filter at scale).

## Decision: Event schema strategy

**Decision**: Standard envelope + domain payloads:

- Envelope fields: `eventName`, `eventId`, `occurredAt`, `journeyId`, `userEcosystemId`, `schemaVersion`
- Payload: domain-specific data

**Rationale**:
- Enables consistent analytics and Lakehouse ingestion.
- Supports schema evolution.

## Decision: Customer 360 lakehouse/mesh implementation (local-first, BigQuery-ready)

**Decision**:
- Local: DuckDB + parquet datasets + dbt transformations to build `customer_360` views/tables.
- Cloud target later: BigQuery with dbt BigQuery adapter (same transformations, different adapter).

**Rationale**:
- DuckDB is excellent for local analytics and can query parquet efficiently.
- dbt gives “warehouse-style” semantics and portability to BigQuery-like systems.

**Alternatives considered**:
- Iceberg + Trino + MinIO (rejected for MVP: too much operational surface area).

## Decision: Frontend stack

**Decision**: Use React + Next.js (current stable) with shadcn/ui and a dev-only “design system” route/page.

**Rationale**:
- Fast developer iteration and great DX.
- Straightforward SSR/CSR choices and routing.

**Alternatives considered**:
- Vite SPA (possible; Next is chosen as the default for ecosystem shell needs).


