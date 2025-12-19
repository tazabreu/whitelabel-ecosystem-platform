---

description: "Task list for ACME Ecosystem MVP implementation"
---

# Tasks: ACME Ecosystem MVP

**Input**: Design documents from `/specs/001-acme-ecosystem-mvp/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

**Tests**: Included (requested: “things should be testable”; plan includes unit/component + E2E smoke + service tests).  

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Ecosystem platform: `platform/shells/{name}/`, `domains/{name}/`, `shared/{category}/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create ecosystem directory structure per plan in `platform/shells/web/`, `domains/*/`, `shared/*/`
- [x] T002 Add root `.gitignore` at `.gitignore` (Node, Java, dbt, DuckDB, env files)
- [x] T003 Add env template at `.env.example` (Splunk, OTEL, DB URLs, Redpanda brokers, feature flags)
- [x] T004 Add local bring-up compose file at `docker-compose.yml` (redpanda + 3 postgres + otel-collector)
- [x] T005 Add OpenTelemetry Collector config at `shared/observability/otel-collector-config.yaml`
- [x] T006 [P] Initialize web shell project at `platform/shells/web/` (Next.js + TypeScript)
- [x] T007 [P] Initialize Java Spring Boot service at `domains/web-bff/` (Gradle, actuator, health)
- [x] T008 [P] Initialize Java Spring Boot service at `domains/user/` (Gradle, actuator, health)
- [x] T009 [P] Initialize Java Spring Boot service at `domains/credit-card/` (Gradle, actuator, health)
- [x] T010 [P] Initialize TypeScript service at `domains/analytics/` (strict TS, minimal HTTP server)
- [x] T011 [P] Initialize lakehouse project at `domains/data-lakehouse/` (dbt project + DuckDB profile + seeds folder)
- [x] T012 Add basic repo docs at `README.md` pointing to `specs/001-acme-ecosystem-mvp/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Add shared observability conventions doc at `shared/observability/README.md` (required fields: `journeyId`, `userEcosystemId`, `traceId`, `spanId`)
- [x] T014 Implement `journeyId` generation + propagation in web shell at `platform/shells/web/src/lib/journey.ts`
- [x] T015 Implement request correlation headers standard at `shared/observability/headers.md` (e.g., `x-journey-id`, `x-user-ecosystem-id`)
- [x] T016 Implement JSON logging defaults for Java services at `shared/observability/java-logging.md` (logback JSON layout config reference)
- [x] T017 Implement JSON logging defaults for TypeScript services at `shared/observability/ts-logging.md` (pino JSON fields reference)
- [x] T018 Implement OpenTelemetry instrumentation guidance at `shared/observability/otel.md` (OTLP exporter env vars; vendor-neutral)
- [x] T019 Add service-level OTel bootstrap for Java services in:
  - `domains/web-bff/src/main/java/com/ecosystem/webbff/observability/ObservabilityConfig.java`
  - `domains/user/src/main/java/com/ecosystem/user/observability/ObservabilityConfig.java`
  - `domains/credit-card/src/main/java/com/ecosystem/creditcard/observability/ObservabilityConfig.java`
- [x] T020 Add service-level OTel bootstrap for TS analytics at `domains/analytics/src/observability.ts`
- [x] T021 Implement feature flag provider interface at `shared/feature-flags/FeatureFlags.ts` (get(flagName): boolean)
- [x] T022 Implement env-based feature flag provider at `shared/feature-flags/EnvFeatureFlags.ts` (supports `credit-cards.pre-approved-offers`)
- [x] T023 Implement Web BFF middleware to enforce/propagate correlation headers at `domains/web-bff/src/main/java/com/ecosystem/webbff/observability/CorrelationFilter.java`
- [x] T024 Implement Web BFF auth token propagation contract at `domains/web-bff/src/main/java/com/ecosystem/webbff/auth/AuthFilter.java` (demo token for MVP)
- [x] T025 Implement Redpanda topic creation script at `scripts/redpanda/create-topics.sh` (names per `research.md`)
- [x] T026 Implement analytics event envelope schema as a shared contract at `shared/contracts/events.analytics-event.schema.json` (copy from `specs/001-acme-ecosystem-mvp/contracts/events.analytics-event.schema.json`)
- [x] T027 Implement Web BFF client to Analytics service at `domains/web-bff/src/main/java/com/ecosystem/webbff/analytics/AnalyticsClient.java` (POST `/api/analytics/events`)
- [x] T028 Add Postgres schema/migrations skeleton for each service:
  - `domains/user/db/migrations/`
  - `domains/credit-card/db/migrations/`
  - `domains/analytics/db/migrations/`
- [x] T029 Add health/readiness endpoints for each service (actuator for Java; `/health` for TS) in:
  - `domains/web-bff/src/main/java/com/ecosystem/webbff/health/HealthController.java`
  - `domains/user/src/main/java/com/ecosystem/user/health/HealthController.java`
  - `domains/credit-card/src/main/java/com/ecosystem/creditcard/health/HealthController.java`
  - `domains/analytics/src/server.ts`

**Checkpoint**: Foundation ready — web shell can call BFF, BFF can call domains, correlation headers exist, analytics ingestion exists, and local deps can start.

---

## Phase 3: User Story 1 - Login + Whitelabel Dashboard (Priority: P1) 🎯 MVP

**Goal**: User can login with demo credentials and reach a mobile-first whitelabel dashboard.

**Independent Test**:

- Start deps + services + web
- Login as `user:user` or `admin:admin`
- See dashboard shell and session state

### Tests for User Story 1 ⚠️

- [x] T030 [P] [US1] Add web smoke test for login flow at `platform/shells/web/tests/e2e/login.spec.ts`
- [x] T031 [P] [US1] Add BFF API contract test validating `specs/001-acme-ecosystem-mvp/contracts/web-bff.openapi.json` at `domains/web-bff/src/test/java/com/ecosystem/webbff/contract/OpenApiContractTest.java`

### Implementation for User Story 1

- [x] T032 [US1] Implement demo login endpoint in Web BFF at `domains/web-bff/src/main/java/com/ecosystem/webbff/user/UserSessionController.java` (`POST /api/user/session/login`)
- [x] T033 [US1] Implement demo auth validation in User service at `domains/user/src/main/java/com/ecosystem/user/auth/DemoAuthService.java`
- [x] T034 [US1] Implement user session token issuance (demo) in Web BFF at `domains/web-bff/src/main/java/com/ecosystem/webbff/auth/TokenService.java`
- [x] T035 [US1] Implement login UI at `platform/shells/web/src/app/login/page.tsx` (mobile-first)
- [x] T036 [US1] Implement session storage + route protection at `platform/shells/web/src/middleware.ts`
- [x] T037 [US1] Implement dashboard shell page at `platform/shells/web/src/app/page.tsx` (whitelabel blank state)
- [x] T038 [US1] Emit analytics event "logged_in" via Web BFF at `domains/web-bff/src/main/java/com/ecosystem/webbff/analytics/AnalyticsEmitter.java`

**Checkpoint**: Login works; dashboard loads; basic analytics event emitted for login.

---

## Phase 4: User Story 4 - Journey analytics + end-to-end traceability (Priority: P1)

**Goal**: Navigation and major actions create analytics events persisted by Analytics service with consistent `journeyId`.

**Independent Test**:

- Perform login + click a navigation item + start onboarding
- Verify Analytics DB contains multiple events with same `journeyId`

### Tests for User Story 4

- [x] T039 [P] [US4] Add integration test for analytics ingestion at `domains/analytics/tests/integration/ingestion.spec.ts`
- [x] T040 [P] [US4] Add integration test verifying correlation headers propagation at `domains/web-bff/src/test/java/com/ecosystem/webbff/observability/CorrelationPropagationTest.java`

### Implementation for User Story 4

- [x] T041 [US4] Implement analytics ingestion endpoint in Analytics service at `domains/analytics/src/routes/events.ts` (`POST /api/analytics/events`)
- [x] T042 [US4] Persist analytics events in Analytics DB at `domains/analytics/src/repositories/analyticsEventRepo.ts`
- [x] T043 [US4] Implement navigation event emitter in web shell at `platform/shells/web/src/lib/analytics.ts` (calls BFF)
- [x] T044 [US4] Emit analytics on route changes at `platform/shells/web/src/app/providers.tsx`
- [x] T045 [US4] Implement Web BFF endpoint passthrough to Analytics at `domains/web-bff/src/main/java/com/ecosystem/webbff/analytics/AnalyticsController.java`
- [x] T046 [US4] Publish analytics events to Redpanda topic `ecosystem.{env}.analytics.event.recorded` in Analytics service at `domains/analytics/src/kafka/producer.ts`

**Checkpoint**: Analytics events are recorded and traceable by `journeyId`.

---

## Phase 5: User Story 2 - Credit Card “Pre-approved” Offer + Onboarding (Priority: P1)

**Goal**: Feature-flagged credit-card widget appears; onboarding shows limit; user signs “I agree” to onboard.

**Independent Test**:

- Set `credit-cards.pre-approved-offers=true`
- Open dashboard → see offer widget → complete onboarding → see onboarded state

### Tests for User Story 2

- [x] T047 [P] [US2] Add web E2E test for offer + onboarding at `platform/shells/web/tests/e2e/credit-card-onboarding.spec.ts`
- [x] T048 [P] [US2] Add Credit Card service integration test for onboarding signature at `domains/credit-card/src/test/java/com/ecosystem/creditcard/onboarding/OnboardingFlowTest.java`

### Implementation for User Story 2

- [x] T049 [US2] Implement feature flag evaluation in web shell at `platform/shells/web/src/lib/featureFlags.ts` (uses `shared/feature-flags/*`)
- [x] T050 [US2] Implement credit-card offer widget UI at `platform/shells/web/src/components/credit-card/PreapprovedOfferWidget.tsx`
- [x] T051 [US2] Implement BFF endpoint `GET /api/credit-card/offer` at `domains/web-bff/src/main/java/com/ecosystem/webbff/creditcard/CreditCardOfferController.java`
- [x] T052 [US2] Implement Credit Card domain offer logic at `domains/credit-card/src/main/java/com/ecosystem/creditcard/offer/OfferService.java` (returns preapproved limit)
- [x] T053 [US2] Implement BFF endpoint `POST /api/credit-card/onboarding/sign` at `domains/web-bff/src/main/java/com/ecosystem/webbff/creditcard/CreditCardOnboardingController.java`
- [x] T054 [US2] Implement signature validation ("I agree") at `domains/credit-card/src/main/java/com/ecosystem/creditcard/onboarding/SignatureValidator.java`
- [x] T055 [US2] Persist onboarding status + signature in Credit Card DB at `domains/credit-card/src/main/java/com/ecosystem/creditcard/repo/CreditCardRepository.java`
- [x] T056 [US2] Emit analytics event "offer_viewed" and "onboarding_signed" from Web BFF at `domains/web-bff/src/main/java/com/ecosystem/webbff/analytics/AnalyticsEmitter.java`

**Checkpoint**: Offer is feature-flagged, onboarding completes, analytics events are captured with `journeyId`.

---

## Phase 6: User Story 3 - Post-onboarding Card View + Simulated Purchases (Priority: P2)

**Goal**: Onboarded users see a modern card UI and can simulate purchases, raise limit, and reset.

**Independent Test**:

- Onboard user
- Simulate purchases until limit exceeded
- Raise limit and purchase again
- Reset state

### Tests for User Story 3

- [x] T057 [P] [US3] Add web E2E test for purchase simulation at `platform/shells/web/tests/e2e/credit-card-simulate-purchase.spec.ts`
- [x] T058 [P] [US3] Add Credit Card service integration test for purchase + limit logic at `domains/credit-card/src/test/java/com/ecosystem/creditcard/purchase/PurchaseSimulationTest.java`

### Implementation for User Story 3

- [x] T059 [US3] Implement onboarded card UI at `platform/shells/web/src/components/credit-card/CreditCardView.tsx`
- [x] T060 [US3] Implement BFF endpoint `POST /api/credit-card/actions/simulate-purchase` at `domains/web-bff/src/main/java/com/ecosystem/webbff/creditcard/CreditCardActionsController.java`
- [x] T061 [US3] Implement purchase simulation logic at `domains/credit-card/src/main/java/com/ecosystem/creditcard/purchase/PurchaseSimulator.java`
- [x] T062 [US3] Implement BFF endpoint `POST /api/credit-card/actions/raise-limit` at `domains/web-bff/src/main/java/com/ecosystem/webbff/creditcard/CreditCardActionsController.java`
- [x] T063 [US3] Implement raise limit policy at `domains/credit-card/src/main/java/com/ecosystem/creditcard/limit/LimitPolicyService.java`
- [x] T064 [US3] Implement BFF endpoint `POST /api/credit-card/actions/reset` at `domains/web-bff/src/main/java/com/ecosystem/webbff/creditcard/CreditCardActionsController.java`
- [x] T065 [US3] Implement reset behavior at `domains/credit-card/src/main/java/com/ecosystem/creditcard/reset/ResetService.java`
- [x] T066 [US3] Emit analytics events for simulate/raise/reset at `domains/web-bff/src/main/java/com/ecosystem/webbff/analytics/AnalyticsEmitter.java`

**Checkpoint**: Simulated purchases enforce limits; raise/reset work; UI updates correctly; analytics events recorded.

---

## Phase 7: Data Lakehouse / Mesh - Customer 360 (MVP slice)

**Purpose**: Produce a local-first Customer 360 curated view using dbt + DuckDB, with a clear path to BigQuery.

- [x] T067 Create dbt project structure at `domains/data-lakehouse/dbt_project.yml` and `domains/data-lakehouse/models/`
- [x] T068 Define sources for analytics + domain exports at `domains/data-lakehouse/models/sources.yml`
- [x] T069 Implement `customer_360` model at `domains/data-lakehouse/models/customer_360.sql`
- [x] T070 Add seed/sample data for local runs at `domains/data-lakehouse/seeds/sample_events.csv`
- [x] T071 Add local DuckDB profile at `domains/data-lakehouse/profiles.yml` (DuckDB file path under `domains/data-lakehouse/warehouse/`)
- [x] T072 Add a run script at `domains/data-lakehouse/scripts/run-local.sh` to execute dbt and query `customer_360`
- [x] T073 Document BigQuery migration path at `domains/data-lakehouse/README.md` (adapter swap + dataset mapping)

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Quality, DX, and operability improvements across the ecosystem

- [x] T074 [P] Add dev-only "design system" route at `platform/shells/web/src/app/dev/design-system/page.tsx` (shadcn showcase)
- [x] T075 Add centralized error handling + consistent error response shape in Web BFF at `domains/web-bff/src/main/java/com/ecosystem/webbff/error/ErrorHandler.java`
- [x] T076 Add rate limiting/backpressure strategy for analytics ingestion (best-effort with buffering) at `domains/web-bff/src/main/java/com/ecosystem/webbff/analytics/AnalyticsClient.java`
- [x] T077 Add documentation for feature flags at `shared/feature-flags/README.md` (naming, ownership, retirement)
- [x] T078 Add `make` (or script) shortcuts for local bring-up at `scripts/dev/up.sh` and `scripts/dev/down.sh`
- [x] T079 Run and validate `specs/001-acme-ecosystem-mvp/quickstart.md` steps end-to-end and fix gaps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
  - US1 and US4 are both P1; US4 should be completed early to validate observability.
- **Lakehouse (Phase 7)**: Depends on Analytics events being produced (Phase 4)

### User Story Dependencies

- **US1 (P1)**: Requires demo auth + shell scaffolding
- **US4 (P1)**: Requires correlation headers + analytics ingestion + event emission
- **US2 (P1)**: Requires feature flags + credit-card offer/onboarding endpoints
- **US3 (P2)**: Requires onboarding completion and credit-card account state

### Parallel Opportunities

- Setup scaffolding across components can run in parallel: T006–T011
- Foundational observability docs/config can run in parallel: T013–T020
- Per-story E2E tests and service tests can run in parallel (different files): T030–T031, T039–T040, T047–T048, T057–T058

---

## Parallel Example: US1

```text
In parallel:
- T030 [US1] Web E2E login test in platform/shells/web/tests/e2e/login.spec.ts
- T031 [US1] BFF OpenAPI contract test in domains/web-bff/src/test/java/com/ecosystem/webbff/contract/OpenApiContractTest.java
```

---

## Implementation Strategy

### MVP First (US1 + US4 observability slice)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (login + dashboard shell)
4. Complete Phase 4: US4 (analytics + journey traceability)
5. Stop and validate end-to-end: login → navigate → event recorded with `journeyId`

### Incremental Delivery

1. Add US2 (flagged credit-card offer + onboarding)
2. Add US3 (post-onboarding card + purchases)
3. Add Phase 7 (Customer 360 lakehouse view)
