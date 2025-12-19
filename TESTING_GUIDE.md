# Testing Guide

How to test all platform features.

## Prerequisites

Platform must be running:

```bash
make up          # Start all services
make status      # Verify running
make health      # Check health
```

## Step 1: Verify Services

Check that all services are healthy:

```bash
make status      # Should show all services "Up"
make health      # Should show all services "✓ Healthy"
```

Expected output from `make health`:

```
Web Shell:          ✓ Healthy
Web BFF:            ✓ Healthy
User Service:       ✓ Healthy
Credit Card Service:✓ Healthy
Analytics Service:  ✓ Healthy
```

## Step 2: Test Login

Open http://localhost:3000

### Test Case: User Login

1. Username: `user`
2. Password: `user`
3. Click "Login"
4. ✅ Should redirect to dashboard

### Test Case: Admin Login

1. Logout if needed
2. Username: `admin`
3. Password: `admin`
4. Click "Login"
5. ✅ Should redirect to dashboard

### Test Case: Invalid Login

1. Username: `invalid`
2. Password: `wrong`
3. Click "Login"
4. ✅ Should show error "Invalid credentials"

## Step 3: Test Credit Card Offers

Login as `user:user` first.

### Test Case: View Pre-Approved Offer

1. Locate "Pre-Approved Credit Card Offer" widget on dashboard
2. ✅ Should display offer with credit limit (e.g., "$5,000")

### Test Case: Accept Offer

1. Click "Accept Offer"
2. ✅ Digital signature form appears
3. Type: `I agree`
4. Click "Submit"
5. ✅ Success message displays
6. ✅ Widget updates to show credit card details
7. ✅ Available credit is displayed
8. ✅ Transaction history section appears

## Step 4: Test Credit Card Operations

Credit card must be active (accept offer first).

### Test Case: Simulate Purchase

1. Click "Simulate Purchase"
2. ✅ Random purchase amount is deducted
3. ✅ Available credit decreases
4. ✅ Transaction appears in history with timestamp and amount

### Test Case: Multiple Purchases

1. Click "Simulate Purchase" 3-5 times
2. ✅ Each purchase reduces available credit
3. ✅ All transactions listed chronologically
4. ✅ Credit limit remains constant

### Test Case: Raise Credit Limit

1. Click "Raise Limit"
2. ✅ Credit limit increases by $1,000
3. ✅ Available credit increases
4. ✅ Success message displays

### Test Case: Reset Account

1. Click "Reset Account"
2. ✅ Account returns to pre-approved state
3. ✅ Transaction history clears
4. ✅ Widget shows "Accept Offer" again

## Step 5: Test Observability

### Verify Journey Tracking

1. Open browser dev tools (F12)
2. Go to Application/Storage → Session Storage
3. ✅ `journeyId` is stored
4. Perform any action (login, purchase, etc.)
5. Check Network tab
6. ✅ All requests include `X-Journey-Id` header

### View Service Logs

```bash
make logs              # All logs
make logs-web          # Web shell
make logs-bff          # BFF
make logs-user         # User service
make logs-credit-card  # Credit card service
```

✅ Logs should show `journeyId` and `userEcosystemId` in structured format.

## Step 6: Test API Endpoints

### Health Endpoints

```bash
curl http://localhost:8080/health  # Web BFF
curl http://localhost:8081/health  # User Service
curl http://localhost:8082/health  # Credit Card Service
curl http://localhost:8083/health  # Analytics Service
```

✅ All should return 200 OK with health status.

### Example API Call

```bash
curl -X GET http://localhost:8080/api/credit-card/offer \
  -H "X-Journey-Id: test-journey-123" \
  -H "X-User-Ecosystem-Id: user-ecosystem-id-1"
```

✅ Should return JSON with offer details.

## Step 7: Test Database Persistence

### Connect to Databases

```bash
make db-user          # User database
# Run: SELECT * FROM users;

make db-credit-card   # Credit card database
# Run: SELECT * FROM credit_card_accounts;

make db-analytics     # Analytics database
# Run: SELECT * FROM analytics_events LIMIT 10;
```

✅ Should see data from test actions.

## Step 8: Test Event Streaming

### Check Redpanda Topics

```bash
# List topics
docker compose exec redpanda rpk topic list

# Consume analytics events
docker compose exec redpanda rpk topic consume com.ecosystem.analytics.event.recorded --num 10
```

✅ Should see analytics events in Kafka format.

## Step 9: Test Feature Flags

### Disable Credit Card Offers

1. Edit `.env`:
   ```
   CREDIT_CARDS_PRE_APPROVED_OFFERS=false
   ```
2. Restart: `make restart`
3. Refresh browser
4. ✅ Credit card widget should not appear

### Re-enable Feature

1. Set `CREDIT_CARDS_PRE_APPROVED_OFFERS=true`
2. Restart: `make restart`
3. ✅ Widget should reappear

## Test Checklist

Use this checklist to track your testing:

- [ ] All services running and healthy
- [ ] User login works (`user:user`)
- [ ] Admin login works (`admin:admin`)
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

## Troubleshooting

### Services Not Starting

```bash
make logs        # Check for errors
make rebuild     # Rebuild from scratch
make up          # Try again
```

### Database Connection Issues

```bash
docker compose ps | grep postgres    # Check DB health
docker compose restart postgres-*    # Restart all DBs
```

### Port Conflicts

```bash
lsof -i :3000    # Check what's using port 3000 (or other ports)
# Stop conflicting service or change port in docker-compose.yml
```

### Clean Slate

```bash
make clean-all   # Remove everything
make up          # Start fresh
```

## Success Criteria

✅ **All tests pass** = Platform is working correctly!

## Next Steps

- Build additional features
- Experiment with the architecture
- Practice AI-first development
- Add more products to the platform
- Explore observability in Splunk (if configured)

## Getting Help

```bash
make help        # See all commands
make status      # Check service status
make logs        # View logs
make health      # Run health check
```

See also:
- [QUICK_START.md](QUICK_START.md) - Getting started
- [DOCKER.md](DOCKER.md) - Docker reference
- [GETTING_STARTED.md](GETTING_STARTED.md) - Feature walkthrough
- [README.md](README.md) - Architecture overview
