# 🏗️ Whitelabel Ecosystem Platform

> **A product-platform built for practicing AI-first engineering on cutting-edge technology**

![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Make](https://img.shields.io/badge/Make-Automated-green)
![Architecture](https://img.shields.io/badge/DDD-Clean%20Architecture-orange)

## 🎯 What is This?

A **whitelabel ecosystem platform** that serves as a foundation for building multiple products on top of a shared infrastructure. This is a learning and experimentation platform for:

- 🤖 **AI-First Engineering** - Practicing spec-driven development with AI agents
- 🏛️ **Modern Architecture** - Microservices, DDD, Event-Driven Design, Data Mesh
- 🔍 **Observability** - End-to-end tracing with OpenTelemetry and Splunk
- 🚀 **DevOps Best Practices** - Docker, feature flags, trunk-based development

## 🏗️ Architecture

The platform follows a layered architecture designed to support multiple channels and products:

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

**Design Principles:**
- 🎨 **Domain-Driven Design** - Clear bounded contexts per domain
- 🔄 **Event-Driven** - Kafka/Redpanda for async communication
- 🏢 **BFF Pattern** - Optimized backends per frontend type
- 📊 **Data Mesh** - Decentralized data ownership with centralized lakehouse
- 🔭 **Observable by Default** - journeyId & userEcosystemId throughout

## 🚀 Quick Start

```bash
# Start the entire platform
make up

# Open your browser
open http://localhost:3000

# Login with demo credentials
# user:user or admin:admin
```

That's it! All services, databases, and infrastructure start automatically.

## 📦 What's Included

### Demo Products
- **Credit Card System** - Pre-approved offers, onboarding, purchases, limit management
- **User Management** - Authentication, profiles, ecosystem-wide identity

### Platform Components
- **Web Shell** (Next.js 14) - Modern, responsive frontend
- **Web BFF** (Spring Boot 3.2, Java 21) - Backend-for-Frontend orchestration
- **Domain Services** - Microservices for User, Credit Card, Analytics
- **Event Mesh** (Redpanda/Kafka) - Event-driven architecture
- **Data Lakehouse** (dbt + DuckDB → BigQuery) - Customer 360 analytics
- **Observability** (OpenTelemetry + Splunk) - Full distributed tracing

## 💻 Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Spring Boot 3.2 (Java 21), Express (TypeScript) |
| **Data** | PostgreSQL (per domain), DuckDB, dbt |
| **Messaging** | Redpanda (Kafka-compatible) |
| **Observability** | OpenTelemetry, Splunk |
| **Infrastructure** | Docker, Docker Compose, Make |

## 🎓 Learning Objectives

This platform is designed to practice:

1. **AI-First Development**
   - Spec-driven development with AI agents
   - Constitution-based development principles
   - Automated implementation from specifications

2. **Modern Architecture Patterns**
   - Microservices with clear boundaries
   - Backend-for-Frontend (BFF) pattern
   - Event-driven architecture
   - Data Mesh principles

3. **Production-Grade Practices**
   - End-to-end observability (journeyId propagation)
   - Feature flagging
   - Health checks and graceful degradation
   - Docker containerization

4. **Multi-Product Platform**
   - Whitelabel foundation
   - Multiple products sharing infrastructure
   - Cross-domain data aggregation (Customer 360)

## 📚 Documentation

- **[AGENTS.md](AGENTS.md)** - AI agent development conventions
- **Makefile** - Run `make help` for all available commands
- **Domain READMEs** - Technical documentation in each domain directory
  - [Data Lakehouse](domains/data-lakehouse/README.md) - Customer 360 analytics
  - [Feature Flags](shared/feature-flags/README.md) - Feature flag conventions
  - [Observability](shared/observability/README.md) - Tracing and logging standards

## 🛠️ Development

### Running Locally (Docker)
```bash
make up          # Start all services
make logs        # View logs
make status      # Check status
make down        # Stop services
make clean       # Remove all data
```

### Making Changes
```bash
# 1. Make your code changes
# 2. Rebuild affected service
make build-web   # or build-bff, build-user, etc.

# 3. Restart
make restart
```

See all commands: `make help`

## 🌟 Key Features

- ✅ **Containerized Everything** - Single command to start the entire platform
- ✅ **Health Checks** - Automatic dependency management and health monitoring
- ✅ **Observability** - journeyId and userEcosystemId tracked end-to-end
- ✅ **Feature Flags** - Environment-based feature toggling
- ✅ **Event-Driven** - Kafka/Redpanda for asynchronous communication
- ✅ **Data Lakehouse** - Customer 360 view with dbt transformations
- ✅ **Multi-Tenancy Ready** - Whitelabel design for multiple products

## 🎯 Use Cases

This platform can be used to:
- Build multiple banking/fintech products on a shared foundation
- Practice modern software architecture patterns
- Experiment with AI-assisted development
- Learn event-driven and data mesh architectures
- Prototype new features with feature flags

## 🤝 Contributing

This is a personal learning and experimentation platform. Feel free to fork and adapt for your own learning!

### Development Principles
- **KISS** (Keep It Simple, Stupid)
- **Clean Code** and **Clean Architecture**
- **Trunk-Based Development**
- **Feature Flags** for incomplete work
- **Spec-Driven** with AI assistance

## 📋 Project Structure

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

.specify/              # Spec-driven development infrastructure
scripts/               # Development scripts
```

## 🔮 Future Enhancements

Potential areas for expansion:
- Additional channels (Mobile app, Backoffices, ATMs)
- More domain services (Loans, Investments, Insurance)
- API Gateway with rate limiting and authentication
- Multi-region deployment
- Kubernetes deployment manifests
- CI/CD pipelines
- Automated testing suites

## 📜 License

Private - Learning and Experimentation Platform

---

**Built with ❤️ using AI-first engineering practices**

*This is a sandbox for practicing modern software engineering with AI assistance. The goal is to build a production-quality architecture while learning cutting-edge technologies.*
