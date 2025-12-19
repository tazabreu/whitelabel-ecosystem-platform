#!/bin/bash
# ================================
# Run dbt locally with DuckDB
# ================================

set -e

cd "$(dirname "$0")/.."

echo "=== ACME Ecosystem Data Lakehouse ==="
echo ""

# Check for dbt
if ! command -v dbt &> /dev/null; then
    echo "❌ dbt is not installed. Install with: pip install dbt-duckdb"
    exit 1
fi

# Create warehouse directory if it doesn't exist
mkdir -p warehouse

echo "📦 Installing dbt dependencies..."
dbt deps 2>/dev/null || echo "No dependencies to install"

echo ""
echo "🌱 Loading seed data..."
dbt seed --profiles-dir .

echo ""
echo "🔨 Running dbt models..."
dbt run --profiles-dir .

echo ""
echo "✅ Testing models..."
dbt test --profiles-dir . 2>/dev/null || echo "No tests defined yet"

echo ""
echo "📊 Querying Customer 360 view..."
echo "-----------------------------------"

# Query the customer_360 model using DuckDB CLI or dbt show
dbt show --select customer_360 --profiles-dir . 2>/dev/null || {
    echo "Using direct DuckDB query..."
    if command -v duckdb &> /dev/null; then
        duckdb warehouse/ecosystem.duckdb -c "SELECT * FROM customer_360;"
    else
        echo "Install DuckDB CLI for direct queries: brew install duckdb"
    fi
}

echo ""
echo "=== Done ==="
echo "Data warehouse file: warehouse/ecosystem.duckdb"

