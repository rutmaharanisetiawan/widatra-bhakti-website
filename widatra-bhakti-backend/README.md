# WIDATRA Bhakti — Backend API

Laravel 12 / PHP 8.3+ / MySQL / Sanctum REST API backend for the PT Widatra
Bhakti corporate site and Applicant/Employee/Admin portal. Reverse-engineered
directly from the shipped React/TanStack frontend (`src/lib/*-store.ts`,
`src/routes/**`) — every entity, status workflow, role, and upload flow below
mirrors what the frontend already expects.

This is a **backend-only** deliverable. Nothing in the frontend was touched.

---

## 1. Requirements

- PHP 8.3+
- Composer 2.x
- MySQL 8.x (or MariaDB 10.6+)
- A `storage`-writable filesystem for uploads (CVs, media library, documents)

## 2. Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` and point `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` at your
MySQL instance (create the `widatra_bhakti` database first, or change the
name), then:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

The API is now served at `http://localhost:8000/api`. Point the frontend's
API base URL at that origin, and set `FRONTEND_URL` / `CORS_ALLOWED_ORIGINS`
/ `SANCTUM_STATEFUL_DOMAINS` in `.env` to match wherever `npm run dev` is
running (defaults already cover `http://localhost:5173`).

### Seed media files

`MediaAssetSeeder` creates Media Library rows referencing files at
`storage/app/public/seed/*.jpg` (matching `media-store.ts`'s `SEED_ASSETS`).
Copy the corresponding images from the frontend's `src/assets/` folder into
`storage/app/public/seed/` (same filenames as listed in the seeder) if you
want the seeded public pages (About, Factory Tour, Careers, News, Products,
CSR) to render real imagery out of the box. Everything else works without
this step — it only affects placeholder image URLs.

## 3. Architecture

- **Service + Repository pattern** — Controllers call `App\Services\*`,
  which call `App\Repositories\Contracts\*Interface` (bound to
  `App\Repositories\Eloquent\*` in `RepositoryServiceProvider`). Business
  rules (slug generation, status transitions, notification fan-out,
  duplicate-application prevention, publish-to-News sync) live in the
  Service layer.
- **Form Requests** validate every write endpoint.
- **API Resources** shape every JSON response.
- **Policies** (`App\Policies\*`) gate ATS applications, Tour bookings,
  Community events, and Contact inquiries. Simple `Gate::define()` closures
  in `AppServiceProvider` gate the shared "content" admin modules (Job
  Postings, News, Products, CSR, Media Library, Company Profile / Factory
  Tour CMS) and Users & Role Management.
- **Sanctum** issues bearer tokens on login/register (`token` in the JSON
  response) — send `Authorization: Bearer <token>` on subsequent requests.

## 4. Roles & access control

| account_type | role              | Can access                                                   |
|---------------|-------------------|----------------------------------------------------------------|
| external      | External User     | Career ATS (apply for jobs), My Job Applications, Factory Tour |
| internal      | Internal Employee | My Event Submissions (Community Events), Factory Tour          |
| internal      | Administrator     | Everything in `/admin`                                         |
| internal      | HR Manager        | ATS, Community Events approval, Factory Tour, Contact Inbox     |
| internal      | Content Editor    | Job Postings, News, Products, CSR, Media Library, CMS           |
| internal      | CSR Coordinator   | CSR module, Factory Tour bookings, Media Library                |

Admin-console roles sign in via `POST /api/auth/admin/login` with
**Employee ID + Password** (matches the Admin Login screen). External/
Internal applicants sign in via `POST /api/auth/login` with **Email +
Password**.

## 5. Demo accounts (seeded)

| Role               | Email / Employee ID                  | Password        |
|---------------------|--------------------------------------|------------------|
| External User       | ayu.pratiwi@example.com              | Password123!     |
| Internal Employee   | budi.santoso@widatra.co.id           | Password123!     |
| Administrator        | WBK-00001                            | AdminPass123!    |
| HR Manager           | WBK-00002                            | AdminPass123!    |
| Content Editor       | WBK-00003                            | AdminPass123!    |
| CSR Coordinator      | WBK-00004                            | AdminPass123!    |

## 6. Key endpoints

Full route list in `routes/api.php`. Highlights:

```
POST   /api/auth/register              External User sign-up
POST   /api/auth/register/internal     Internal Employee sign-up
POST   /api/auth/login                 Applicant/Employee sign-in
POST   /api/auth/admin/login           Admin console sign-in (Employee ID)
GET    /api/auth/me

GET    /api/jobs | /api/jobs/{slug}                    Public Careers
POST   /api/applications                                Submit application (multipart, `cv` file)
GET    /api/applications/mine                            My Job Applications
PATCH  /api/applications/{id}/status                     HR: move pipeline stage
POST   /api/applications/{id}/interview                  HR: schedule interview

POST   /api/tour-bookings                                Public: book a factory tour
GET    /api/tour-bookings/lookup?id=..&email=..           Public: check booking status
PATCH  /api/tour-bookings/{id}/status                     HR/CSR: update status

POST   /api/community-events                              Internal: create draft
POST   /api/community-events/{id}/submit                  Internal: submit for review
POST   /api/community-events/{id}/approve|reject|publish   HR/Admin review queue

POST   /api/contact-inquiries                              Public contact form
GET    /api/contact-inquiries                              Admin inbox
POST   /api/contact-inquiries/{id}/reply

GET    /api/articles | /api/products | /api/csr-programs   Public content
GET    /api/company-profile | /api/factory-tour-content     Public CMS imagery
GET    /api/media  (Admin Media Library)
GET    /api/admin/users  (Admin: Users & Role Management)
```

## 7. Notes on frontend parity

- Human-readable ids (`APP-260708-0001`, `FT-260713-0001`,
  `EVT-260724-0001`) are generated exactly like the frontend's mock stores.
- `media:<id>` string references (used for `cover_image`, `img`, gallery
  arrays, etc.) resolve to real Storage URLs via `MediaAsset::resolveUrl()`
  — every resource exposes both the raw reference and a `*_url` field.
  Legacy/raw URLs are also passed through unchanged. The `public` storage
  disk also serves applicant CVs, community-event documents, and general
  user documents.
- Notifications are generated server-side (not client mock data) whenever
  an application, tour booking, or community event status changes.
