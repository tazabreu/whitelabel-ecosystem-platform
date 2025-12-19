# Copilot Instructions for Whitelabel Ecosystem Platform

## Project Overview

This is a **whitelabel ecosystem platform** for practicing AI-first engineering on cutting-edge technology. It's a product-platform foundation for building multiple products on shared infrastructure using microservices, DDD, event-driven design, and data mesh principles.

### Architecture

The platform follows a layered architecture:
- **Channels/Frontends**: Web app, mobile app, backoffices (potential)
- **BFFs (Backend-for-Frontend)**: Web BFF (Spring Boot 3.2, Java 21)
- **Service Domains**: User, Credit Card, Analytics (independent microservices)
- **Event Mesh**: Redpanda/Kafka for async communication
- **Data Lakehouse**: dbt + DuckDB for Customer 360 analytics

### Design Principles

1. **Domain-Driven Design (DDD)**: Clear bounded contexts per domain
2. **Clean Architecture**: Domain/application layers are framework-agnostic
3. **Event-Driven**: Kafka/Redpanda for async communication
4. **BFF Pattern**: Optimized backends per frontend type
5. **Data Mesh**: Decentralized data ownership with centralized lakehouse
6. **Observable by Default**: `journeyId` & `userEcosystemId` throughout

## Core Development Principles

### KISS + Clean Code (Non-negotiable)

- Prefer the **simplest solution** that meets requirements
- Code MUST be readable and maintainable: small functions, clear names, low cyclomatic complexity
- Avoid speculative design (YAGNI)
- Follow Clean Code discipline: consistent style, clear boundaries, explicit error handling

### Clean Architecture + DDD Boundaries

- Domain/application layers do NOT depend on infrastructure or UI frameworks
- Each domain MUST have explicit interfaces (ports) and infrastructure adapters
- Domain invariants live in the domain layer
- Cross-domain coupling MUST happen via explicit contracts (APIs/events) - never by sharing databases

### Trunk-Based Development + Feature Flags

- Use **trunk-based development**: short-lived branches, frequent merges, `main` is always releasable
- Use feature flags **aggressively** for rollout, experiments, and incomplete work
- Feature flags MUST have: default-off state, clean-up plan, and observable rollout metrics

### Production Parity

- Everything MUST be runnable locally via Docker/Compose with minimal setup
- Maintain **high parity** between local and cloud environments
- Avoid assumptions that only work in managed clusters - **Kubernetes is not welcome**
- Prefer serverless-style deployments for production

## Project Structure

```
platform/
  shells/web/          # Next.js 14 web frontend (Platform team owns)

domains/
  web-bff/             # Spring Boot 3.2 BFF (Java 21)
  user/                # User domain service (Spring Boot)
  credit-card/         # Credit card domain service (Spring Boot)
  analytics/           # Analytics domain service (TypeScript)
  data-lakehouse/      # dbt + DuckDB lakehouse

shared/
  observability/       # OpenTelemetry configs
  feature-flags/       # Feature flag abstractions
  contracts/           # API contracts and schemas

specs/                 # Feature specs and plans
.specify/              # Spec-driven development tooling
```

### Ownership

- **Platform team** owns shells at `platform/shells/{name}/`
- **Product teams** own domains at `domains/{name}/`
- **Shared resources** go in `shared/{category}/`

## Technology Stack

### Frontend
- **Next.js 14** with App Router
- **React** with TypeScript (`strict: true`)
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components

### Backend (Microservices)
- **Java 21** (latest LTS) with **Spring Boot 3.2** (latest stable)
- OR **TypeScript** with `strict: true` and production-grade practices
- Each service MUST be independently deployable and OWN their data

### Data
- **PostgreSQL** (one per domain)
- **DuckDB** for analytics
- **dbt** for data transformations

### Event Streaming
- **Redpanda** (Kafka-compatible) for local development
- Event schemas MUST be versioned and validated

### Observability
- **OpenTelemetry** for distributed tracing
- **Splunk** for log aggregation and analytics

### Infrastructure
- **Docker** and **Docker Compose** (no Kubernetes)
- **Make** for automation

## Naming Conventions

### Directories
- `domains/{name}/` - Domain services (lowercase, singular)
- `platform/shells/{name}/` - Shell applications
- `shared/{category}/` - Shared resources (e.g., `shared/ui/`, `shared/observability/`)

### Files
- `*.contract.ts` - API contracts
- `*.schema.json` - JSON schemas
- `*.spec.ts` - Test files
- `*.dto.ts` - Data transfer objects

### APIs
- **REST**: `/api/{domain}/{resource}`
- **GraphQL**: `/graphql/{domain}`

### Events
- **Format**: `com.ecosystem.{domain}.{entity}.{action}`
- **Example**: `com.ecosystem.cards.application.submitted`

### Feature Flags
- **Format**: `{domain}.{feature-name}` (dot-delimited)
- **Example**: `credit-cards.pre-approved-offers`
- Flags SHOULD default to off for incomplete or risky features
- Every flag MUST have an owner and a retirement plan

## Commit and Branch Conventions

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

