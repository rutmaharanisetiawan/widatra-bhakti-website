---
name: node-api-guardian
description: >-
  Enforces standardized Node.js/Express backend architecture (Routes -> Controllers -> Services -> Repositories),
  centralized async error handling, Zod schema validation, and consistent JSON response shapes.
  Use when creating, refactoring, or reviewing any file in widatra-bhakti-backend-node/.
---

# Node API Guardian

Panduan standar arsitektur dan kualitas API untuk backend `widatra-bhakti-backend-node` (Express 5 + TypeScript + Prisma + Zod).

## 1. Standar Arsitektur 4-Layer

Untuk setiap fitur baru atau refactor modul backend, pisahkan tanggung jawab secara tegas:

```text
src/
├── routes/         # Definisi endpoint HTTP, auth middleware, rate limiter, & mapping ke controller
├── controllers/    # Parse request, panggil validasi Zod, panggil service, kirim JSON response
├── services/       # Business logic murni, koordinasi transaksi, policy/permission checks
├── repositories/   # Akses database terisolasi lewat Prisma (tanpa Express req/res)
├── middleware/     # Auth, errorHandler, rate limiting, upload (multer)
└── utils/          # Helper HTTP (validate, HttpError), tanggal, logger
```

### Aturan Ketat Antar-Layer
1. **Routes** hanya mendaftarkan path, HTTP method, middleware (`authenticateToken`, `requireAccess`, `upload`), dan handler controller. Dilarang menulis business logic atau query Prisma di file route.
2. **Controllers** tidak boleh memanggil `prisma.*` secara langsung pada fitur baru/refactor. Tugasnya hanya:
   - Validasi input (`params`, `query`, `body`) via Zod.
   - Meneruskan DTO yang sudah bersih ke `Service`.
   - Mengembalikan respons HTTP dengan status code tepat.
3. **Services** tidak boleh menyentuh objek `Request` atau `Response` Express. Lempar error domain menggunakan `HttpError` (atau helper `notFound`, `forbidden`, `unauthenticated`, `validationError` dari `src/utils/http.ts`).
4. **Repositories** hanya berurusan dengan `prisma.*` dan mapping model database agar query mudah diuji dan tidak terduplikasi di banyak controller.

---

## 2. Centralized Async Error Handling

Cegah server crash akibat *unhandled promise rejection*:

1. Backend ini memakai **Express 5**, yang secara native meneruskan rejected promise dari handler `async` ke middleware error berikutnya. Pastikan seluruh route handler bertipe `async (req, res)` selalu me-`await` operasi async-nya (jangan tinggalkan *floating promise* tanpa `.catch()` atau `await`).
2. Seluruh error harus mengalir terpusat ke `src/middleware/errorHandler.ts` yang dipasang di baris paling akhir `src/app.ts`.
3. Dilarang menelan error dengan `catch (err) {}` kosong tanpa logging atau melempar ulang error yang bermakna.
4. Untuk error operasional yang terprediksi (400/401/403/404/409/422), selalu lempar `HttpError` dari `src/utils/http.ts` — jangan kirim `res.status(500)` manual di dalam controller.
5. Pastikan proses latar/integrasi eksternal (seperti fetch ke Gemini API atau SMTP) selalu memiliki timeout (`AbortController`) dan `try/catch` yang aman.

---

## 3. Wajib Validasi Skema Input (Zod)

1. Setiap input eksternal (`req.body`, `req.query`, `req.params`) **wajib** divalidasi dengan skema **Zod** sebelum diproses oleh service atau database.
2. Gunakan helper `validate(schema, data)` di `src/utils/http.ts` agar kegagalan validasi otomatis melempar status `422` dengan pemetaan field error yang rapi.
3. Jangan pernah meneruskan `req.body` mentah langsung ke `prisma.*.create({ data: req.body })` atau `update()` (cegah *mass-assignment* — selalu ekstrak field yang lolos validasi Zod saja).
4. Untuk field dari `multipart/form-data`, gunakan helper `parseMaybeJson()` dan `toBool()` sebelum atau di dalam transformasi skema Zod.

---

## 4. Format Response JSON Seragam

Standar envelope JSON terpadu untuk modul dan endpoint baru:

- **Sukses**:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Operasi berhasil.",
    "error": null
  }
  ```
- **Gagal / Error**:
  ```json
  {
    "success": false,
    "data": null,
    "message": "Ringkasan pesan error yang aman untuk user.",
    "error": {
      "code": "VALIDATION_ERROR",
      "details": {
        "email": ["Format email tidak valid."]
      }
    }
  }
  ```

> **Catatan Kompatibilitas Endpoint Eksisting:**
> Endpoint lama yang sudah dikonsumsi oleh `widatra-bhakti-fe/src/lib/api-client.ts` memakai kontrak Laravel-compatible (`{ data }`, `{ message }`, `{ message, errors }`). Saat menyentuh endpoint lama, **pertahankan field `data`, `message`, dan `errors` yang sudah dipakai frontend** (atau tambahkan `success` secara non-breaking) agar halaman existing tidak rusak kecuali frontend diperbarui bersamaan.

---

## 5. Checklist Verifikasi Sebelum Selesai

1. Jalankan kompilasi TypeScript di backend:
   ```bash
   cd widatra-bhakti-backend-node
   npm run build
   ```
2. Pastikan 0 error `tsc`, seluruh route baru memakai validasi Zod, dan tidak ada query database langsung di file route atau handler tanpa error propagation.
