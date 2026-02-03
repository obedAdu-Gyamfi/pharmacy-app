# Developer Guide

## Architecture Overview

- Backend: FastAPI + SQLAlchemy + MySQL
- Frontend: React (Vite) + TypeScript + Tailwind CSS
- Auth: JWT-based login with role claim

## Repository Layout

- `app/` — backend FastAPI app and models
- `pharmacy-ui/` — frontend React app
- `sql/` — SQL schema and database scripts
- `docker-compose.yml` — local stack for app + MySQL

## Local Setup (No Docker)

### Prerequisites

- Python 3.12
- Node.js 18+
- MySQL 8

### Backend

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r app/requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

```bash
cd pharmacy-ui
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and expects the backend at `http://localhost:8000`.

## Local Setup (Docker)

```bash
cp .env.example .env
# Update values if needed

docker compose up --build -d
```

## Environment Variables

Core variables:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `SECRET_KEY` for JWT signing

Password reset email:

- `SMTP_HOST`
- `SMTP_PORT` (default `587`)
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_SENDER`
- `FRONTEND_BASE_URL` (e.g. `http://localhost:5173`)

## Auth and Roles

- JWT token includes `sub` (username) and `role`.
- UI routes non-admin/manager users to POS and blocks sidebar layouts.

## Password Reset Flow

1. `POST /password-reset/request` with `email`.
2. Server creates a reset token, stores hash, emails link.
3. `POST /password-reset/confirm` with `token` and `new_password`.

Note: Reset token table is created only during DB initialization. If DB is already initialized, create the table manually or run a migration.

## API Docs

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Common Troubleshooting

- MySQL connection errors: verify DB env vars and MySQL availability.
- Token issues: ensure `SECRET_KEY` is set and token has `role`.
- Styling not applied: ensure Tailwind is running and CSS cache is cleared.
