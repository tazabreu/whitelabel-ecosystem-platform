# Changelog

## [Unreleased] - 2025-12-19

### Added - Docker Containerization
- **Complete Docker containerization** of all services
- **Makefile** with easy-to-use commands (`make up`, `make down`, etc.)
- **Multi-stage Docker builds** for optimized image sizes
- **Health checks** for all services with automatic dependency management
- **Docker Compose** orchestration with proper networking
- **Service wait script** to ensure all services are ready before use
- **Comprehensive documentation**:
  - `GETTING_STARTED.md` - 2-minute quickstart guide
  - `DOCKER.md` - Complete Docker commands reference
  - Updated `README.md` with Docker-first approach

### Changed
- **Redpanda port** changed from 9092 to 19092 (external) to avoid conflicts
- **Next.js configuration** updated for standalone Docker builds
- **API client** fixed to use correct environment variables for Docker
- **Spring Boot services** now have Docker-specific profiles
- **Service URLs** properly configured for container networking

### Fixed
- **"Failed to fetch" error** when logging in - services now properly communicate
- **Port conflicts** with Redpanda/Kafka
- **Environment variable** handling for client-side vs server-side in Next.js
- **Service discovery** between containers using Docker network

## Architecture

### Before
- Manual service startup (5+ terminal windows)
- Complex dependency management
- Port conflicts
- Inconsistent environment setup

### After
- Single command startup: `make up`
- Automatic dependency resolution
- Isolated container networking
- Consistent environment for all developers

## Migration Guide

### Old Way (Manual)
```bash
# Terminal 1
docker compose up -d

# Terminal 2
cd platform/shells/web && npm install && npm run dev

# Terminal 3
cd domains/web-bff && ./gradlew bootRun

# Terminal 4
cd domains/user && ./gradlew bootRun

# Terminal 5
cd domains/credit-card && ./gradlew bootRun

# Terminal 6
cd domains/analytics && npm install && npm run dev
```

### New Way (Docker)
```bash
make up
```

That's it! Everything runs in Docker with proper health checks and dependency management.

## Breaking Changes

None - the old manual way still works if you prefer it.

## Technical Details

### Docker Images
- **Web Shell**: Node 20 Alpine, multi-stage build, ~150MB
- **Java Services**: Eclipse Temurin 21 JRE Alpine, multi-stage build with Gradle, ~200MB each
- **Analytics**: Node 20 Alpine, multi-stage build, ~100MB

### Networking
- All services on `acme-ecosystem` bridge network
- Services communicate using container names (e.g., `web-bff:8080`)
- External access via published ports (e.g., `localhost:8080`)

### Data Persistence
- PostgreSQL data in Docker volumes
- Redpanda data in Docker volumes
- Volumes survive container restarts
- Use `make clean` to remove volumes

### Build Time
- **First build**: 5-10 minutes (downloads images, compiles Java)
- **Subsequent builds**: 1-2 minutes (uses cache)
- **Startup time**: 30-60 seconds (with health checks)

## Commands Reference

```bash
# Start
make up              # Start all services
make dev             # Alias for 'up'

# Stop
make down            # Stop services
make stop            # Alias for 'down'

# Monitor
make status          # Show service status
make logs            # View all logs
make health          # Health check

# Build
make build           # Build all services
make rebuild         # Rebuild without cache

# Clean
make clean           # Remove volumes (deletes data)
make clean-all       # Remove volumes and images
make nuke            # Alias for 'clean-all'

# Database
make db-user         # Connect to User DB
make db-credit-card  # Connect to Credit Card DB
make db-analytics    # Connect to Analytics DB

# Help
make help            # Show all commands
```

## Next Steps

1. Try it out: `make up`
2. Read [GETTING_STARTED.md](GETTING_STARTED.md)
3. Explore [DOCKER.md](DOCKER.md) for advanced usage
4. Check [README.md](README.md) for architecture details

