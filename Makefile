# Makefile for development convenience
.PHONY: up down re logs logs-frontend logs-backend ps clean restart-frontend restart-backend frontend-dev help

.DEFAULT_GOAL := up

DC := docker compose

up:
	$(DC) up --build

down:
	$(DC) down

re: down up

logs:
	$(DC) logs -f

logs-frontend:
	$(DC) logs -f frontend

logs-backend:
	$(DC) logs -f backend

ps:
	$(DC) ps

clean:
	$(DC) down --volumes

restart-frontend:
	$(DC) restart frontend

restart-backend:
	$(DC) restart backend

frontend-dev:
	cd srcs/frontend && npm install && npm run dev

help:
	@echo "Available targets:"
	@echo "  make, make up              Start services with 'docker compose up --build' (default)"
	@echo "  make down                 Stop services (docker compose down)"
	@echo "  make re                   Restart (down then up --build)"
	@echo "  make logs                 Follow logs for all services"
	@echo "  make logs-frontend        Follow logs for frontend service"
	@echo "  make logs-backend         Follow logs for backend service"
	@echo "  make ps                   Show running containers (docker compose ps)"
	@echo "  make clean                Stop and remove containers + volumes"
	@echo "  make restart-frontend     Restart the frontend container"
	@echo "  make restart-backend      Restart the backend container"
	@echo "  make frontend-dev         Install frontend deps and start Vite dev server"

