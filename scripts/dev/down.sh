#!/bin/bash
# ================================
# Stop ACME Ecosystem Development Environment
# ================================

set -e

cd "$(dirname "$0")/../.."

echo "🛑 Stopping ACME Ecosystem Development Environment"
echo ""

docker compose down

echo ""
echo "✅ All services stopped."
echo ""
echo "To remove volumes (data), run:"
echo "  docker compose down -v"

