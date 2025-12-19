# Data Lakehouse - Customer 360

This module implements a Customer 360 view using dbt + DuckDB for local development, with a clear migration path to BigQuery for production.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Source Systems                               │
├─────────────────────────────────────────────────────────────────┤
│  Analytics DB     │  Credit Card DB   │  User DB                │
└────────┬──────────┴────────┬──────────┴────────┬────────────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Staging Layer                                 │
│  stg_analytics_events  │  (future: stg_credit_cards, etc.)     │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Marts Layer                                  │
│                    customer_360                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Local Development

### Prerequisites

- Python 3.11+
- dbt-duckdb (`pip install dbt-duckdb`)

### Running Locally

```bash
cd domains/data-lakehouse
./scripts/run-local.sh
```

This will:
1. Load sample seed data
2. Run dbt models
3. Query the Customer 360 view

### Manual Commands

```bash
# Install dependencies
dbt deps --profiles-dir .

# Load seed data
dbt seed --profiles-dir .

# Run all models
dbt run --profiles-dir .

# Run tests
dbt test --profiles-dir .

# Generate documentation
dbt docs generate --profiles-dir .
dbt docs serve --profiles-dir .
```

## BigQuery Migration

To migrate to BigQuery:

1. **Install BigQuery adapter**:
   ```bash
   pip install dbt-bigquery
   ```

2. **Update profiles.yml**:
   ```yaml
   ecosystem_lakehouse:
     target: bigquery
     outputs:
       bigquery:
         type: bigquery
         method: service-account
         project: your-gcp-project
         dataset: ecosystem_lakehouse
         threads: 4
         keyfile: /path/to/service-account.json
         location: US
   ```

3. **Update source definitions** in `models/sources.yml` to point to BigQuery datasets

4. **Run dbt**:
   ```bash
   dbt run --target bigquery
   ```

## Customer 360 Schema

The `customer_360` model provides:

| Column | Description |
|--------|-------------|
| `user_ecosystem_id` | Unique user identifier |
| `total_journeys` | Number of distinct journeys |
| `total_events` | Total events across all journeys |
| `first_seen_at` | First activity timestamp |
| `last_seen_at` | Last activity timestamp |
| `avg_events_per_journey` | Average events per journey |
| `user_domain_events` | Events from user domain |
| `credit_card_domain_events` | Events from credit card domain |
| `total_purchases` | Number of purchase simulations |
| `limit_raises` | Number of limit increases |
| `has_credit_card` | Whether user has onboarded |

## Data Mesh Principles

This implementation follows DDIA and Data Mesh principles:

1. **Domain Ownership**: Each domain owns its data and exports to the lakehouse
2. **Data as a Product**: Customer 360 is a curated data product with clear schema
3. **Self-Serve Platform**: dbt provides a self-serve transformation layer
4. **Federated Governance**: Event schemas are defined in `shared/contracts/`

