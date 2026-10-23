# TeddyPups

Next.js marketing site with a PostgreSQL-backed public contact enquiry form.
Puppy listings, breed filters, FAQs, and testimonials are intentionally left as
the existing static content in `lib/data.ts` and the page components; the
current UI does not provide staff editing or account workflows for them.

## Feature-to-backend mapping

| Existing frontend feature | Backend behavior |
| --- | --- |
| Contact letter form | `POST /api/v1/inquiries` validates and stores the enquiry, then offers a WhatsApp link |
| Site health | `GET /api/health` reports application/database readiness |
| Static puppy and marketing pages | No API; these remain authored frontend content |

The enquiry table stores the submitted name, phone, optional email/location,
breed interest, selected puppy, optional message, and creation timestamp. Each
enquiry is independent; there are no user accounts, roles, puppy CRUD endpoints,
or public enquiry reads because those workflows are not present in the frontend.

## Local development

Requirements: Node.js 22 or newer and Docker Compose.

1. Copy `.env.example` to `.env` if running the Next.js server outside Docker.
2. Start PostgreSQL: `docker compose up -d db`
3. Install dependencies: `npm ci`
4. Apply the idempotent schema migration: `npm run db:migrate`
5. Start the site: `npm run dev`

Alternatively, run `docker compose up --build` to start the database and site
on port 3000. The Compose setup uses a development-only database password;
never reuse it outside local development.

Run the focused input validation tests with `npm test`, and verify types/build
with `npm run build`.

## Configuration and database

`DATABASE_URL` is required by the API and migration command. Use a PostgreSQL
connection string from the selected host in production, and keep it in the
hosting provider's secret/environment configuration, not in frontend code.
The migration at `migrations/001_create_inquiries.sql` is additive and safe to
rerun. Apply it as a deployment/release step before sending traffic:

```sh
npm run db:migrate
```

The `inquiries` table uses a generated UUID primary key, bounded text fields,
and a descending timestamp index for operational review. There is deliberately
no public endpoint to read enquiries. An authorized operator can review them
through the database using a privileged connection, for example:

```sql
SELECT id, name, phone, email, location, curious, interest, message, created_at
FROM inquiries
ORDER BY created_at DESC;
```

Enquiries contain personal information. Restrict database access, set a
retention/deletion policy appropriate to your business, and use encrypted
connections and backups supported by your managed PostgreSQL provider. The app
does not currently send email notifications or provide an admin dashboard.

## API

### `POST /api/v1/inquiries`

Accepts JSON fields from the contact form: `name`, `phone`, optional `email`,
`location`, `curious`, `interest`, optional `message`, and the anti-spam
`website` honeypot (which must be blank).

- `201`: `{ "id": "...", "createdAt": "..." }`
- `400`: malformed JSON/body
- `413`: request body exceeds 16 KiB
- `415`: request is not JSON
- `422`: invalid fields or filled honeypot
- `503`: database is not configured or unavailable

Field lengths and phone/email formats are validated server-side. SQL uses
parameterized queries. Responses do not return submitted personal details.
The API is same-origin and does not enable cross-origin access.

### `GET /api/health`

Returns `200` when PostgreSQL is reachable and `503` otherwise. It does not
expose connection details.

## Deployment

Build the included multi-stage Dockerfile and provide `DATABASE_URL` at runtime.
Deploy the database migration as a one-off release step before deploying the
new application version. Set HTTPS at the platform/load balancer, configure
database TLS as required by the provider, and restrict access to the database.
The health-check path is `/api/health`.

Configure request rate limits at the hosting platform, reverse proxy, or WAF;
this application does not keep process-local limits that would be unreliable
across multiple instances. No email provider, deployment account, or production
URL is assumed.
