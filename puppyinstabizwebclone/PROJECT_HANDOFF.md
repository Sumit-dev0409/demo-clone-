# Project Handoff Record — TeddyPups Backend & Full-Stack Platform

## 1. Project Purpose & Technology Stack
- **Purpose**: Production-ready marketing and adoption platform for TeddyPups, a boutique puppy sanctuary based in Downtown Dubai specializing in locally available and imported Korean teacup puppies. Features customer contact/letter inquiries, dynamic puppy catalog, breed filtering, customer CRM, staff operations portal, and health monitoring.
- **Frontend Stack**: Next.js 15.5.28 (App Router), React 19.1.0, TypeScript 5.7.2, TailwindCSS v4.1.13, custom design tokens (`--color-cocoa`, `--color-caramel`, `--color-milk`).
- **Backend Stack**: Next.js Node.js Route Handlers (`runtime = "nodejs"`), PostgreSQL 16 (via `pg` 8.23.1 connection pool with fast-fail circuit breaker), SQL schema migrations, and native Node.js test runner (`node:test`).
- **Containerization**: Multi-stage Dockerfile and Docker Compose orchestration with automated health-checks and migrations.

## 2. Directory Structure & Key Entry Points
- `app/(site)/`: Frontend public page routes:
  - `app/(site)/page.tsx`: Homepage with hero, breed lineup, showroom media, and interactive PupPal mascot.
  - `app/(site)/puppies/page.tsx`: Dynamic puppy listing with origin and breed filters.
  - `app/(site)/puppies/[slug]/page.tsx`: Individual puppy profile with status detection.
  - `app/(site)/contact/page.tsx`: Visit information and contact letter form.
  - `app/(site)/admin/page.tsx`: Staff operations portal (Inquiries CRM, puppy inventory, database telemetry).
  - `app/(site)/faq/page.tsx`, `happy-families/page.tsx`, `how-it-works/page.tsx`.
- `app/api/`: REST API endpoints:
  - `app/api/health/route.ts`: Comprehensive health check with database ping, query latency, and migration metrics.
  - `app/api/v1/inquiries/route.ts`: Public inquiry submission (`POST`) and staff inquiry listing (`GET`).
  - `app/api/v1/inquiries/[id]/route.ts`: Staff inquiry status and notes management (`PATCH`).
  - `app/api/v1/puppies/route.ts`: Public puppy catalog query (`GET`) and staff puppy creation (`POST`).
  - `app/api/v1/puppies/[slug]/route.ts`: Single puppy lookup (`GET`), update (`PATCH`), and deletion (`DELETE`).
- `components/`: UI components (LetterForm, MeetThePups, PupPal, SiteHeader, SiteFooter, etc.).
- `lib/`:
  - `lib/db.ts`: PostgreSQL connection pool singleton with configuration validation, 1s timeout, and fast-fail circuit breaker.
  - `lib/inquiries.ts`: Inquiry input validation, sanitization, honeypot protection, pagination, and status updates.
  - `lib/puppies.ts`: Full Data Access Layer (DAL) for puppies with graceful static fallback when PostgreSQL is offline.
  - `lib/auth.ts`: Timing-safe administrative authorization (`crypto.timingSafeEqual`) supporting Bearer tokens, headers, and cookies.
  - `lib/data.ts`: Static baseline catalog, showroom media, FAQs, and testimonials.
- `migrations/`:
  - `001_create_inquiries.sql`: Base inquiries table with UUID and timestamp index.
  - `002_create_puppies.sql`: Full puppy catalog schema with status, origin, and breed indexes.
  - `003_update_inquiries_management.sql`: Adds status tracking (`new`, `contacted`, `resolved`, `archived`) and operator notes.
  - `004_create_faqs_and_reviews.sql`: FAQs and customer testimonials storage.
- `scripts/`:
  - `scripts/migrate.mjs`: Automated migration runner with `schema_migrations` tracking table.
  - `scripts/seed.mjs`: Idempotent database seeder with 20 puppies, 9 FAQs, and sample CRM inquiries.
- `tests/`: Automated unit and API contract tests using `node:test` (19 tests, 100% passing).

## 3. Implementation Status Summary

| Feature / Component | Status | Verification Detail |
|---|---|---|
| Frontend UI & Pages | Completed & Verified | All pages render cleanly; Next.js production build passes (33 routes) |
| Public Inquiry Submission (`POST /api/v1/inquiries`) | Completed & Verified | Input validation, honeypot spam protection, 16KB body limit, DB persistence |
| Inquiries Staff API (`GET`, `PATCH /api/v1/inquiries/:id`) | Completed & Verified | Authorized listing, status filtering, notes updates, 401 on unauthorized |
| Puppies Catalog API (`GET /api/v1/puppies`, `GET .../:slug`) | Completed & Verified | Public query with breed & origin filters, single slug lookup |
| Puppies Admin API (`POST`, `PATCH`, `DELETE`) | Completed & Verified | Input validation, slug generation, authorized CRUD |
| Health Check API (`GET /api/health`) | Completed & Verified | Latency reporting, migration count, db connectivity check |
| Resilient Database Layer & Fast-Fail Circuit Breaker | Completed & Verified | Instant fallback (<1ms) when DB is offline; seamless query when DB is up |
| Database Migration Runner | Completed & Verified | Sequential migration discovery and `schema_migrations` tracking |
| Database Seeder | Completed & Verified | Baseline catalog, FAQs, and CRM sample leads seeded idempotently |
| Staff Operations Portal (`/admin`) | Completed & Verified | Key-based authentication, real-time leads CRM, status updater, WhatsApp trigger |
| `package.json` Tooling | Completed & Verified | `db:migrate`, `db:seed`, and `test` scripts verified |

## 4. Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (e.g. `postgresql://teddypups:teddypups@localhost:5432/teddypups`).
- `ADMIN_API_KEY`: Secret API key for staff/admin endpoints and the operations portal (default: `teddy_secret_dev_key_2026`).
- `PORT`: Server port (default: 3000).
- `HOSTNAME`: Binding address (default: 0.0.0.0).

## 5. Commands to Run & Test
- Start PostgreSQL via Docker: `docker compose up -d db`
- Run database migrations: `npm run db:migrate`
- Seed initial catalog and leads: `npm run db:seed`
- Run automated test suite: `npm test`
- Build production bundle: `npm run build`
- Start development server: `npm run dev`
- Launch with Docker Compose: `docker compose up --build`

## 6. Accessing the Staff Operations Portal
1. Navigate to `/admin` in the browser.
2. Enter the configured `ADMIN_API_KEY` (configured in `.env`).
3. Manage incoming customer leads, filter by status, update notes, or toggle puppy availability in real time.
