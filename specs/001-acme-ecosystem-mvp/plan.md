# Implementation Plan: ACME Ecosystem MVP

**Branch**: `001-acme-ecosystem-mvp` | **Date**: 2025-12-19 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/001-acme-ecosystem-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Deliver a whitelabel “ACME Ecosystem” web dashboard with demo auth, a credit-card pre-approved offer
and onboarding, plus post-onboarding card actions. All navigation and major actions emit analytics events
that are traceable end-to-end via `journeyId` and correlated by `userEcosystemId`.

Architecture matches the reference diagram: Web (shell) → Web BFF → domain services (User, Credit Card,
Analytics) + integration layer (Redpanda) + data lakehouse/mesh (Customer 360) + external services
(Splunk observability).

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Multi-language (Java + TypeScript)

**Languages/Versions (by component)**:
- **Web shell**: TypeScript (Node LTS), React, Next.js (current stable), shadcn/ui
- **Web BFF**: Java (latest LTS) + Spring Boot (latest stable)
- **User domain**: Java (latest LTS) + Spring Boot (latest stable)
- **Credit Card domain**: Java (latest LTS) + Spring Boot (latest stable)
- **Analytics domain**: TypeScript (strict) service
- **Data lakehouse/mesh**: dbt + DuckDB (local) with a clear migration path to BigQuery (adapter swap)

**Primary Dependencies** (by capability):
- **Observability**: OpenTelemetry SDKs + OTLP export everywhere (vendor-neutral); local OpenTelemetry Collector
- **Kafka/Event mesh**: Redpanda (local) + schema discipline for events
- **UI**: shadcn/ui + Tailwind (via Next.js) with a dev-only “design system” route/page

**Storage**:
- User DB: Postgres (service-owned)
- Credit Card DB: Postgres (service-owned)
- Analytics DB: Postgres (service-owned)
- Lakehouse: DuckDB file + parquet datasets (local); BigQuery target later

**Testing**:
- Web: unit/component tests + basic E2E smoke tests
- Services: unit + contract tests (OpenAPI) + integration tests (DB + Redpanda via containers)

**Target Platform**: Dockerized local development; production is serverless-first (no Kubernetes).
**Project Type**: ecosystem platform (web shell + BFF + multiple domain services).
**Performance Goals**: “feels instant” UX for main flows; prioritize correctness + observability over raw throughput.
**Constraints**: JSON-parseable logs, OpenTelemetry everywhere, strong local/cloud parity.
**Scale/Scope**: MVP for demo + future expansion (Customer 360, loyalty, AI use cases).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Use `.specify/memory/constitution.md` as the source of truth. At minimum, confirm:

- **KISS + Clean Code**: The plan avoids over-engineering; complexity is explicitly justified if present.
- **DDD + Clean Architecture**: Domain boundaries are explicit; dependencies flow inward; contracts are defined.
- **Microfrontends + Shell**: Shell ownership and microfrontend ownership are explicit.
- **Trunk-based + Feature flags**: Rollout is controlled by flags; merges are small and frequent.
- **Parity**: Local vs cloud behavior is aligned (configs, dependencies, runtime assumptions).
- **Observability**: The plan includes a journey correlation strategy (`journeyId`) and telemetry integration.

## Project Structure

### Documentation (this feature)

```text
specs/001-acme-ecosystem-mvp/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
platform/
└── shells/
    └── web/                      # Primary web shell (routing, auth, shared UX, design system)

domains/
├── web-bff/                      # Backend-for-frontend (aggregates domain APIs for the web shell)
├── user/                         # User domain service (demo auth now; Supabase later)
├── credit-card/                  # Credit card domain service
├── analytics/                    # Analytics domain service (TypeScript)
└── data-lakehouse/               # Customer 360 transformations and query interface (local-first)

shared/
├── ui/                           # Shared UI primitives / design system building blocks
└── observability/                # Shared tracing/logging helpers + conventions

docs/
scripts/
```

**Structure Decision**: Use the ecosystem platform layout (shell + BFF + domains + shared).

## Phase 0: Research Outputs (Decisions)

See `research.md` for decisions and rationales, including:
- Observability: OpenTelemetry-first + vendor-neutral OTLP exporting + Splunk compatibility
- Logging: JSON logs across Java and TypeScript services, consistent correlation fields
- Redpanda topic naming + event naming conventions
- Customer 360 lakehouse: dbt + DuckDB local, BigQuery-ready model structure

## Phase 1: Design Outputs

- `data-model.md`: domain entities + state transitions (credit card onboarding and purchases),
  analytics event model, journey model, customer360 model.
- `contracts/`: OpenAPI for Web BFF and domain services, plus event schemas for Redpanda.
- `quickstart.md`: local bring-up (Docker Compose) and dev workflow.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multiple services + lakehouse | Required to match target ecosystem architecture and enable end-to-end journey observability | Single monolith would not demonstrate domain isolation, BFF pattern, or analytics pipeline |
