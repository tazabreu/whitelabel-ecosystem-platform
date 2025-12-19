# Feature Specification: ACME Ecosystem MVP

**Feature Branch**: `001-acme-ecosystem-mvp`  
**Created**: 2025-12-19  
**Status**: Draft  
**Input**: User description: "Build the architecture in the attached print: a web dashboard experience with a backend-for-frontend, domain services (User, Credit Card, Analytics), end-to-end observability, and a whitelabel demo UI."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login + Whitelabel Dashboard (Priority: P1)

As a user, I can open the ACME Ecosystem web app, login with simple demo credentials, and land on
a mobile-optimized whitelabel dashboard.

**Why this priority**: No other workflow exists without authenticated entry + shell navigation.  
**Independent Test**: Login as `user:user` or `admin:admin` → see a blank dashboard with room for widgets.

**Acceptance Scenarios**:

1. **Given** I am logged out, **When** I login with `user:user`, **Then** I land on the whitelabel dashboard shell.
2. **Given** I am logged out, **When** I login with invalid credentials, **Then** I see an auth error and remain logged out.

---

### User Story 2 - Credit Card “Pre-approved” Offer + Onboarding (Priority: P1)

As a user, I see a credit-card widget (Airbnb landing page vibe) that tells me I have a pre-approved card,
and I can onboard by reviewing my limit and digitally signing.

**Why this priority**: It demonstrates the first product experience within the ecosystem dashboard.  
**Independent Test**: Enable feature flag `credit-cards.pre-approved-offers` → widget appears → onboarding completes.

**Acceptance Scenarios**:

1. **Given** I’m logged in and the flag is enabled, **When** I open the dashboard, **Then** I see a pre-approved offer widget.
2. **Given** I’m in onboarding, **When** I type the required “I agree” signature and submit, **Then** onboarding completes.
3. **Given** the flag is disabled, **When** I open the dashboard, **Then** the credit-card offer widget is hidden.

---

### User Story 3 - Post-onboarding Card View + Simulated Purchases (Priority: P2)

As an onboarded user, I see a modern “card” UI and I can simulate purchases until my limit is exceeded,
raise my limit, or reset the simulation state.

**Why this priority**: Demonstrates transactional flows + state transitions in the Credit Card domain.  
**Independent Test**: Onboard → simulate purchases → limit exceeded behavior is correct → raise limit → reset works.

**Acceptance Scenarios**:

1. **Given** I am onboarded, **When** I click “Simulate a purchase”, **Then** a purchase is recorded and remaining limit updates.
2. **Given** my remaining limit is insufficient, **When** I simulate a purchase, **Then** the purchase is rejected and UI explains why.
3. **Given** I click “Raise limit”, **When** the backend approves, **Then** my limit increases and I can purchase again.
4. **Given** I click “Reset”, **When** I confirm, **Then** my simulation state is reset to initial onboarded state.

---

### User Story 4 - Journey analytics + end-to-end traceability (Priority: P1)

As a platform operator, every navigation/major action is recorded through the backend-for-frontend into
the Analytics domain service, and I can trace a user journey end-to-end using a `journeyId`.

**Why this priority**: This is a core architectural requirement (observability + analytics as a first domain).  
**Independent Test**: Perform login + navigation + onboarding; verify analytics records show events linked by the same `journeyId`.

**Acceptance Scenarios**:

1. **Given** I navigate in the UI, **When** I click a nav item, **Then** an analytics event is recorded for that action.
2. **Given** I perform onboarding, **When** I submit “I agree”, **Then** all services log/trace the same `journeyId`.

### Edge Cases

- What happens when the Analytics service is down during navigation? (buffer vs best-effort)
- What happens when the feature flag service is unavailable? (fail closed vs cached defaults)
- What happens when a user retries onboarding submission? (idempotency / duplicate signature)
- What happens when the purchase simulator attempts a negative or zero amount?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a responsive web UI optimized for mobile (“vertical” layout).
- **FR-002**: System MUST support demo login credentials: `user:user` and `admin:admin`.
- **FR-003**: System MUST produce a “blank/whitelabel” dashboard after login.
- **FR-004**: System MUST implement the credit card widget + onboarding flow behind feature flag `credit-cards.pre-approved-offers`.
- **FR-005**: System MUST allow a user to “digitally sign” by typing a specific text (e.g., “I agree”).
- **FR-006**: System MUST show a pre-approved limit during onboarding.
- **FR-007**: System MUST present an onboarded-state card UI with actions: simulate purchase, raise limit, reset.
- **FR-008**: System MUST send navigation and major transactional actions to the backend analytics capability.
- **FR-009**: Analytics MUST store its own data independently from other domains.
- **FR-010**: System MUST generate/propagate a `journeyId` from frontend and preserve it across the chain.
- **FR-011**: System MUST assign users a stable `userEcosystemId` used across all products/domains.
- **FR-012**: System MUST support centralized observability in Splunk; ingestion key MUST be configured via secrets/env vars.
- **FR-013**: System MUST visually appear “whitelabel” (mostly white/light gray) while still being modern and polished.

### Non-Functional Requirements

- **NFR-001**: The system MUST support a consistent developer experience where local and cloud environments behave similarly.
- **NFR-002**: The system MUST enable tracing of a user journey end-to-end using `journeyId`.
- **NFR-003**: The system MUST allow controlled rollout of the credit-card offer via a feature flag.

### Key Entities *(include if feature involves data)*

- **User**: `userEcosystemId`, username, role, auth provider (demo now; Supabase later).
- **Journey**: `journeyId`, start/end timestamps, correlation to user, list of events.
- **AnalyticsEvent**: eventName, domain, entity, action, timestamp, metadata, `journeyId`, `userEcosystemId`.
- **CreditCardAccount**: limit, available, status (preapproved/onboarded), signature status, purchase history.

## Assumptions & Dependencies

- The system is a demo whitelabel ecosystem; branding is minimal by design.
- “Major transactional actions” include: onboarding submission, purchase simulation, raise limit, reset.
- Splunk ingestion will be configured later; MVP only needs configurable fields and clear documentation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can login and reach the dashboard in under 10 seconds under normal conditions.
- **SC-002**: For a complete onboarding + 3 actions, analytics shows ≥ 5 events linked by the same `journeyId`.
- **SC-003**: Feature flag disables the credit-card offer widget without redeploying.
- **SC-004**: End-to-end trace for a journey can be retrieved by `journeyId` in Splunk once configured.

## Future Work (explicitly out of scope for MVP)

- Supabase auth + access management (RLS in Postgres).
- Digital signing upgrade: liveness check + Docusign integration.
- Caching layer and alternate databases (e.g., MongoDB).
- Microbatch jobs for reporting and credit limit recalculation based on engagement.
- Streaming pipelines to build Customer 360 view (score/risk, tickets/complaints, next best offer, contact refresh).
- Loyalty domain.
- GraphRAG + customer-facing AI use case (with Debora Oliveira).

