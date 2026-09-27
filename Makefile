.PHONY: help install backend frontend test lint run

help:
	@echo "PRALAYA Disaster Intelligence Platform"
	@echo "Available commands:"
	@echo "  make install   - Install backend and frontend dependencies"
	@echo "  make backend   - Run FastAPI backend development server"
	@echo "  make frontend  - Run React Vite development server"
	@echo "  make test      - Run all backend and frontend tests"
	@echo "  make lint      - Run code formatters and linters"

install:
	cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt
	cd frontend && npm install

backend:
	cd backend && .venv/bin/python run.py

frontend:
	cd frontend && npm run dev

test:
	pytest tests/backend -v
	cd frontend && npm run build
