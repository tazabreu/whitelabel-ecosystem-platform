# Getting Started with ACME Ecosystem Platform

## 🚀 Quick Start (2 commands)

```bash
# 1. Start everything
make up

# 2. Open your browser
open http://localhost:3000
```

Login with `user:user` or `admin:admin`

## What You Get

- ✅ Complete whitelabel platform running in Docker
- ✅ All services automatically built and started
- ✅ Databases initialized with demo data
- ✅ Event streaming ready (Kafka/Redpanda)
- ✅ Observability configured (OpenTelemetry)
- ✅ Feature flags enabled

## Available Commands

```bash
make up          # Start all services
make down        # Stop all services
make logs        # View all logs
make status      # Check service status
make health      # Health check all services
make clean       # Stop and remove all data
make help        # See all commands
```

## What's Running

| Service | URL | Description |
|---------|-----|-------------|
| Web Shell | http://localhost:3000 | Next.js frontend |
| Web BFF | http://localhost:8080 | Backend-for-Frontend |
| User Service | http://localhost:8081 | User management |
| Credit Card Service | http://localhost:8082 | Credit card domain |
| Analytics Service | http://localhost:8083 | Event analytics |
| PostgreSQL (User) | localhost:5432 | User database |
| PostgreSQL (Credit Card) | localhost:5433 | Credit card database |
| PostgreSQL (Analytics) | localhost:5434 | Analytics database |
| Redpanda | localhost:19092 | Event streaming |

## Features to Try

### 1. Login
- Go to http://localhost:3000
- Login with `user:user` or `admin:admin`

### 2. Credit Card Offer
- See your pre-approved credit card offer
- Click "Accept Offer"
- Type "I agree" to complete onboarding

### 3. Simulate Purchases
- Click "Simulate Purchase" to make random transactions
- Watch your available credit decrease
- See transaction history

### 4. Raise Credit Limit
- Click "Raise Limit" to increase your credit
- Watch your available credit increase

### 5. Reset Account
- Click "Reset Account" to start over

## Troubleshooting

### Services not starting?
```bash
# Check what's wrong
make logs

# Try rebuilding
make rebuild
make up
```

### Port conflicts?
If you see "port already in use":
1. Stop the conflicting service
2. Or edit `docker-compose.yml` to use different ports

### Database issues?
```bash
# Connect to database
make db-user

# Or clean and restart
make clean
make up
```

### Still having issues?
```bash
# Nuclear option - remove everything and start fresh
make clean-all
make up
```

## Next Steps

- Read [DOCKER.md](DOCKER.md) for complete Docker commands
- Read [README.md](README.md) for architecture overview
- Check [specs/](specs/001-acme-ecosystem-mvp/) for detailed specifications
- Review [AGENTS.md](AGENTS.md) for development conventions

## Development

Want to modify the code?

1. Make your changes
2. Rebuild the affected service:
   ```bash
   make build-web  # or build-bff, build-user, etc.
   ```
3. Restart:
   ```bash
   make restart
   ```

## Stopping Everything

```bash
# Stop services (keeps data)
make down

# Stop and remove all data
make clean
```

## Need Help?

Run `make help` to see all available commands.

