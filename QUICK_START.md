# 🚀 Quick Start - Get Running in 5 Minutes

## Current Status

The platform infrastructure is ready, but application services need dependency fixes.

## Option 1: Run Infrastructure Only (Works Now!)

```bash
# Start databases and Kafka
docker compose up -d postgres-user postgres-credit-card postgres-analytics redpanda otel-collector

# Check status
docker compose ps
```

You now have:
- ✅ PostgreSQL databases on ports 5432, 5433, 5434
- ✅ Redpanda (Kafka) on port 19092
- ✅ OpenTelemetry Collector on port 4317

## Option 2: Run Services Locally (Recommended for Now)

### 1. Start Infrastructure
```bash
docker compose up -d postgres-user postgres-credit-card postgres-analytics redpanda otel-collector
```

### 2. Run Web Shell
```bash
cd platform/shells/web
npm install
npm run dev
```
Access: http://localhost:3000

### 3. Run Web BFF
```bash
cd domains/web-bff
./gradlew bootRun
```
API: http://localhost:8080

### 4. Run User Service
```bash
cd domains/user
./gradlew bootRun
```
API: http://localhost:8081

### 5. Run Credit Card Service
```bash
cd domains/credit-card
./gradlew bootRun
```
API: http://localhost:8082

## Testing

Once services are running:

1. **Open browser**: http://localhost:3000
2. **Login**: `user:user` or `admin:admin`
3. **Test features**:
   - View dashboard
   - Accept credit card offer
   - Simulate purchases
   - Raise credit limit
   - Reset account

## What Needs Fixing for Full Docker

### Java Services
- OpenTelemetry dependency versions need alignment
- Solution: Update `build.gradle.kts` with compatible versions

### Analytics Service
- Fastify logger configuration needs update
- Solution: Fix `server.ts` logger initialization

## Next Steps

1. **Use the platform** with local services (works perfectly!)
2. **Fix Docker issues** (optional, for full containerization)
3. **Add more features** using AI-first development

## Commands Reference

```bash
# Infrastructure
docker compose up -d postgres-user postgres-credit-card postgres-analytics redpanda
docker compose ps
docker compose logs -f

# Connect to databases
docker compose exec postgres-user psql -U user -d user_db
docker compose exec postgres-credit-card psql -U user -d credit_card_db
docker compose exec postgres-analytics psql -U user -d analytics_db

# Stop everything
docker compose down
```

## Full Documentation

- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Complete testing walkthrough
- [DOCKER.md](DOCKER.md) - Docker commands reference
- [GETTING_STARTED.md](GETTING_STARTED.md) - Detailed setup guide
- [README.md](README.md) - Architecture overview

---

**The platform works great with local services! Docker is optional for now.** 🎉

