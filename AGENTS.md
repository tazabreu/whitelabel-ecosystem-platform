# Development Conventions

Guidelines for developing in this repository, especially when using AI agents.

**See also:** [.specify/memory/constitution.md](.specify/memory/constitution.md) - The authoritative project constitution.

## Core Principles

### KISS + Clean Code
- Prefer the simplest solution that meets requirements
- Code MUST be readable: small functions, clear names, low complexity
- Follow Clean Code discipline: consistent style, clear boundaries, explicit errors

### Clean Architecture + DDD
- Domain/application layers are framework-agnostic
- Each domain has explicit interfaces (ports) and infrastructure adapters
- Domain invariants live in the domain layer
- Cross-domain coupling via APIs/events only - never shared databases

### Trunk-Based Development
- Short-lived branches, frequent merges
- `main` is always releasable
- Use feature flags for incomplete work

### Feature Flags
- Named with dot-delimited convention: `credit-cards.pre-approved-offers`
- Default to off for incomplete/risky features
- Every flag has an owner and retirement plan

### Environment Parity
- Everything runnable locally via Docker
- High parity between local and cloud
- No Kubernetes - prefer serverless deployments

## Project Structure

```
platform/shells/{name}/  # Platform team owns (routing, auth, design system)
domains/{name}/          # Product teams own (domain services)
shared/{category}/       # Shared resources (ui, observability, etc.)
```

## Naming Conventions

### Directories
- `domains/{name}/` - Domain services (lowercase, singular)
- `platform/shells/{name}/` - Shell applications
- `shared/{category}/` - Shared resources

### API Conventions
- REST: `/api/{domain}/{resource}`
- GraphQL: `/graphql/{domain}`

### Event Naming
- Format: `com.ecosystem.{domain}.{entity}.{action}`
- Example: `com.ecosystem.cards.application.submitted`

## Observability Requirements

### Mandatory IDs
- **journeyId** - Generated at entry point (frontend), propagated end-to-end
- **userEcosystemId** - Stable user ID for cross-product correlation

### Analytics
- Every navigation action MUST emit analytics event
- Every major transactional action MUST emit analytics event

### Splunk Configuration
Read from environment variables (no hardcoding):
- `SPLUNK_HEC_URL`
- `SPLUNK_HEC_TOKEN` (secret)
- `SPLUNK_SOURCE` (optional)
- `SPLUNK_SOURCETYPE` (optional)
- `SPLUNK_INDEX` (optional)

## Commit Convention

Format:
```
<type>(<scope>): <subject>

Examples:
feat(cards): add application risk assessment
fix(user): handle null email validation
docs(readme): update architecture diagram
refactor(crm): extract customer repository
test(cards): add integration tests
```

**Best practice:** Read recent commit history to match style and completeness.

## Branch Naming

- `feature/{domain}-{description}`
- `fix/{domain}-{description}`
- `refactor/{description}`

## Technology Standards

### Microservices
- Java (latest LTS) + Spring Boot (latest stable), OR
- TypeScript with `strict: true`
- Services MUST be independently deployable
- Services OWN their data (no shared databases)

### Frontend
- React + TypeScript
- Modern tooling (fast dev/build, strong DX)
- Design system enforced via shell

### Event Mesh
- Redpanda for local development
- Event schemas MUST be versioned and validated

### Data Mesh
- Clear ownership per domain
- Well-defined contracts for shared datasets
- DDIA principles: reliability, scalability, maintainability
- Streaming only where it adds real value

## Common Development Tasks

### Start Platform
```bash
make up
```

### Make Code Changes
1. Edit files in `platform/`, `domains/`, or `shared/`
2. Rebuild: `make build-{service}`
3. Restart: `make restart`
4. Check logs: `make logs-{service}`

### Add New Domain Service
1. Create `domains/{name}/`
2. Follow existing service structure (see `domains/user/` or `domains/credit-card/`)
3. Add Dockerfile
4. Update `docker-compose.yml`
5. Document in README.md

### Add Feature Flag
1. Add to `.env.example` with clear naming
2. Read in service configuration
3. Use to control feature visibility
4. Document flag purpose and retirement plan

### Add Analytics Event
1. Define event schema: `com.ecosystem.{domain}.{entity}.{action}`
2. Emit from appropriate service
3. Ensure journeyId and userEcosystemId are included
4. Verify event appears in Redpanda

## AI Agent Guidelines

When working with AI agents on this codebase:

1. **Point to Constitution**: The constitution ([.specify/memory/constitution.md](.specify/memory/constitution.md)) supersedes all other conventions
2. **Emphasize KISS**: Prefer simple solutions over clever ones
3. **Respect Boundaries**: Domain layer never depends on infrastructure
4. **Use Feature Flags**: Hide incomplete work behind flags
5. **Propagate IDs**: Always include journeyId and userEcosystemId
6. **Check Compliance**: Every plan should include a "Constitution Check"

## Governance

- Constitution is highest-level policy
- Every plan/spec/tasks MUST include "Constitution Check"
- Violations MUST be documented explicitly
- Amendments require impact analysis and migration steps

## Getting Help

```bash
make help        # See all available commands
```

**Documentation:**
- [QUICK_START.md](QUICK_START.md) - Get running quickly
- [GETTING_STARTED.md](GETTING_STARTED.md) - Feature walkthrough
- [DOCKER.md](DOCKER.md) - Docker reference
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing guide
- [README.md](README.md) - Architecture overview


