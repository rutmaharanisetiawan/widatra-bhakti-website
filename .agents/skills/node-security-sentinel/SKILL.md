---
name: node-security-sentinel
description: >-
  Enforces API security hardening (Helmet, strict CORS whitelist, rate limiting),
  secure authentication (JWT access/refresh flow, bcrypt/argon2 hashing),
  client/server env isolation, and database injection prevention.
  Use whenever modifying auth, middleware, Express app config, env files, or raw DB queries.
---

# Node Security Sentinel

Standar pengamanan backend (`widatra-bhakti-backend-node`) dan perlindungan batas kepercayaan antara backend dan frontend (`widatra-bhakti-fe`).

## 1. Pengamanan HTTP & API Layer (`src/app.ts`)

1. **Helmet Security Headers**:
   - Pastikan `helmet()` selalu aktif di paling atas middleware Express (mengatur `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, dll). Bila backend juga melayani media cross-origin resmi, atur `crossOriginResourcePolicy` secara eksplisit sesuai kebutuhan domain produksi.
2. **Whitelist CORS Ketat (`CORS_ORIGIN`)**:
   - Parse `process.env.CORS_ORIGIN` menjadi daftar whitelist origin resmi.
   - **Larangan Production**: Dilarang meloloskan semua origin (`callback(null, true)` pada cabang `else`) saat `NODE_ENV === "production"`. Tolak origin tidak terdaftar dengan error CORS eksplisit.
3. **Rate Limiting**:
   - Terapkan rate limiter pada endpoint sensitif untuk mencegah brute-force & abuse:
     - Auth (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`): batas ketat per IP/menit.
     - Form publik & AI Chatbot (`/api/contact-inquiries`, `/api/tour-bookings`, `/api/chat`): batas wajar per IP agar kuota API eksternal & SMTP aman.

---

## 2. Keamanan Autentikasi & Password

1. **Password Hashing**:
   - Wajib hash password dengan **`bcryptjs`** (cost factor minimal `10`–`12`) atau **`argon2`**. Dilarang menyimpan atau membandingkan password plaintext atau hash lemah (MD5/SHA1/SHA256 tanpa salt).
   - Jangan pernah mengembalikan field `password` / `password_hash` / `remember_token` dalam response JSON API.
2. **Alur JWT (Access Token & Refresh Token)**:
   - Terapkan pemisahan ideal **Access Token** berumur pendek (misal `15m`–`1h`) untuk header `Authorization: Bearer ...` dan **Refresh Token** berumur panjang yang disimpan aman (cookie `httpOnly`, `Secure` di HTTPS, `SameSite=Lax/Strict`, serta dapat direvokasi/dirotasi di database saat logout atau refresh).
   - **Secret Handling**: `JWT_SECRET` wajib dimuat dari `process.env.JWT_SECRET`. Pada mode `production`, server wajib gagal start (*fail-fast*) jika `JWT_SECRET` kosong atau memakai string default development.
3. **Otorisasi RBAC**:
   - Selalu verifikasi kepemilikan resource (*ownership*) dan permission via `authenticateToken` + `requireAccess(...)` sebelum membaca/mengubah data admin atau pelamar.

---

## 3. Pencegahan Kebocoran Environment Variables

1. **Batas Mutlak Client vs Server**:
   - Variabel dengan prefix `VITE_` di `widatra-bhakti-fe` akan ter-bundle secara publik ke JavaScript browser dan bisa dilihat siapa saja.
   - **DILARANG KERAS** menaruh secret apa pun (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, password SMTP, kunci privat) dengan prefix `VITE_` atau di folder `widatra-bhakti-fe/`.
2. **Keamanan `.env` & Git**:
   - File `.env` dan `.env.*` (kecuali `.env.example` yang berisi nilai placeholder) tidak boleh pernah masuk ke Git commit atau log terminal/error response.

---

## 4. Sanitasi Input & Pencegahan Injeksi Database

1. **Parameterized Queries**:
   - Selalu gunakan query builder **Prisma** (`findMany`, `findUnique`, `create`, `update`) yang otomatis terparameterisasi, didahului validasi skema **Zod**.
2. **Larangan Raw SQL Injection**:
   - **Dilarang keras** memakai `prisma.$queryRawUnsafe(...)` atau `prisma.$executeRawUnsafe(...)` dengan concatenasi/interpolasi string dari input pengguna. Jika query mentah benar-benar terpaksa dibutuhkan, wajib gunakan tagged template `prisma.$queryRaw\`...\`` agar parameter di-bind secara aman.
3. **Validasi Upload & Path Traversal**:
   - Batasi ekstensi, MIME type, dan ukuran file pada `multer`; gunakan nama file acak (`hashName()`) dan jangan izinkan user menyuplai path file mentah (`../`) ke operasi filesystem.

---

## 5. Checklist Audit Sebelum Selesai

1. Pastikan tidak ada secret hardcode, `VITE_*` sensitif, `$queryRawUnsafe`, atau bypass auth/CORS di diff perubahan.
2. Jalankan `npm run build` di backend dan pastikan konfigurasi environment production terdokumentasi di `.env.example` dengan nilai dummy.
