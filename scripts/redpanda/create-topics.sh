#!/bin/bash
# ================================
# Create Redpanda Topics for ACME Ecosystem
# ================================
# Run after Redpanda is started via docker-compose

set -e

REDPANDA_BROKERS="${KAFKA_BROKERS:-localhost:9092}"
ENV="${DEPLOYMENT_ENVIRONMENT:-local}"

echo "Creating Redpanda topics for environment: $ENV"
echo "Broker: $REDPANDA_BROKERS"

# Topic naming convention: ecosystem.{env}.{domain}.{entity}.{action}
# See research.md for full naming conventions

TOPICS=(
    # Analytics domain events
    "ecosystem.${ENV}.analytics.event.recorded"
    
    # Credit Card domain events
    "ecosystem.${ENV}.credit-card.offer.viewed"
    "ecosystem.${ENV}.credit-card.onboarding.signed"
    "ecosystem.${ENV}.credit-card.purchase.simulated"
    "ecosystem.${ENV}.credit-card.limit.raised"
    "ecosystem.${ENV}.credit-card.account.reset"
    
    # User domain events
    "ecosystem.${ENV}.user.session.created"
    "ecosystem.${ENV}.user.session.ended"
)

for topic in "${TOPICS[@]}"; do
    echo "Creating topic: $topic"
    docker exec ecosystem-redpanda rpk topic create "$topic" \
        --brokers "$REDPANDA_BROKERS" \
        --partitions 3 \
        --replicas 1 \
        2>/dev/null || echo "  Topic $topic already exists or creation failed"
done

echo ""
echo "Listing all topics:"
docker exec ecosystem-redpanda rpk topic list --brokers "$REDPANDA_BROKERS"

echo ""
echo "Topic creation complete!"

