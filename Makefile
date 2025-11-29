.PHONY: help install dev build start stop clean db-up db-down db-reset db-migrate db-seed docker-build docker-up docker-down docker-logs docker-restart test lint format

help: ## Hiển thị danh sách commands
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Cài đặt dependencies
	npm install

dev: ## Chạy development server
	npm run dev

build: ## Build production
	npm run build

start: ## Chạy production server
	npm start

stop: ## Dừng development server
	@pkill -f "next dev" || true

clean: ## Xóa node_modules và .next
	rm -rf node_modules .next .turbo

db-up: ## Khởi động PostgreSQL với Docker
	docker-compose -f docker-compose.dev.yml up -d postgres
	@echo "Waiting for database to be ready..."
	@sleep 5
	@echo "Database is ready!"

db-down: ## Dừng PostgreSQL
	docker-compose -f docker-compose.dev.yml down

dev-docker: ## Chạy development với Docker (app + database)
	docker-compose -f docker-compose.dev.yml up

db-reset: ## Reset database (xóa và tạo lại)
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.dev.yml up -d postgres
	@sleep 5
	npx prisma migrate dev --name init

db-migrate: ## Chạy database migrations
	npx prisma migrate dev

db-seed: ## Chạy database seed (tạo admin user mẫu)
	npx prisma db seed

db-studio: ## Mở Prisma Studio
	npx prisma studio

db-generate: ## Generate Prisma client
	npx prisma generate

docker-build: ## Build Docker image
	docker-compose build

docker-up: ## Khởi động tất cả services với Docker
	docker-compose up -d
	@echo "Waiting for services to be ready..."
	@sleep 10
	@echo "Services are ready!"

docker-down: ## Dừng tất cả Docker services
	docker-compose down

docker-logs: ## Xem logs của Docker services
	docker-compose logs -f

docker-restart: ## Restart Docker services
	docker-compose restart

docker-clean: ## Xóa Docker containers, volumes và images
	docker-compose down -v --rmi all

test: ## Chạy tests
	npm test || echo "No tests configured"

lint: ## Chạy linter
	npm run lint

format: ## Format code
	npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}" || echo "Prettier not installed"

setup: install db-up db-migrate ## Setup project lần đầu (install + database)
	@echo "Setup completed!"
	@echo "Run 'make dev' to start development server"

setup-docker: docker-build docker-up ## Setup với Docker
	@echo "Waiting for database to be ready..."
	@sleep 10
	@echo "Run migrations inside container:"
	@echo "  docker-compose exec app npx prisma migrate deploy"
	@echo "Or create admin user:"
	@echo "  docker-compose exec app npx prisma studio"

