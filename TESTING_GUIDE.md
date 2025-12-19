# 🧪 Testing Guide - ACME Ecosystem Platform

This guide walks you through testing the entire platform running in Docker containers.

## Prerequisites

- Docker Desktop running
- All services built and started with `make up`

## Step 1: Verify All Services are Running

```bash
# Check service status
make status

# Or use Docker directly
docker compose ps
```

You should see all services with status "Up" and "healthy":
- postgres-user
- postgres-credit-card
- postgres-analytics
- redpanda
- otel-collector
- user-service
- credit-card-service
- analytics-service
- web-bff
- web-shell

## Step 2: Check Service Health

```bash
# Run health check on all services
make health
```

Expected output:
```
Web Shell:          ✓ Healthy
Web BFF:            ✓ Healthy
User Service:       ✓ Healthy
Credit Card Service:✓ Healthy
Analytics Service:  ✓ Healthy
```

## Step 3: Access the Web Application

1. Open your browser
2. Navigate to: **http://localhost:3000**
3. You should see the login page

## Step 4: Test Login Flow

### Test Case 1: Regular User Login
1. **Username**: `user`
2. **Password**: `user`
3. Click "Login"
4. ✅ **Expected**: Redirect to dashboard

### Test Case 2: Admin User Login
1. Logout (if logged in)
2. **Username**: `admin`
3. **Password**: `admin`
4. Click "Login"
5. ✅ **Expected**: Redirect to dashboard

### Test Case 3: Invalid Credentials
1. **Username**: `invalid`
2. **Password**: `wrong`
3. Click "Login"
4. ✅ **Expected**: Error message "Invalid credentials"

## Step 5: Test Credit Card Offer Widget

### Prerequisites
- Logged in as `user:user`
- Feature flag `CREDIT_CARDS_PRE_APPROVED_OFFERS` is enabled (default)

### Test Case 1: View Pre-Approved Offer
1. On the dashboard, locate the "Pre-Approved Credit Card Offer" widget
2. ✅ **Expected**: See offer details with credit limit (e.g., "$5,000")

### Test Case 2: Accept Offer
1. Click "Accept Offer" button
2. ✅ **Expected**: See digital signature form
3. Type: `I agree`
4. Click "Submit"
5. ✅ **Expected**: 
   - Success message
   - Widget updates to show credit card details
   - Available credit displayed
   - Transaction history section appears

## Step 6: Test Credit Card Operations

### Test Case 1: Simulate Purchase
1. Click "Simulate Purchase" button
2. ✅ **Expected**:
   - Random purchase amount deducted
   - Available credit decreases
   - Transaction appears in history
   - Transaction shows timestamp and amount

### Test Case 2: Multiple Purchases
1. Click "Simulate Purchase" 3-5 times
2. ✅ **Expected**:
   - Each purchase reduces available credit
   - All transactions listed in chronological order
   - Credit limit remains constant

### Test Case 3: Raise Credit Limit
1. Click "Raise Limit" button
2. ✅ **Expected**:
   - Credit limit increases by $1,000
   - Available credit increases accordingly
   - Success message displayed

### Test Case 4: Reset Account
1. Click "Reset Account" button
2. ✅ **Expected**:
   - Account returns to pre-approved state
   - Transaction history clears
   - Widget shows "Accept Offer" again

## Step 7: Test End-to-End Observability

### Verify Journey Tracking
1. Open browser developer tools (F12)
2. Go to Application/Storage → Session Storage
3. ✅ **Expected**: See `journeyId` stored
4. Perform any action (login, purchase, etc.)
5. Check Network tab
6. ✅ **Expected**: All requests include `X-Journey-Id` header

### View Service Logs
```bash
# View all logs
make logs

# View specific service logs
make logs-web
make logs-bff
make logs-user
make logs-credit-card
make logs-analytics
```

✅ **Expected**: Logs show `journeyId` and `userEcosystemId` in structured format

## Step 8: Test API Endpoints Directly

### Health Endpoints
```bash
# Web BFF
curl http://localhost:8080/health

# User Service
curl http://localhost:8081/health

# Credit Card Service
curl http://localhost:8082/health

# Analytics Service
curl http://localhost:8083/health
```

✅ **Expected**: All return 200 OK with health status

### Credit Card Offer API
```bash
# Get pre-approved offer (requires auth token)
curl -X GET http://localhost:8080/api/credit-card/offer \
  -H "X-Journey-Id: test-journey-123" \
  -H "X-User-Ecosystem-Id: user-ecosystem-id-1"
```

✅ **Expected**: JSON response with offer details

## Step 9: Test Database Persistence

### Connect to Databases
```bash
# User database
make db-user
# Run: SELECT * FROM users;

# Credit Card database
make db-credit-card
# Run: SELECT * FROM credit_card_accounts;

# Analytics database
make db-analytics
# Run: SELECT * FROM analytics_events LIMIT 10;
```

✅ **Expected**: See data from your test actions

## Step 10: Test Event Streaming

### Check Redpanda Topics
```bash
# Access Redpanda container
docker compose exec redpanda rpk topic list

# Consume analytics events
docker compose exec redpanda rpk topic consume com.ecosystem.analytics.event.recorded --num 10
```

✅ **Expected**: See analytics events in Kafka format

## Step 11: Performance Testing

### Concurrent Users
```bash
# Install Apache Bench (if not installed)
# brew install httpd (macOS)

# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json http://localhost:8080/api/user/session/login
```

Where `login.json` contains:
```json
{"username":"user","password":"user"}
```

✅ **Expected**: All requests succeed with reasonable response times

## Step 12: Test Feature Flags

### Disable Credit Card Offer
1. Edit `.env` file:
   ```
   CREDIT_CARDS_PRE_APPROVED_OFFERS=false
   ```
2. Restart services:
   ```bash
   make restart
   ```
3. Refresh browser
4. ✅ **Expected**: Credit card widget no longer appears

### Re-enable Feature
1. Set `CREDIT_CARDS_PRE_APPROVED_OFFERS=true`
2. Restart services
3. ✅ **Expected**: Widget reappears

## Troubleshooting

### Services Not Starting
```bash
# Check logs for errors
make logs

# Rebuild specific service
make build-web  # or build-bff, build-user, etc.
make restart
```

### Database Connection Issues
```bash
# Check database health
docker compose ps | grep postgres

# Restart databases
docker compose restart postgres-user postgres-credit-card postgres-analytics
```

### Port Conflicts
```bash
# Check what's using a port
lsof -i :3000  # or :8080, :8081, etc.

# Stop conflicting service or change port in docker-compose.yml
```

### Clean Slate
```bash
# Nuclear option - remove everything and start fresh
make clean-all
make up
```

## Test Checklist

- [ ] All services running and healthy
- [ ] Login with user:user works
- [ ] Login with admin:admin works
- [ ] Invalid login shows error
- [ ] Credit card offer visible
- [ ] Can accept offer with signature
- [ ] Can simulate purchases
- [ ] Can raise credit limit
- [ ] Can reset account
- [ ] Journey ID propagates through requests
- [ ] Logs show structured data with correlation IDs
- [ ] Database contains test data
- [ ] Kafka events are published
- [ ] Feature flags work
- [ ] API endpoints respond correctly

## Success Criteria

✅ **All tests pass** = Platform is working correctly!

## Next Steps

- Try building additional features
- Experiment with the architecture
- Add more products to the platform
- Practice AI-first development
- Explore observability in Splunk (if configured)

## Getting Help

- Check logs: `make logs`
- View status: `make status`
- Run health check: `make health`
- See all commands: `make help`

---

**Happy Testing! 🎉**

