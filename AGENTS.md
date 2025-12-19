# Whitelabel Ecosystem Platform — Agent Defaults

These are default rules for any agent working in this repository. If a spec/plan conflicts with this file,
the constitution (`.specify/memory/constitution.md`) wins.

## Non-negotiables

- Follow **KISS** and **Clean Code**. Prefer the simplest solution that meets requirements.
- Respect **DDD + Clean Architecture** boundaries (domain/application are framework-agnostic).
- Use **trunk-based** development. Keep branches short-lived and merges frequent.
- Use **feature flags aggressively** for rollout and incomplete work.
- Maintain **high parity** between local and cloud environments.

## Architecture defaults (ecosystem)

- **Shell ownership**: Platform team owns the web shell under `platform/shells/web/`.
- **Product ownership**: Product teams own their domain(s) under `domains/{name}/`.
- **Shared**: Shared resources go in `shared/{category}/` (e.g., `shared/ui/`, `shared/observability/`).
- **API conventions**:
  - REST: `/api/{domain}/{resource}`
  - GraphQL: `/graphql/{domain}`
- **Events**: `com.ecosystem.{domain}.{entity}.{action}`

## Observability defaults

- Every navigation action and major transactional action MUST emit an analytics event.
- A **`journeyId`** MUST be generated at the entry point (frontend) and propagated end-to-end.
- A stable **`userEcosystemId`** MUST be used to correlate activity across products.

### Splunk

- All components MUST read Splunk config from env vars (no hardcoding).
- Reserve these env vars (names can be refined later, but keep consistent):
  - `SPLUNK_HEC_URL`
  - `SPLUNK_HEC_TOKEN` (secret)
  - `SPLUNK_SOURCE` (optional)
  - `SPLUNK_SOURCETYPE` (optional)
  - `SPLUNK_INDEX` (optional)

## Feature flags

- Flags MUST be named with a stable, dot-delimited convention (e.g., `credit-cards.pre-approved-offers`).
- Flags SHOULD default to off for incomplete or risky features.
- Every flag MUST have an owner and a retirement plan.

## Local vs Cloud parity

- Everything MUST be runnable locally with a single bring-up path (containerized).
- Avoid assumptions that only work in a managed cluster. **Kubernetes is not welcome**.
- Prefer serverless-style deployments for production when applicable.

## Commit + branch conventions

- Commits MUST follow:

```text
<type>(<scope>): <subject>
```

- Branches MUST follow:
  - `feature/{domain}-{description}`
  - `fix/{domain}-{description}`
  - `refactor/{description}`


