#!/bin/bash
# Wait for all services to be healthy

set -e

echo "⏳ Waiting for services to be healthy..."

services=(
  "http://localhost:8080/health:Web BFF"
  "http://localhost:8081/health:User Service"
  "http://localhost:8082/health:Credit Card Service"
  "http://localhost:8083/health:Analytics Service"
  "http://localhost:3000:Web Shell"
)

max_attempts=60
attempt=0

all_healthy=false

while [ $attempt -lt $max_attempts ] && [ "$all_healthy" = false ]; do
  all_healthy=true
  
  for service in "${services[@]}"; do
    url="${service%%:*}"
    name="${service##*:}"
    
    if ! curl -sf "$url" > /dev/null 2>&1; then
      all_healthy=false
      echo "⏳ Waiting for $name..."
      break
    fi
  done
  
  if [ "$all_healthy" = false ]; then
    sleep 2
    ((attempt++))
  fi
done

if [ "$all_healthy" = true ]; then
  echo "✅ All services are healthy!"
  echo ""
  echo "🌐 Web Application: http://localhost:3000"
  echo "🔐 Login: user:user or admin:admin"
  exit 0
else
  echo "❌ Timeout waiting for services to be healthy"
  echo "Run 'make logs' to see what went wrong"
  exit 1
fi

