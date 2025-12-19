# Whitelabel Ecosystem Platform Constitution
<!--
Sync Impact Report

- Version change: uninitialized template → 1.0.0
- Modified principles: N/A (template placeholders replaced)
- Added sections:
  - Project Conventions
  - Architecture & Delivery Standards
  - Governance (expanded)
- Removed sections: N/A
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): If this constitution existed before 2025-12-19, set the true ratification date.
-->

## Core Principles

### I. KISS + Clean Code (non-negotiable)

- Prefer the simplest solution that meets the requirement (KISS) and avoid speculative design (YAGNI).
- Code MUST be readable and maintainable: small functions, clear names, low cyclomatic complexity.
- Complexity MUST be justified in the plan (“Complexity Tracking” / “Constitution Check” gates).
- Follow Clean Code discipline: consistent style, clear boundaries, explicit error handling.

### II. Clean Architecture + DDD boundaries (domain-first)

- Use Clean Architecture boundaries: domain/application do not depend on infrastructure or UI frameworks.
- Each domain MUST have explicit interfaces (ports) and infrastructure adapters.
- Domain invariants live in the domain layer; application layer orchestrates use cases.
- Cross-domain coupling MUST happen via explicit contracts (APIs/events) — never by sharing databases.

### III. Microfrontends, owned by product teams; shell owned by platform team

- The platform team owns **shells** at `platform/shells/{name}/` (routing, auth, design system, runtime).
- Product teams own microfrontends under `domains/{name}/` and integrate via the shell.
- Microfrontends MUST be independently buildable/testable and deployable.
- Shared UI primitives belong in `shared/ui/` (or a similar `shared/{category}/`) and MUST be versioned.

### IV. Trunk-based development + feature flags (release control)

- Git strategy is **trunk-based**: short-lived branches, frequent merges, `main` is always releasable.
- Use feature flags **aggressively** to control rollout, experiments, and incomplete work.
- A “feature” is not “done” until it has:
  - a default-off flag (where appropriate),
  - clean-up plan (flag lifecycle), and
  - observable rollout metrics.

### V. Production parity, contracts, and operational excellence

- Maintain **high parity** between local and cloud environments (configs, dependencies, runtime).
- Everything MUST be runnable locally via containerized tooling (Docker/Compose) with minimal setup.
- Contracts are first-class: API contracts, schemas, and event definitions MUST be explicit and versioned.
- Observability is mandatory: structured logs, metrics, traces, and meaningful SLO-aligned dashboards.

## Project Conventions

## Naming Standards

### Directories

- `domains/{name}/` - Domain services (lowercase, singular)
- `platform/shells/{name}/` - Shell applications
- `shared/{category}/` - Shared resources

### Files

- `*.contract.ts` - API contracts
- `*.schema.json` - JSON schemas
- `*.spec.ts` - Test files
- `*.dto.ts` - Data transfer objects

### Events

- Format: `com.ecosystem.{domain}.{entity}.{action}`
- Example: `com.ecosystem.cards.application.submitted`

### APIs

- REST: `/api/{domain}/{resource}`
- GraphQL: `/graphql/{domain}`

## Commit Convention

```text
<type>(<scope>): <subject>

feat(cards): add application risk assessment
fix(user): handle null email validation
docs(readme): update architecture diagram
refactor(crm): extract customer repository
test(cards): add integration tests
```

Also, you should read the commit history to ensure that your commit messages are as complete as possible and that they follow the same structure as the previous 5/10 commits

## Branch Naming

- `feature/{domain}-{description}`
- `fix/{domain}-{description}`
- `refactor/{description}`

## Architecture & Delivery Standards

### Microservices: Java (latest LTS) + Spring (latest stable) OR strict TypeScript

- Microservices MUST be implemented using either:
  - Java (latest LTS) with the latest stable Spring (e.g., Spring Boot), or
  - TypeScript with `strict: true` and equivalent production-grade practices.
- Services MUST be independently deployable and OWN their data.
- No Kubernetes for this platform. Prefer serverless deployments and managed services.

### Frontend: best-in-class React ecosystem (as of 2025)

- Web frontends SHOULD use React + TypeScript and modern tooling (fast dev/build, strong DX, testing).
- Enforce a design system and consistent patterns across microfrontends via the shell.

### Containers and environment parity

- All components MUST be dockerized and runnable locally with parity to cloud (env vars, versions, deps).
- Provide a single “local bring-up” path for the whole platform (compose-based).

### Event mesh: Redpanda

- Kafka/event mesh MUST be implemented using a Redpanda container for local development.
- Event schemas MUST be versioned and validated (schema compatibility rules defined per domain).

### Data Mesh (simple, pragmatic; Designing Data Intensive Applications [DDIA]-aligned)

- Keep the Data Mesh implementation straightforward:
  - clear ownership per domain,
  - well-defined contracts for shared datasets,
  - reliability/scalability/maintainability tradeoffs explicitly documented (DDIA principles),
  - streaming where it adds real value; avoid unnecessary complexity.

## Governance

- This constitution is the highest-level project policy; it supersedes templates and conventions.
- Every plan/spec/tasks output MUST include a “Constitution Check” gate and document violations explicitly.
- Amendments MUST include:
  - a summary of changes,
  - impact analysis (what templates/docs need updating),
  - migration steps if rules change behaviorally.
- Compliance is enforced via code review and automated checks where possible.

**Version**: 1.0.0 | **Ratified**: 2025-12-19 | **Last Amended**: 2025-12-19
