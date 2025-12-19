# Docker Guide

Complete reference for running the platform with Docker.

## Quick Start

```bash
make up      # Start all services
make down    # Stop all services
make clean   # Stop and remove all data
```

## Prerequisites

- Docker Desktop or Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, see "Without Make" section)

## Services

The platform runs these containerized services:

### Infrastructure
- **postgres-user** (port 5432) - User database
- **postgres-credit-card** (port 5433) - Credit card database
- **postgres-analytics** (port 5434) - Analytics database
- **redpanda** (port 19092) - Event streaming
- **otel-collector** (ports 4317/4318) - OpenTelemetry

### Application
- **web-shell** (port 3000) - Next.js frontend
- **web-bff** (port 8080) - Backend-for-Frontend
- **user-service** (port 8081) - User domain
- **credit-card-service** (port 8082) - Credit card domain
- **analytics-service** (port 8083) - Analytics domain

## Common Commands

### Starting & Stopping

```bash
make up          # Start all services
make down        # Stop all services
make restart     # Restart all services
```

### Building

```bash
make build       # Build all services
make rebuild     # Rebuild from scratch (no cache)
```

Build individual services:

```bash
make build-web           # Web shell
make build-bff           # Web BFF
make build-user          # User service
make build-credit-card   # Credit card service
make build-analytics     # Analytics service
```

### Monitoring

```bash
make status      # Show service status
make health      # Health check all services
make logs        # View all logs
```

View logs for specific services:

```bash
make logs-web            # Web shell
make logs-bff            # Web BFF
make logs-user           # User service
make logs-credit-card    # Credit card service
make logs-analytics      # Analytics service
make logs-infra          # Infrastructure (DBs, Kafka, etc.)
```

### Database Access

```bash
make db-user          # Connect to User database
make db-credit-card   # Connect to Credit Card database
make db-analytics     # Connect to Analytics database
```

### Container Shell Access

```bash
make shell-web           # Web shell container
make shell-bff           # Web BFF container
make shell-user          # User service container
make shell-credit-card   # Credit card service container
make shell-analytics     # Analytics service container
```

### Cleanup

```bash
make clean       # Stop and remove volumes (⚠️ deletes data)
make clean-all   # Stop, remove volumes and images
make prune       # Remove all unused Docker resources
```

## Without Make

If you don't have Make installed:

```bash
# Start
docker compose up -d --build

# Stop
docker compose down

# Clean
docker compose down -v

# Logs
docker compose logs -f

# Status
docker compose ps

# Build specific service
docker compose build web-shell

# Shell access
docker compose exec web-shell sh
```

## Access Points

Once running:

- **Web App:** http://localhost:3000
- **Web BFF API:** http://localhost:8080
- **User Service:** http://localhost:8081
- **Credit Card Service:** http://localhost:8082
- **Analytics Service:** http://localhost:8083
- **Redpanda Console:** http://localhost:9644

## Startup Time

- **First time:** 2-5 minutes (downloads images, builds services)
- **Subsequent:** 30-60 seconds (uses cached images)

## Troubleshooting

### Services not starting

```bash
make status      # Check what's running
make logs        # View error logs
make rebuild     # Rebuild from scratch
make up          # Try again
```

### Port conflicts

If you see "port already in use":

1. Check what's using the port: `lsof -i :PORT`
2. Stop that service, or
3. Edit `docker-compose.yml` to use different ports

### Database connection errors

```bash
docker compose ps | grep postgres  # Check DB status
make db-user                        # Try connecting
make clean && make up               # Nuclear option
```

### Clean slate

Remove everything and start fresh:

```bash
make clean-all   # Remove containers, volumes, images
make up          # Start fresh
```

## Development Workflow

1. Make code changes
2. Rebuild affected service:
   ```bash
   make build-web    # or build-bff, build-user, etc.
   ```
3. Restart services:
   ```bash
   make restart
   ```
4. Check logs:
   ```bash
   make logs-web     # or logs-bff, etc.
   ```

## Network Architecture

All services run on the `acme-ecosystem` bridge network:

- Services communicate using container names (e.g., `web-bff:8080`)
- External access via published ports (e.g., `localhost:8080`)

## Data Persistence

Data persists in Docker volumes:

- `postgres-user-data`
- `postgres-credit-card-data`
- `postgres-analytics-data`
- `redpanda-data`

Volumes survive container restarts but are removed with `make clean`.

## Environment Variables

Services read config from environment variables. Key variables are defined in `docker-compose.yml`.

For local overrides, create `.env`:

```bash
# Example .env
CREDIT_CARDS_PRE_APPROVED_OFFERS=true
SPLUNK_HEC_URL=http://your-splunk:8088
SPLUNK_HEC_TOKEN=your-token
```

Then restart: `make restart`

## Production Considerations

For production deployment:

1. Use secrets management (not `.env` files)
2. Enable TLS/SSL for external endpoints
3. Configure proper resource limits
4. Set up backup strategies for databases
5. Use proper Splunk HEC endpoint and token
6. Consider managed services instead of self-hosted DBs

## Next Steps

- **Try the platform:** [GETTING_STARTED.md](GETTING_STARTED.md)
- **Test features:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Architecture overview:** [README.md](README.md)
- **Development conventions:** [AGENTS.md](AGENTS.md)
