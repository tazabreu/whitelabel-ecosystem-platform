# Getting Started

This guide walks you through using the platform's features once it's running.

**First time?** Start here: [QUICK_START.md](QUICK_START.md)

## Features to Try

### 1. Login

Navigate to http://localhost:3000

**Test credentials:**
- Regular user: `user:user`
- Admin user: `admin:admin`

### 2. Credit Card Pre-Approved Offer

Once logged in as `user:user`:

1. View the "Pre-Approved Credit Card Offer" widget on your dashboard
2. See your pre-approved credit limit (e.g., $5,000)
3. Click **"Accept Offer"**
4. Sign the digital agreement by typing `I agree`
5. Click **"Submit"**

The widget updates to show your active credit card with available credit.

### 3. Simulate Purchases

With an active credit card:

1. Click **"Simulate Purchase"**
2. A random purchase amount is charged
3. Your available credit decreases
4. Transaction appears in your history

Try multiple purchases to see your credit limit being used.

### 4. Raise Credit Limit

1. Click **"Raise Limit"**
2. Your credit limit increases by $1,000
3. Your available credit increases accordingly

### 5. Reset Account

Start fresh by clicking **"Reset Account"**. This returns your account to the pre-approved offer state.

## Exploring the Platform

### API Endpoints

All services expose health endpoints:

```bash
curl http://localhost:8080/health  # Web BFF
curl http://localhost:8081/health  # User Service
curl http://localhost:8082/health  # Credit Card Service
curl http://localhost:8083/health  # Analytics Service
```

### Database Access

Connect to databases:

```bash
make db-user          # User database
make db-credit-card   # Credit card database
make db-analytics     # Analytics database
```

### Event Streaming

Check Redpanda topics and consume events:

```bash
# List topics
docker compose exec redpanda rpk topic list

# Consume analytics events
docker compose exec redpanda rpk topic consume com.ecosystem.analytics.event.recorded --num 10
```

### Observability

The platform uses OpenTelemetry for distributed tracing:

1. Open browser dev tools (F12)
2. Check Network tab for API calls
3. Look for `X-Journey-Id` header in requests
4. Check `X-User-Ecosystem-Id` for user tracking

View logs with correlation IDs:

```bash
make logs        # All services
make logs-bff    # Specific service
```

## Feature Flags

Feature flags control what's enabled. Edit `.env`:

```bash
# Disable credit card offers
CREDIT_CARDS_PRE_APPROVED_OFFERS=false

# Restart to apply
make restart
```

The credit card widget disappears from the dashboard.

## Development

### Making Code Changes

1. Edit code in `platform/shells/web/`, `domains/web-bff/`, etc.
2. Rebuild affected service:
   ```bash
   make build-web    # Web shell
   make build-bff    # Web BFF
   make build-user   # User service
   # etc.
   ```
3. Restart services:
   ```bash
   make restart
   ```
4. Check logs:
   ```bash
   make logs-web     # Specific service
   make logs         # All services
   ```

### Running Tests

```bash
# Web shell tests (from platform/shells/web/)
npm test

# E2E tests
npm run test:e2e
```

## Next Steps

- **Architecture:** Read [README.md](README.md) for system design and learning objectives
- **Docker Reference:** See [DOCKER.md](DOCKER.md) for complete Docker commands
- **Testing:** Follow [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing
- **Development:** Review [AGENTS.md](AGENTS.md) for coding conventions

## Troubleshooting

**Services not responding?**
```bash
make status    # Check running services
make health    # Check health endpoints
make logs      # View error logs
```

**Need a fresh start?**
```bash
make clean     # Remove all data
make up        # Start fresh
```

**See all commands:**
```bash
make help
```