Examples:
feat(cards): add application risk assessment
fix(user): handle null email validation
docs(readme): update architecture diagram
refactor(crm): extract customer repository
test(cards): add integration tests
```

**Important**: Read recent commit history to ensure your commit messages are complete and follow the same structure.

### Branch Naming

- `feature/{domain}-{description}`
- `fix/{domain}-{description}`
- `refactor/{description}`

## Observability Requirements

### Mandatory Tracking

- Every navigation action MUST emit an analytics event
- Every major transactional action MUST emit an analytics event
- A **`journeyId`** MUST be generated at entry point (frontend) and propagated end-to-end
- A stable **`userEcosystemId`** MUST be used to correlate activity across products

### Splunk Configuration

All components MUST read Splunk config from environment variables (no hardcoding):

- `SPLUNK_HEC_URL`
- `SPLUNK_HEC_TOKEN` (secret)
- `SPLUNK_SOURCE` (optional)
- `SPLUNK_SOURCETYPE` (optional)
- `SPLUNK_INDEX` (optional)

## Build and Test Commands

### Local Development (Docker)

```bash
make up          # Start all services
make down        # Stop all services
make logs        # View all logs
make status      # Check service status
make health      # Health check all services
make clean       # Stop and remove all data
make rebuild     # Rebuild all services
make help        # See all commands
```

### Building Individual Services

```bash
make build-web   # Build web shell (Next.js)
make build-bff   # Build web BFF (Spring Boot)
make build-user  # Build user service
make build-cards # Build credit card service
make restart     # Restart after rebuilding
```

### Database Access

```bash
make db-user     # Connect to user database
make db-cards    # Connect to credit card database
make db-analytics # Connect to analytics database
```

## Code Style Guidelines

### General

- **Small functions**: Each function should do one thing well
- **Clear names**: Use descriptive, intention-revealing names
- **Low cyclomatic complexity**: Keep conditional logic simple
- **Explicit error handling**: Never silently ignore errors

### TypeScript

- Always use `strict: true`
- Prefer explicit types over `any`
- Use TypeScript's type system to catch errors at compile time

### Java

- Use Java 21 features where appropriate
- Follow Spring Boot best practices
- Use dependency injection properly
- Keep controllers thin, move business logic to services

### Testing

- Write tests that match the existing test infrastructure
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows

## Special Considerations

### Microfrontends

- Microfrontends MUST be independently buildable, testable, and deployable
- Integration happens via the shell
- Shared UI primitives belong in `shared/ui/` and MUST be versioned

### Data Mesh

- Keep implementation straightforward and pragmatic
- Clear ownership per domain
- Well-defined contracts for shared datasets
- Streaming where it adds real value; avoid unnecessary complexity

### Containers and Environment Parity

- All components MUST be dockerized
- Provide a single "local bring-up" path for the whole platform
- Configs, dependencies, and runtime versions must match cloud environment

## Configuration Hierarchy

When there's a conflict between documents:

1. **`.specify/memory/constitution.md`** (highest authority)
2. **`AGENTS.md`** (agent-specific defaults)
3. **This file** (Copilot-specific guidance)
4. Individual spec/plan documents

## Getting Started

New to this repository? Start here:

1. Read **[GETTING_STARTED.md](../GETTING_STARTED.md)** - 2-minute quickstart
2. Read **[README.md](../README.md)** - Architecture overview
3. Read **[AGENTS.md](../AGENTS.md)** - Development conventions
4. Review **[.specify/memory/constitution.md](../.specify/memory/constitution.md)** - Core principles
5. Run `make up` to start the platform locally

## Key Files to Reference

- **Constitution**: `.specify/memory/constitution.md` (highest-level project policy)
- **Agent Defaults**: `AGENTS.md` (development rules)
- **Architecture**: `README.md` (system overview)
- **Quick Start**: `GETTING_STARTED.md` (getting up and running)
- **Docker Commands**: `DOCKER.md` (complete Docker reference)
- **Specifications**: `specs/` (feature specs and architecture decisions)

## When Making Changes

1. **Understand the context**: Review relevant specs and architecture docs
2. **Keep it simple**: Prefer the simplest solution that meets requirements
3. **Follow conventions**: Use established patterns and naming conventions
4. **Maintain boundaries**: Respect DDD and Clean Architecture boundaries
5. **Add observability**: Emit events for significant actions, propagate `journeyId`
6. **Use feature flags**: For incomplete work or risky changes
7. **Test locally**: Use `make up` to run the full platform
8. **Write clear commits**: Follow conventional commits format

## Common Pitfalls to Avoid

- ❌ Don't hardcode configuration values (use environment variables)
- ❌ Don't couple domains via shared databases
- ❌ Don't skip event emissions for significant actions
- ❌ Don't forget to propagate `journeyId` and `userEcosystemId`
- ❌ Don't add complexity without justification
- ❌ Don't assume Kubernetes - this platform avoids it
- ❌ Don't create feature flags that default to ON for risky features
- ❌ Don't bypass Clean Architecture boundaries

## Success Criteria

A change is considered well-executed when:

✅ It follows KISS and Clean Code principles
✅ It respects DDD and Clean Architecture boundaries
✅ It's runnable locally with `make up`
✅ It includes proper observability (events, journeyId propagation)
✅ It uses feature flags where appropriate
✅ It follows naming and commit conventions
✅ It maintains production parity
✅ It's documented in the appropriate spec/plan if significant
