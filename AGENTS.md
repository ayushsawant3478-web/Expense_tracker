# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Trackify** — a full-stack personal finance / expense tracker application for Indian users. The app allows users to track income and expenses, set monthly budgets, manage savings goals, view analytics, and monitor live Indian market data (stocks, mutual funds, gold, REITs).

The project is split into two independently deployable services:
- `frontend/` — React + TypeScript + Vite SPA, deployed on Vercel
- `expense-tracker-backend/` — Flask REST API, deployed on Render (backed by Neon PostgreSQL)

## Commands

### Frontend (`frontend/`)

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Type-check (acts as lint)
npm run lint

# Production build
npm run build
```

### Backend (`expense-tracker-backend/`)

```bash
# Create and activate virtual environment (first time)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run dev server (port 8000)
python app.py

# Run with gunicorn (production-style)
gunicorn app:app
```

There are no automated tests in this codebase.

## Environment Variables

**`frontend/.env`**
```
VITE_API_URL=<backend URL>         # Defaults to http://127.0.0.1:8000 in constants.ts
GEMINI_API_KEY=<Gemini API key>    # Injected at build time via vite.config.ts as process.env.GEMINI_API_KEY
VITE_GOOGLE_CLIENT_ID=<OAuth client ID>
```

**`expense-tracker-backend/.env`**
```
DATABASE_URL=<PostgreSQL connection string>
SECRET_KEY=<Flask secret>
JWT_SECRET_KEY=<JWT signing key>
GOOGLE_CLIENT_ID=<Google OAuth client ID>
```

## Architecture

### Backend

Flask app (`app.py`) registers six Blueprints and auto-creates all PostgreSQL tables on startup via `with app.app_context()`. There is no ORM migration system — table schemas are managed by raw `CREATE TABLE IF NOT EXISTS` statements inside each model file. The DB connection is a raw psycopg2 connection obtained fresh per request from `database/db.py:get_db()` (no connection pooling).

| Blueprint | Prefix | Auth required |
|---|---|---|
| `auth_bp` | `/register`, `/login`, `/auth/google` | No |
| `expense_bp` | `/expenses` | JWT |
| `income_bp` | `/income` | JWT |
| `budget_bp` | `/budget` | JWT |
| `goal_bp` | `/goals` | JWT |
| `market_bp` | `/market/*` | No |

Authentication is JWT-based (`flask-jwt-extended`). Passwords are hashed with bcrypt. Google OAuth tokens are verified server-side via `google.oauth2.id_token`.

`utils/categorizer.py` contains keyword-based auto-categorization logic for both expenses (8 categories) and income (4 sources). No ML — purely string matching.

`routes/market_routes.py` fetches live data from Yahoo Finance (`query1.finance.yahoo.com`) for stocks/indices and from `api.mfapi.in` for mutual funds. No API keys needed; fetches are made with a `User-Agent` header.

### Frontend

Context-based state management with three providers wrapping the app:
- `AuthContext` — JWT token + user object, persisted to `localStorage` under keys `trackify_user` / `trackify_token`. Supports a **demo mode** (`isDemo`) that bypasses auth and loads mock data without a backend.
- `ExpenseContext` — fetches and caches all transactions (expenses + income) and budgets from the backend. Transactions are stored as a unified `Transaction[]` array with a `type: 'income' | 'expense'` discriminator.
- `GoalContext` — savings goals, synced with `/goals` API.

`ThemeProvider` (wraps everything in `main.tsx`) manages dark/light mode.

All pages in `src/pages/` are route-level components protected by `<PrivateRoute>` (checks `user || isDemo`). The `API_URL` used by all contexts is defined in `src/constants.ts` and reads from `VITE_API_URL`.

The **ChatBot** component (`src/components/ChatBot.tsx`) uses the `@google/genai` SDK with the Gemini API key injected at build time. The **LiveMarketData** component hits `/market/all` on the backend.

### Deployment

- Frontend is deployed to Vercel. `frontend/vercel.json` sets `Cross-Origin-Opener-Policy: same-origin-allow-popups` (required for Google OAuth popups) and rewrites all routes to `/index.html` for SPA routing.
- Backend is deployed to Render. CORS is configured in `app.py` to allow `https://trackify.vercel.app` and localhost ports 3000–3002.
- Database is Neon (serverless PostgreSQL). The connection string goes directly in `DATABASE_URL`.
