# DeepResearch Backend

A standalone Express backend for authentication, account management, paper search, and report generation.

## Quick Start

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create environment file:

```bash
copy .env.example .env
```

3. Start server:

```bash
npm run dev
```

Default server URL: `http://localhost:3001`

## Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

- `GET /api/users/me`
- `PUT /api/users/me`
- `PUT /api/users/me/password`
- `DELETE /api/users/me`

- `GET /api/users/me/preferences`
- `PUT /api/users/me/preferences`

- `GET /api/users/me/history`
- `DELETE /api/users/me/history/:id`
- `DELETE /api/users/me/history`

- `GET /api/papers/search`
- `POST /api/reports/generate`

## Search Behavior

- `/api/papers/search` uses hybrid retrieval:
  - real-time OpenAlex search (internet required)
  - local seed dataset fallback in `src/data/papers.json`
- If OpenAlex is unavailable, the API still returns local results when possible.

## Auth

Use header:

```http
Authorization: Bearer <token>
```

`/api/papers/search` and `/api/reports/generate` support optional auth. If token is valid, user history is recorded.

## Storage

- User and history data are persisted to: `backend/storage/users.json`
- Paper corpus is sample seed data in: `backend/src/data/papers.json`

No files in `backend/database` are modified by this backend service.

## API Testing Checklist

- Postman collection:
  - `backend/tests/postman/DeepResearchBackend.postman_collection.json`
  - `backend/tests/postman/DeepResearchBackend.local.postman_environment.json`
- curl checklist:
  - `backend/tests/curl/curl-api-checklist.md`

Recommended order: run Postman folder `0 -> 7` in sequence, or follow the curl checklist section order (`1 -> 16`).

## One-Click Newman Run

Install dependencies (includes `newman` in devDependencies), then run:

```bash
cd backend
npm run test:api
```

What it does:
- starts backend server on port `3001` (or `TEST_API_PORT`)
- waits for `/api/health`
- runs the full Postman collection via `newman`
- stops server automatically and exits with test status code

Optional env overrides:
- `BASE_URL`
- `TEST_API_PORT`
- `TEST_EMAIL`
- `TEST_PASSWORD`
- `TEST_NAME`
- `TEST_UPDATED_NAME`
- `TEST_QUERY`

CI mode:

```bash
npm run test:api:ci
```

In CI mode, the run uses no color output and exports JUnit report to:
- `backend/tests/reports/newman-results.xml`
