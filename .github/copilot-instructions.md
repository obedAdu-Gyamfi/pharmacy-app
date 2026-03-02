# Pharmacy App - AI Coding Agent Instructions

## Architecture Overview

This is a **pharmacy management system** with a FastAPI backend and React/TypeScript frontend, containerized with Docker.

**Stack:**
- Backend: FastAPI + SQLAlchemy (MySQL via PyMySQL)
- Frontend: React 19 + TypeScript + Vite + TailwindCSS
- Database: MySQL 8.0.44
- Auth: JWT tokens (passlib bcrypt + python-jose)

**Key Components:**
1. `app/` - FastAPI backend (monolithic main.py with all endpoints)
2. `pharmacy-ui/` - React frontend with React Router
3. `app/models/` - SQLAlchemy ORM models (users, products, sales, suppliers, customers, stock_batches)
4. Database auto-initializes on startup with `db_initialized` flag in `system_settings` table

## Critical Patterns

### Database & Models

**SQLAlchemy models use class-based pattern** (not Pydantic schemas):
```python
# Models in app/models/ inherit from BASE (declarative_base)
from .base import BASE

class User(BASE):
    __tablename__ = "users"
    # ... columns
    
# Separate "action" classes for operations:
class CreateUser:  # Handles user creation logic
class SearchUser:  # Handles search operations
```

**Database initialization** (see [app/models/database.py](app/models/database.py)):
- DB class checks `system_settings.db_initialized` flag before creating tables
- Auto-creates default admin user (username: "admin", password: "admin123")
- Uses context vars for audit tracking: `audit_user_id` and `audit_ip` from [app/models/base.py](app/models/base.py)

### Authentication & Authorization

**JWT token flow** (see [app/main.py](app/main.py#L44-L93)):
- Login endpoint returns JWT token with 1-hour expiry
- `get_current_user()` dependency extracts user from token
- `require_role(*roles)` decorator for role-based access (admin, pharmacist, cashier, manager)
- Audit middleware captures user_id and IP for all database operations using SQLAlchemy event listeners

**Important:** `SECRET_KEY` env variable is required (not `SECRETE_KEY`)

### API Structure

**All endpoints in single file** [app/main.py](app/main.py) (~716 lines):
- No separate routers/controllers (controllers/ folder is empty)
- Pattern: endpoint → model class method → database operation
- Common endpoints: `/login`, `/sign-up`, `/add-{resource}`, `/get-{resource}`, `/search-{resource}`

**Audit logging** uses SQLAlchemy `after_insert/update/delete` event listeners ([app/main.py](app/main.py#L192-L229)):
```python
@event.listens_for(BASE, "after_insert", propagate=True)
def after_insert(mapper, connection, target):
    # Automatically logs all DB changes to audit_logs table
```

## Development Workflows

### Local Development (without Docker)

```bash
# Backend
source myenv/bin/activate  # Virtual env already exists
python3 app/main.py
# or: uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Frontend
cd pharmacy-ui && npm run dev
```

**Database setup:** Ensure MySQL 8 is running locally, create `.env` from README example with `DB_HOST=localhost`.

### Docker Development

```bash
docker-compose up
# Backend: localhost:8000
# Frontend: localhost:5173
# MySQL: localhost:3307 (mapped from container 3306)
```

**Docker quirk:** Backend uses service name `mysql-db` for DB_HOST in container (see [docker-compose.yml](docker-compose.yml)).

### Environment Variables

Required `.env` in project root:
```env
DB_HOST=mysql-db  # or localhost for local dev
DB_PORT=3306
DB_NAME=Pharmacy
DB_USER=obed
DB_PASSWORD=@Letscodeit1
SECRET_KEY=change_me  # JWT secret
```

## Frontend Patterns

**Routing** ([pharmacy-ui/src/App.tsx](pharmacy-ui/src/App.tsx)):
- React Router with nested Dashboard routes
- Token watcher utility auto-redirects on expiry
- No centralized API client - axios calls hardcode `http://127.0.0.1:8000`

**Component structure:**
- Feature-based folders: Users/, Products/, Sales/, Dashboard/
- Separate create/list pages (e.g., UsersPage + CreateUser)
- TailwindCSS for styling (compile with `npm run tail`)

## Common Tasks

**Add new database model:**
1. Create model class in `app/models/{name}.py` inheriting from `BASE`
2. Import in `app/models/database.py` for table creation
3. Add relationships to related models (e.g., `user = relationship("User")`)
4. Backend will auto-create table on next startup if `db_initialized` flag allows

**Add API endpoint:**
- Add `@app.{method}` decorator in [app/main.py](app/main.py)
- Use `db: Session = Depends(db_instance.get_db)` for database access
- Use `current_user: User = Depends(get_current_user)` for auth
- Use `require_role("admin", "pharmacist")` for role checks

**Debug audit logs:**
- Check `app/logs/` folder for application logs (logger from [app/models/log.py](app/models/log.py))
- Query `audit_logs` table for database change history

## Data Flow Example

**POS Sale Transaction:**
1. Frontend: POST to `/add-sale` with sale details
2. Backend: [CreateSale class](app/models/sales.py) validates, creates Sale record
3. POST to `/add-sale-item` for each product (creates SalesItem, decrements StockBatch quantity)
4. Audit middleware captures user_id from JWT → `after_insert` event logs to `audit_logs`
5. Frontend refreshes dashboard stats via `/recent-sales` and `/recent-activity`

## Important Files

- [app/models/database.py](app/models/database.py) - DB initialization & session management
- [app/models/base.py](app/models/base.py) - SQLAlchemy base & audit context vars
- [app/main.py](app/main.py) - All API endpoints & middleware
- [sql/schema.sql](sql/schema.sql) - Reference schema (not used by app, SQLAlchemy creates tables)
- [docker-compose.yml](docker-compose.yml) - Service orchestration
