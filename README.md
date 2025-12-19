# 🏗️ Whitelabel Ecosystem Platform

A multi-product platform demonstrating modern architecture patterns and AI-first engineering practices.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](DOCKER.md)
[![Make](https://img.shields.io/badge/Make-Automated-green)](Makefile)
[![DDD](https://img.shields.io/badge/DDD-Clean%20Architecture-orange)](#architecture)

## Quick Start

```bash
make up                    # Start all services
open http://localhost:3000 # Open browser
# Login: user:user or admin:admin
```

**New here?** See [QUICK_START.md](QUICK_START.md) for detailed setup.

## What Is This?

A whitelabel ecosystem platform for running multiple financial products on shared infrastructure. Built to practice:

- 🏛️ **Modern Architecture** - DDD, Clean Architecture, Event-Driven Design, BFF pattern
- 🤖 **AI-First Engineering** - Spec-driven development with AI agents (see [AGENTS.md](AGENTS.md))
- 🔍 **Observability** - End-to-end tracing with journeyId and userEcosystemId
- 🚀 **DevOps** - Docker-first, feature flags, trunk-based development

## Architecture

The platform uses a layered architecture supporting multiple channels and products:

```
┌─────────────────────────────────────────────────────────────────┐
│  CHANNELS / FRONTENDS                                           │
│  Web app │ Mobile app │ Backoffices │ ATMs                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│  BFFs / BACKENDS FOR FRONTENDS                                  │
│  Web BFF │ Mobile BFF │ ... → Public-facing API Gateway         │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│  SERVICE DOMAINS                                                │
│  User │ Credit Card │ Analytics                                 │
│  ↓        ↓              ↓                                       │
│  [PostgreSQL per domain]                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│  INTEGRATION LAYER                                              │
│  Kafka/Event Mesh │ Internal API Gateway                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│  DATA LAKEHOUSE / MESH                                          │
│  Data aggregations │ Views │ Reports                            │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principles:**
- **Domain-Driven Design** - Clear bounded contexts per domain
- **Event-Driven** - Redpanda/Kafka for async communication
- **BFF Pattern** - Backend optimized for each frontend type
- **Data Mesh** - Decentralized data ownership with centralized lakehouse
- **Observable by Default** - journeyId & userEcosystemId propagate through all requests

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Spring Boot 3.2 (Java 21), Express (TypeScript) |
| **Data** | PostgreSQL (per domain), DuckDB, dbt |
| **Messaging** | Redpanda (Kafka-compatible) |
| **Observability** | OpenTelemetry, Splunk |
| **Infrastructure** | Docker, Docker Compose, Make |

## Current Features

### Demo Products
- **Credit Card System** - Pre-approved offers, onboarding, purchases, limit management
- **User Management** - Authentication, profiles, ecosystem-wide identity

### Platform Components
- **Web Shell** (Next.js 14) - Frontend shell at `platform/shells/web/`
- **Web BFF** (Spring Boot 3.2) - Backend-for-Frontend at `domains/web-bff/`
- **Domain Services** - User, Credit Card, Analytics services at `domains/{name}/`
- **Event Mesh** (Redpanda) - Event-driven architecture
- **Data Lakehouse** (dbt + DuckDB) - Customer 360 analytics at `domains/data-lakehouse/`
- **Observability** (OpenTelemetry) - Distributed tracing via `shared/observability/`

See [GETTING_STARTED.md](GETTING_STARTED.md) to try these features.

## Project Structure

```
platform/
  shells/web/          # Next.js web frontend

domains/
  web-bff/             # Spring Boot BFF
  user/                # User domain service
  credit-card/         # Credit card domain service
  analytics/           # Analytics domain service
  data-lakehouse/      # dbt + DuckDB lakehouse

shared/
  observability/       # OpenTelemetry configs
  feature-flags/       # Feature flag abstractions
  contracts/           # API contracts and schemas

specs/                 # Feature specs and plans
```

## Development Commands

```bash
make up              # Start all services
make down            # Stop all services
make logs            # View logs
make status          # Check service status
make health          # Health check all services
make clean           # Remove all data
make help            # See all commands
```

See [DOCKER.md](DOCKER.md) for complete Docker reference.

## Making Changes

1. Edit code in `platform/`, `domains/`, or `shared/`
2. Rebuild: `make build-web` (or `build-bff`, `build-user`, etc.)
3. Restart: `make restart`
4. Check logs: `make logs-web` (or `logs-bff`, etc.)

## Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get running in 2 commands
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Feature walkthrough
- **[DOCKER.md](DOCKER.md)** - Complete Docker commands reference
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - How to test all features
- **[AGENTS.md](AGENTS.md)** - Development conventions and AI agent guidelines
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and migration notes
- **[specs/](specs/001-acme-ecosystem-mvp/)** - Detailed specifications

## Learning Objectives

Practice modern software engineering:

1. **Architecture Patterns**
   - Microservices with clear domain boundaries (DDD)
   - Backend-for-Frontend (BFF) pattern
   - Event-driven architecture
   - Data Mesh principles

2. **AI-First Development**
   - Spec-driven development with AI agents
   - Constitution-based development principles
   - Automated implementation from specifications

3. **Production Practices**
   - End-to-end observability (journeyId propagation)
   - Feature flagging for controlled rollout
   - Health checks and graceful degradation
   - Docker containerization and environment parity

4. **Multi-Product Platform**
   - Whitelabel foundation
   - Multiple products sharing infrastructure
   - Cross-domain data aggregation (Customer 360)

## Development Principles

From [AGENTS.md](AGENTS.md):

- **KISS** (Keep It Simple, Stupid) - Simplest solution that meets requirements
- **Clean Code** and **Clean Architecture** - Readable, maintainable, well-bounded
- **Trunk-Based Development** - Short-lived branches, frequent merges
- **Feature Flags** - Control rollout and hide incomplete work
- **Spec-Driven** - AI-assisted development from specifications

See [.specify/memory/constitution.md](.specify/memory/constitution.md) for complete project conventions.

## Contributing

Personal learning platform. Fork and adapt for your own experiments!

## License

Private - Learning and Experimentation Platform
