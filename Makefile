.PHONY: help up down build rebuild logs clean status ps test

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ General

help: ## Display this help screen
	@echo "$(BLUE)ACME Ecosystem Platform - Make Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

up: ## Start all services (build if needed)
	@echo "$(GREEN)🚀 Starting ACME Ecosystem Platform...$(NC)"
	@docker compose up -d --build
	@echo "$(GREEN)✅ Services started!$(NC)"
	@echo ""
	@echo "$(YELLOW)⏳ Waiting for services to be ready (this may take 1-2 minutes)...$(NC)"
	@./scripts/wait-for-services.sh || true
	@echo ""
	@$(MAKE) status

down: ## Stop all services
	@echo "$(RED)🛑 Stopping ACME Ecosystem Platform...$(NC)"
	@docker compose down
	@echo "$(GREEN)✅ Services stopped!$(NC)"

restart: down up ## Restart all services

##@ Building

build: ## Build all services without starting
	@echo "$(BLUE)🔨 Building all services...$(NC)"
	@docker compose build

rebuild: ## Rebuild all services from scratch (no cache)
	@echo "$(BLUE)🔨 Rebuilding all services (no cache)...$(NC)"
	@docker compose build --no-cache

build-web: ## Build only web shell
	@echo "$(BLUE)🔨 Building web shell...$(NC)"
	@docker compose build web-shell

build-bff: ## Build only Web BFF
	@echo "$(BLUE)🔨 Building Web BFF...$(NC)"
	@docker compose build web-bff

build-user: ## Build only User service
	@echo "$(BLUE)🔨 Building User service...$(NC)"
	@docker compose build user-service

build-credit-card: ## Build only Credit Card service
	@echo "$(BLUE)🔨 Building Credit Card service...$(NC)"
	@docker compose build credit-card-service

build-analytics: ## Build only Analytics service
	@echo "$(BLUE)🔨 Building Analytics service...$(NC)"
	@docker compose build analytics-service

##@ Monitoring

wait: ## Wait for all services to be healthy
	@./scripts/wait-for-services.sh

logs: ## View logs from all services
	@docker compose logs -f

logs-web: ## View logs from web shell
	@docker compose logs -f web-shell

logs-bff: ## View logs from Web BFF
	@docker compose logs -f web-bff

logs-user: ## View logs from User service
	@docker compose logs -f user-service

logs-credit-card: ## View logs from Credit Card service
	@docker compose logs -f credit-card-service

logs-analytics: ## View logs from Analytics service
	@docker compose logs -f analytics-service

logs-infra: ## View logs from infrastructure (DBs, Kafka, etc)
	@docker compose logs -f postgres-user postgres-credit-card postgres-analytics redpanda otel-collector

status: ## Show service status
	@echo "$(BLUE)📊 Service Status:$(NC)"
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

ps: status ## Alias for status

health: ## Check health of all services
	@echo "$(BLUE)🏥 Health Check:$(NC)"
	@echo ""
	@echo -n "Web Shell:          "
	@curl -sf http://localhost:3000 > /dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "Web BFF:            "
	@curl -sf http://localhost:8080/health > /dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "User Service:       "
	@curl -sf http://localhost:8081/health > /dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "Credit Card Service:"
	@curl -sf http://localhost:8082/health > /dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "Analytics Service:  "
	@curl -sf http://localhost:8083/health > /dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"

##@ Cleanup

clean: down ## Stop services and remove volumes (⚠️ deletes all data)
	@echo "$(RED)🗑️  Removing all volumes (this will delete all data)...$(NC)"
	@docker compose down -v
	@echo "$(GREEN)✅ Cleanup complete!$(NC)"

clean-all: clean ## Stop services, remove volumes and images
	@echo "$(RED)🗑️  Removing all images...$(NC)"
	@docker compose down -v --rmi all
	@echo "$(GREEN)✅ Full cleanup complete!$(NC)"

prune: ## Remove all unused Docker resources
	@echo "$(YELLOW)⚠️  This will remove all unused Docker containers, networks, and images$(NC)"
	@echo "Press Ctrl+C to cancel or Enter to continue..."
	@read
	@docker system prune -af --volumes
	@echo "$(GREEN)✅ Docker pruned!$(NC)"

##@ Testing

test: ## Run all tests
	@echo "$(BLUE)🧪 Running tests...$(NC)"
	@echo "TODO: Implement test suite"

test-e2e: ## Run E2E tests with Playwright
	@echo "$(BLUE)🧪 Running E2E tests...$(NC)"
	@cd platform/shells/web && npm test

##@ Database

db-user: ## Connect to User database
	@docker compose exec postgres-user psql -U user -d user_db

db-credit-card: ## Connect to Credit Card database
	@docker compose exec postgres-credit-card psql -U user -d credit_card_db

db-analytics: ## Connect to Analytics database
	@docker compose exec postgres-analytics psql -U user -d analytics_db

##@ Development Tools

shell-web: ## Open shell in web container
	@docker compose exec web-shell sh

shell-bff: ## Open shell in BFF container
	@docker compose exec web-bff sh

shell-user: ## Open shell in User service container
	@docker compose exec user-service sh

shell-credit-card: ## Open shell in Credit Card service container
	@docker compose exec credit-card-service sh

shell-analytics: ## Open shell in Analytics service container
	@docker compose exec analytics-service sh

##@ Quick Actions

dev: up ## Quick start for development (alias for 'up')

stop: down ## Quick stop (alias for 'down')

nuke: clean-all ## Nuclear option - remove everything (alias for 'clean-all')

