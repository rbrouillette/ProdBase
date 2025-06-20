# Makefile for ProdBase SaaS platform

ENV_FILE=.env
COMPOSE=docker-compose

.PHONY: help build up down restart logs shell clean prune

help:
	@echo "Makefile commands:"
	@echo "  make build      - Build all Docker containers"
	@echo "  make up         - Start containers in detached mode"
	@echo "  make down       - Stop containers"
	@echo "  make restart    - Restart containers"
	@echo "  make logs       - View logs for all services"
	@echo "  make shell      - Enter the backend container shell"
	@echo "  make clean      - Remove stopped containers"
	@echo "  make prune      - Remove all containers, volumes, networks (DANGER)"

build:
	$(COMPOSE) --env-file $(ENV_FILE) build

up:
	$(COMPOSE) --env-file $(ENV_FILE) up -d

down:
	$(COMPOSE) --env-file $(ENV_FILE) down

restart: down up

logs:
	$(COMPOSE) --env-file $(ENV_FILE) logs -f

shell:
	$(COMPOSE) exec backend /bin/sh

clean:
	docker container prune -f

prune:
	docker system prune -a --volumes -f
init:
	@if [ ! -f .env ]; then \
		cp .env.template .env && \
		echo "✅ .env created from .env.template"; \
	else \
		echo "⚠️  .env already exists. Skipping."; \
	fi
reset-env:
	@rm -f .env && cp .env.template .env && echo "🔁 Reset .env from template"
seed-db:
	$(COMPOSE) exec backend npm run seed
psql:
	$(COMPOSE) exec db psql -U $$POSTGRES_USER -d $$POSTGRES_DB
restart-db:
	$(COMPOSE) restart db
.PHONY: help build up down restart logs shell clean prune init reset-env seed-db psql restart-db
