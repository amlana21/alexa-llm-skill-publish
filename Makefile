.PHONY: build up down logs health dev shell tunnel \
        rs-build rs-up rs-down rs-logs rs-health rs-shell rs-dev rs-tunnel \
        ingest-run ingest-dev



# ── Retrieval service (port 8001) ────────────────────────────────────────────
rs-build:
	docker compose -f retrieval-service/docker-compose.yml build

rs-up:
	docker compose -f retrieval-service/docker-compose.yml up -d

rs-down:
	docker compose -f retrieval-service/docker-compose.yml down

rs-logs:
	docker compose -f retrieval-service/docker-compose.yml logs -f retrieval-service

rs-health:
	curl -s http://localhost:8001/health | python3 -m json.tool

rs-shell:
	docker compose -f retrieval-service/docker-compose.yml exec retrieval-service /bin/bash

rs-dev:
	cd retrieval-service && source .venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8001 --reload

rs-tunnel:
	ngrok http 8001

# ── Ingestion service ────────────────────────────────────────────────────────
ingest-run:
	cd ingestion && source .venv/bin/activate && python ingest.py
