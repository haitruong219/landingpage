.PHONY: help build up down logs migrate-deploy migrate-dev seed reset

DC = docker-compose
COMPOSE = -f docker-compose.yml

help:
	@echo "Targets: build up down logs migrate-dev migrate-deploy seed reset"
	@echo ""
	@echo "Usage:"
	@echo "  make build          - Build Docker image"
	@echo "  make up             - Start containers"
	@echo "  make down           - Stop containers"
	@echo "  make migrate-dev    - Run dev migrations"
	@echo "  make migrate-deploy - Run production migrations"
	@echo "  make seed           - Run seed script"
	@echo "  make reset          - Reset database"
	@echo "  make logs           - Show logs"

build: ## build app image
	@if [ ! -f .env ]; then \
		echo "Warning: .env file not found. Creating from .env.example..."; \
		cp .env.example .env 2>/dev/null || echo "Please create .env file from .env.example"; \
	fi
	$(DC) $(COMPOSE) build app

up: ## start postgres + app (detached)
	@if [ ! -f .env ]; then \
		echo "Warning: .env file not found. Creating from .env.example..."; \
		cp .env.example .env 2>/dev/null || echo "Please create .env file from .env.example"; \
	fi
	$(DC) $(COMPOSE) up -d
	@echo "Đã start containers. Chờ postgres ready..."

_wait_pg_ready:
	@$(DC) $(COMPOSE) up -d postgres
	@$(DC) $(COMPOSE) exec -T postgres sh -c 'until pg_isready -U "${POSTGRES_USER:-postgres}"; do sleep 1; done'
	@echo "Postgres is ready."

migrate-dev: _wait_pg_ready ## chạy interactive migration (dev)
	@echo "Running: npx prisma migrate dev (inside app container)..."
	@$(DC) $(COMPOSE) exec -u root app npx prisma migrate dev

migrate-deploy: _wait_pg_ready ## chạy production migration non-interactive
	@echo "Running: npx prisma migrate deploy (inside app container)..."
	@$(DC) $(COMPOSE) exec app npx prisma migrate deploy

seed: ## chạy seed script nếu có
	@$(DC) $(COMPOSE) exec app npx prisma db seed

down: ## stop và remove containers (giữ volumes)
	$(DC) $(COMPOSE) down

reset: ## reset db (xóa volumes) và apply migration dev
	$(DC) $(COMPOSE) down -v
	$(DC) $(COMPOSE) up -d postgres
	@$(DC) $(COMPOSE) exec -T postgres sh -c 'until pg_isready -U "${POSTGRES_USER:-postgres}"; do sleep 1; done'
	@$(DC) $(COMPOSE) exec -u root app npx prisma migrate dev --name init --force

logs:
	$(DC) $(COMPOSE) logs -f
