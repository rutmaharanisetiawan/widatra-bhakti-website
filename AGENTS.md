# AGENTS.md — PT Widatra Bhakti Workspace Rules

Aturan kerja resmi untuk seluruh AI coding agent dan developer di monorepo **PT Widatra Bhakti**:
- **Frontend (`widatra-bhakti-fe/`)**: React 19, TypeScript, TanStack Router, TanStack React Query, Tailwind CSS, Zod.
- **Backend (`widatra-bhakti-backend-node/`)**: Node.js, Express 5, TypeScript, Prisma ORM, MariaDB/MySQL, Zod.

---

## 1. Protokol Pemanggilan Custom Skills (`.agents/skills/`)

Sebelum merancang, mengedit, atau mereview kode, agent **wajib membaca file `SKILL.md` yang relevan** sesuai tabel di bawah ini:

| Kondisi Tugas / Area Kerja | Skill Wajib Dibaca | Lokasi |
| :--- | :--- | :--- |
| Membuat, mengubah, atau refactor route, controller, service, repository, validasi, atau response API di `widatra-bhakti-backend-node/` | **`node-api-guardian`** | `.agents/skills/node-api-guardian/SKILL.md` |
| Membuat atau mengubah komponen UI, routing, custom hook, React Query, state, atau form di `widatra-bhakti-fe/` | **`react-perf-state-guardian`** | `.agents/skills/react-perf-state-guardian/SKILL.md` |
| Menyentuh autentikasi/JWT, RBAC, CORS, rate limit, Helmet, upload file, `.env`, atau query database | **`node-security-sentinel`** | `.agents/skills/node-security-sentinel/SKILL.md` |
| Menambah paket `npm`, membuat helper/abstraksi baru, refactor, atau code review umum (berlaku di **semua** tugas) | **`ponytail-anti-bloat`** | `.agents/skills/ponytail-anti-bloat/SKILL.md` |

> **Aturan Multi-Skill:** Jika tugas menyentuh beberapa domain sekaligus (misalnya membuat endpoint login atau upload media + UI form), aktifkan dan patuhi seluruh skill terkait secara bersamaan.

---

## 2. Aturan Coding & Kualitas Lintas Stack

1. **TypeScript Bersih**: Tidak boleh meninggalkan error kompilasi (`tsc`), tipe `any` sembarangan tanpa alasan jelas, atau import/variabel mati.
2. **Keamanan & Environment**:
   - Dilarang keras meng-commit file `.env`, password database, `JWT_SECRET`, atau `GEMINI_API_KEY` ke Git.
   - Jangan membocorkan rahasia backend dengan prefix `VITE_` di frontend.
3. **Jaga Kontrak Eksisting**:
   - Jangan mematahkan kompatibilitas endpoint yang sudah dikonsumsi oleh `widatra-bhakti-fe/src/lib/api-client.ts` dan `widatra-bhakti-backend-node/src/utils/http.ts` tanpa memperbarui kedua sisi secara terkoordinasi.
4. **Anti-Bloat**:
   - Utamakan API native ES6+/Node/Web dan utilitas yang sudah ada di repo sebelum mengusulkan library `npm` baru.
5. **Dokumentasi & Komentar**:
   - Pertahankan komentar dan docstring eksisting yang relevan. Tulis komentar singkat hanya untuk menjelaskan *alasan teknis* (*why*), bukan mengulang isi kode (*what*).

---

## 3. Alur Branch Git & Workflow Deploy

1. **Branch `dev` (Branch Eksperimen & Integrasi Aktif)**:
   - Seluruh pengembangan fitur baru, uji coba arsitektur, refactor, dan perbaikan bug **wajib dikerjakan di branch `dev`** (atau `feature/<nama-fitur>` yang di-merge ke `dev`).
   - Sebelum mulai bekerja: `git checkout dev && git pull origin dev`.
2. **Branch `main` (Production — Terhubung ke Server aaPanel)**:
   - Branch `main` **hanya** menerima perubahan yang sudah teruji bersih dari `dev` (via Merge / Pull Request).
   - **Dilarang** mendorong eksperimen yang belum terverifikasi langsung ke `main`, karena server production (`web.widatra.com` & `api.web.widatra.com`) melakukan `git pull origin main`.
3. **Konvensi Pesan Commit**:
   - Gunakan format jelas dan singkat, misalnya: `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`, `docs: ...`.

---

## 4. Verifikasi Wajib Sebelum Melaporkan Selesai

Setiap perubahan kode aplikasi wajib diverifikasi lolos build tanpa error sebelum tugas dinyatakan selesai:

- **Backend**:
  ```bash
  cd widatra-bhakti-backend-node && npm run build
  ```
- **Frontend**:
  ```bash
  cd widatra-bhakti-fe && npm run build
  ```
- **Integrasi & Uji Visual / Endpoint** (bila mengubah UI atau API): Pastikan endpoint merespons sesuai kontrak dan tidak ada error runtime di console.
