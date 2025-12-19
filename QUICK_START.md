# 🚀 Quick Start

Get the platform running in 2 commands.

## Prerequisites

- Docker Desktop or Docker Engine (20.10+)
- Docker Compose (2.0+)
- Make (optional, for convenience)

## Start Everything

```bash
# Start all services
make up

# Open browser
open http://localhost:3000
```

Login with `user:user` or `admin:admin`.

## What's Running

| Service | Port | Description |
|---------|------|-------------|
| Web Shell | 3000 | Next.js frontend |
| Web BFF | 8080 | Backend-for-Frontend API |
| User Service | 8081 | User management |
| Credit Card Service | 8082 | Credit card operations |
| Analytics Service | 8083 | Event analytics |
| PostgreSQL (User) | 5432 | User database |
| PostgreSQL (Cards) | 5433 | Credit card database |
| PostgreSQL (Analytics) | 5434 | Analytics database |
| Redpanda | 19092 | Event streaming |

## Common Commands

```bash
make status      # Check service status
make logs        # View all logs
make health      # Health check all services
make down        # Stop all services
make clean       # Stop and remove all data
make help        # See all available commands
```

## Troubleshooting

### Services not starting?
```bash
make logs        # Check for errors
make rebuild     # Rebuild from scratch
make up          # Try again
```

### Port conflicts?
Edit `docker-compose.yml` to use different ports.

### Clean slate?
```bash
make clean       # Remove all data
make up          # Start fresh
```

## Next Steps

- **[README.md](README.md)** - Architecture overview and learning objectives
- **[DOCKER.md](DOCKER.md)** - Complete Docker command reference
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - How to test all features
- **[AGENTS.md](AGENTS.md)** - Development conventions

## Development Workflow

1. Make code changes
2. Rebuild affected service: `make build-web` (or `build-bff`, `build-user`, etc.)
3. Restart: `make restart`
4. Check logs: `make logs-web` (or `logs-bff`, etc.)

---

**Need help?** Run `make help` for all available commands.

