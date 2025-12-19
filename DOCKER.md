# Docker Deployment Guide

This guide explains how to run the ACME Ecosystem Platform using Docker and Docker Compose.

## Prerequisites

- Docker Desktop or Docker Engine (20.10+)
- Docker Compose (2.0+)
- Make (optional but recommended)

## Quick Start

### Using Make (Recommended)

```bash
# Start all services
make up

# View status
make status

# View logs
make logs

# Stop services
make down

# Clean everything (including data)
make clean
```

### Using Docker Compose Directly

```bash
# Start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down

# Clean everything
docker compose down -v
```

## Architecture

The Docker deployment includes:

### Infrastructure Services
- **postgres-user** (port 5432): User data
- **postgres-credit-card** (port 5433): Credit card data
- **postgres-analytics** (port 5434): Analytics data
- **redpanda** (port 19092): Kafka-compatible event streaming
- **otel-collector** (port 4317/4318): OpenTelemetry collector

### Application Services
- **web-shell** (port 3000): Next.js frontend
- **web-bff** (port 8080): Backend-for-Frontend
- **user-service** (port 8081): User domain service
- **credit-card-service** (port 8082): Credit card domain service
- **analytics-service** (port 8083): Analytics domain service

## Make Commands

### General
- `make help` - Display all available commands
- `make up` - Start all services
- `make down` - Stop all services
- `make restart` - Restart all services

### Building
- `make build` - Build all services
- `make rebuild` - Rebuild from scratch (no cache)
- `make build-web` - Build only web shell
- `make build-bff` - Build only Web BFF
- `make build-user` - Build only User service
- `make build-credit-card` - Build only Credit Card service
- `make build-analytics` - Build only Analytics service

### Monitoring
- `make status` - Show service status
- `make logs` - View all logs
- `make logs-web` - View web shell logs
- `make logs-bff` - View BFF logs
- `make logs-user` - View User service logs
- `make logs-credit-card` - View Credit Card service logs
- `make logs-analytics` - View Analytics service logs
- `make logs-infra` - View infrastructure logs
- `make health` - Check health of all services

### Cleanup
- `make clean` - Stop and remove volumes (⚠️ deletes data)
- `make clean-all` - Stop, remove volumes and images
- `make prune` - Remove all unused Docker resources

### Database Access
- `make db-user` - Connect to User database
- `make db-credit-card` - Connect to Credit Card database
- `make db-analytics` - Connect to Analytics database

### Development Tools
- `make shell-web` - Open shell in web container
- `make shell-bff` - Open shell in BFF container
- `make shell-user` - Open shell in User service container
- `make shell-credit-card` - Open shell in Credit Card service container
- `make shell-analytics` - Open shell in Analytics service container

## Access Points

Once all services are running:

- **Web Application**: http://localhost:3000
- **Web BFF API**: http://localhost:8080
- **User Service API**: http://localhost:8081
- **Credit Card Service API**: http://localhost:8082
- **Analytics Service API**: http://localhost:8083
- **Redpanda Console**: http://localhost:9644

## Login Credentials

Demo credentials for testing:
- Username: `user` / Password: `user`
- Username: `admin` / Password: `admin`

## Startup Time

First-time startup can take 2-5 minutes due to:
- Image downloads
- Java service compilation
- Database initialization
- Health checks

Subsequent startups are much faster (30-60 seconds).

## Troubleshooting

### Services not starting
```bash
# Check service status
make status

# View logs for specific service
make logs-bff  # or logs-user, logs-credit-card, etc.

# Check health
make health
```

### Port conflicts
If you see "port already in use" errors:
1. Check what's using the port: `lsof -i :PORT`
2. Either stop that service or change the port in `docker-compose.yml`

### Database connection issues
```bash
# Check database health
docker compose ps

# Connect to database directly
make db-user  # or db-credit-card, db-analytics
```

### Clean slate
If things are really broken:
```bash
make clean-all  # Remove everything
make up         # Start fresh
```

## Development Workflow

### Making code changes

1. Make your code changes
2. Rebuild the affected service:
   ```bash
   make build-web  # or build-bff, build-user, etc.
   ```
3. Restart services:
   ```bash
   make restart
   ```

### Viewing logs during development

Keep logs open in a separate terminal:
```bash
make logs
```

Or for a specific service:
```bash
make logs-bff
```

## Production Considerations

For production deployment:

1. Update credentials in `.env.docker`
2. Use proper Splunk HEC endpoint and token
3. Enable TLS/SSL for external endpoints
4. Configure proper resource limits in `docker-compose.yml`
5. Use Docker secrets for sensitive data
6. Consider using Kubernetes for orchestration
7. Set up proper backup strategies for databases

## Network Architecture

All services are on the `acme-ecosystem` bridge network:
- Services communicate using container names (e.g., `web-bff:8080`)
- External access via published ports (e.g., `localhost:8080`)

## Data Persistence

Data is persisted in Docker volumes:
- `postgres-user-data`
- `postgres-credit-card-data`
- `postgres-analytics-data`
- `redpanda-data`

These volumes survive container restarts but are removed with `make clean`.

## Performance Tuning

### Java Services
Adjust JVM memory in `docker-compose.yml`:
```yaml
environment:
  JAVA_OPTS: "-Xmx1g -Xms512m"  # Increase for better performance
```

### Database
Adjust PostgreSQL resources:
```yaml
environment:
  POSTGRES_SHARED_BUFFERS: "256MB"
  POSTGRES_EFFECTIVE_CACHE_SIZE: "1GB"
```

## Next Steps

- Read [README.md](README.md) for architectural overview
- Read [quickstart.md](specs/001-acme-ecosystem-mvp/quickstart.md) for development details
- Check [AGENTS.md](AGENTS.md) for development conventions

