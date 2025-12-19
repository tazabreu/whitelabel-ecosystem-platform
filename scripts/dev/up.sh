#!/bin/bash
# ================================
# Start ACME Ecosystem Development Environment
# ================================

set -e

cd "$(dirname "$0")/../.."

echo "🚀 Starting ACME Ecosystem Development Environment"
echo ""

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
fi

echo "📦 Starting infrastructure services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check service health
echo ""
echo "🔍 Checking service health..."

# Check Postgres
docker compose exec -T postgres-user pg_isready -U postgres > /dev/null 2>&1 && echo "  ✓ User DB (Postgres)" || echo "  ✗ User DB (Postgres)"
docker compose exec -T postgres-credit-card pg_isready -U postgres > /dev/null 2>&1 && echo "  ✓ Credit Card DB (Postgres)" || echo "  ✗ Credit Card DB (Postgres)"
docker compose exec -T postgres-analytics pg_isready -U postgres > /dev/null 2>&1 && echo "  ✓ Analytics DB (Postgres)" || echo "  ✗ Analytics DB (Postgres)"

# Check Redpanda
docker compose exec -T redpanda rpk cluster health > /dev/null 2>&1 && echo "  ✓ Redpanda (Kafka)" || echo "  ✗ Redpanda (Kafka)"

# Check OTEL Collector
curl -s http://localhost:13133/health > /dev/null 2>&1 && echo "  ✓ OTEL Collector" || echo "  ✗ OTEL Collector"

echo ""
echo "📋 Creating Redpanda topics..."
./scripts/redpanda/create-topics.sh 2>/dev/null || echo "  (topics may already exist)"

echo ""
echo "==================================="
echo "✅ Infrastructure is ready!"
echo ""
echo "Next steps:"
echo "  1. Start the web shell:"
echo "     cd platform/shells/web && npm install && npm run dev"
echo ""
echo "  2. Start Java services (in separate terminals):"
echo "     cd domains/web-bff && ./gradlew bootRun"
echo "     cd domains/user && ./gradlew bootRun"
echo "     cd domains/credit-card && ./gradlew bootRun"
echo ""
echo "  3. Start Analytics service:"
echo "     cd domains/analytics && npm install && npm run dev"
echo ""
echo "  4. Open http://localhost:3000"
echo "==================================="

