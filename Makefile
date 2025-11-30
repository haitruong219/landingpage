.PHONY: help up down logs install migrate

help:
	@echo "Commands:"
	@echo "  make install - Install dependencies locally"
	@echo "  make up      - Start containers (postgres + app)"
	@echo "  make down    - Stop containers"
	@echo "  make logs    - Show logs"
	@echo "  make migrate - Run database migrations"

install:
	@if [ ! -f package.json ]; then \
		echo "Error: package.json not found!"; \
		exit 1; \
	fi
	@echo "Installing dependencies..."
	npm install --legacy-peer-deps
	@echo "Generating Prisma client..."
	npx prisma generate
	@echo "Dependencies installed successfully!"

up: install
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env 2>/dev/null || touch .env; \
	fi
	@if [ ! -d node_modules ]; then \
		echo "Error: node_modules not found! Run 'make install' first."; \
		exit 1; \
	fi
	@if [ ! -f next-env.d.ts ]; then \
		echo "Creating next-env.d.ts..."; \
		touch next-env.d.ts; \
	fi
	@export UID=$$(id -u) GID=$$(id -g) && \
	docker-compose build app && \
	docker-compose up -d
	@echo "Waiting for services to be ready..."
	@sleep 5
	@echo "App is running at http://localhost:3000"

down:
	docker-compose down

logs:
	docker-compose logs -f

migrate:
	@if ! docker-compose ps | grep -q "landingpage_app.*Up"; then \
		echo "Error: App container is not running. Run 'make up' first."; \
		exit 1; \
	fi
	@echo "Running database migrations..."
	docker-compose exec app npx prisma migrate dev
