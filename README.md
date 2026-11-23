# PT Widatra Bhakti — Portal & Website Platform

Repository monorepo resmi untuk pengembangan dan pembaruan sistem informasi PT Widatra Bhakti (anggota Otsuka Group Indonesia).

---

## 📁 Struktur Direktori

```text
widatra-bhakti-fix/
├── widatra-bhakti-fe/             # Frontend (React 19 + TanStack Router + Tailwind CSS)
├── widatra-bhakti-backend-node/   # Backend Utama Baru (Node.js + Express 5 + TypeScript + Prisma) [Port 8001]
└── widatra-bhakti-backend/        # Backend Referensi (Laravel 11 + Sanctum + Spatie Permission) [Port 8000]
```

---

## 🚀 Panduan Menjalankan Proyek (Setup Guide)

### 1. Prasyarat Sistem
- **Node.js**: v20+ atau v22+ (Direkomendasikan v22 / v26)
- **MySQL**: v8.0+ (atau MariaDB 10.4+)
- **PHP & Composer**: (Opsional, hanya jika ingin menjalankan Laravel sebagai pembanding)

### 2. Setup Database MySQL
1. Buat database baru di MySQL:
   ```sql
   CREATE DATABASE widatra_bhakti;
   ```
2. Import data awal dan tabel menggunakan berkas dump yang sudah disediakan:
   ```bash
   mysql -u root -p widatra_bhakti < widatra_bhakti_dump.sql
   ```
3. Pastikan MySQL berjalan di port `3306`.

---

### 3. Menjalankan Backend Node.js (Port 8001)

Masuk ke folder backend Node:
```bash
cd widatra-bhakti-backend-node
npm install

# Buat berkas .env
cp .env.example .env

# Generate Prisma Client dari skema MySQL
npx prisma generate

# Jalankan server dalam mode development (Hot-reload)
npx tsx watch src/server.ts
```
> Server akan aktif di `http://localhost:8001`. Endpoint kesehatan dapat dicek di `http://localhost:8001/health`.

---

### 4. Menjalankan Frontend (Port 5173)

Buka terminal baru, masuk ke folder frontend:
```bash
cd widatra-bhakti-fe
npm install

# Buat berkas .env jika belum ada
cp .env.example .env

# Jalankan development server
npm run dev
```
> Aplikasi web akan aktif di `http://localhost:5173`.

---

## 👥 Matriks Hak Akses (8 Role & Permission)

Sistem menggunakan **Role-Based Access Control (RBAC)** ketat yang ditegakkan di backend:

| Kategori | Role | Deskripsi & Hak Akses Utama |
| :--- | :--- | :--- |
| **Public** | **Guest / Visitor** | Melihat seluruh halaman landing, produk, berita, CSR, dan booking tur tanpa login. |
| **Registered** | **External User** | Portal Pelamar (ATS), submit lamaran & CV, reservasi tur publik. *(Dilarang submit event komunitas)* |
| **Registered** | **Internal Employee** | Pengajuan proposal event komunitas, profile karyawan. *(Dilarang melamar ATS & booking tur)* |
| **Admin** | **Super Admin** | Akses penuh seluruh sistem, manajemen user, role assignment, dan audit log. |
| **Admin** | **Content Admin** | Modul Produk, Berita & Artikel, CSR, CMS Company Profile, Media Library, dan Kotak Masuk. |
| **Admin** | **HR Manager** | Manajemen Lowongan Kerja (Jobs), Seleksi Pelamar (ATS), Jadwal Wawancara, & Catatan HR. |
| **Admin** | **Factory Tour Admin** | Verifikasi, persetujuan (*approval*), dan pengaturan jadwal Kunjungan Pabrik (Factory Tour). |
| **Admin** | **Event Moderator** | Review, revisi, persetujuan, dan publikasi Acara Komunitas Internal (*Community Events*). |

---

## 🔑 Kredensial Akun Pengujian (Testing Accounts)

Semua akun terdaftar menggunakan kata sandi standar berikut untuk pengujian lokal:

| Role | Email | Password | Catatan |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `andi.wijaya@widatra.co.id` | `AdminPass123!` | Akses seluruh modul & audit logs |
| **Content Admin** | `rangga.prasetyo@widatra.co.id` | `AdminPass123!` | Kelola produk, berita, CSR, CMS media |
| **HR Manager** | `sari.ningsih@widatra.co.id` | `AdminPass123!` | Kelola lowongan & pelamar ATS |
| **Factory Tour Admin**| `rina.oktaviani@widatra.co.id`| `AdminPass123!` | Kelola reservasi kunjungan pabrik |
| **Event Moderator** | `hendra.setiawan@widatra.co.id`| `AdminPass123!`| Moderasi proposal event komunitas |
| **Internal Employee** | `budi.santoso@widatra.co.id` | `Password123!` | Akun karyawan (NIK terdaftar) |
| **External User** | `ayu.pratiwi@example.com` | `Password123!` | Akun pelamar eksternal |

---

## 📋 Status Pengerjaan (Handover Checklist)

### ✅ Modul yang Sudah Selesai & Teruji di Node.js (Port 8001)
1. **Autentikasi & Multi-Role (`/api/auth`)**: Login publik, admin login, registrasi internal (wajib NIK) & eksternal, dual token (Sanctum + JWT), ganti password, profile update.
2. **Katalog Produk (`/api/products`)**: CRUD cairan infus dasar, nutrisi spesifik, larutan irigasi, dan alkes.
3. **Berita & Acara (`/api/articles`)**: CRUD artikel, filter status `Published` vs `Draft`, dan artikel terkait (*related articles*).
4. **CSR & Keberlanjutan (`/api/csr-programs`)**: CRUD program keberlanjutan & pilar CSR.
5. **CMS Profil Perusahaan & Tur Pabrik (`/api/company-profile`, `/api/factory-tour-content`)**: Banner hero, galeri fasilitas steril, foto jajaran direksi.
6. **Pustaka Media & Berkas (`/api/media`, `/api/documents`)**: Upload gambar (maks 15MB) langsung ke shared storage, rename, replace file, dan delete.
7. **Kotak Masuk Kontak (`/api/contact-inquiries`)**: Submit pesan publik, inbox admin, counter unread, reply, dan archive.
8. **Chatbot Maskot Coby AI (`/api/chat`)**: Multi-model fallback, guardrail topik Widatra, dan knowledge engine offline lengkap.
9. **Karier & ATS Pelamar (`/api/jobs`, `/api/applications`)**: Posting lowongan, upload CV kandidat, pipeline seleksi, jadwal interview, dan catatan HR.
10. **Booking Kunjungan Pabrik (`/api/tour-bookings`)**: Booking publik, kode tiket `FT-YYMMDD-XXXX`, lookup status publik, persetujuan jadwal, dan catatan logistik.
11. **Acara Komunitas (`/api/community-events`)**: Pengajuan proposal internal (`Internal Employee`), review & moderasi multi-stage (`approve`/`reject`/`revision`), dan publikasi langsung ke artikel berita (`Event Moderator`).
12. **Manajemen Pengguna & Log Audit (`/api/admin/users`, `/api/admin/audit-logs`)**: Daftar pengguna, update role (sinkronisasi Spatie `model_has_roles`), suspend/aktivasi akun, dan pencatatan audit log terperinci (`Super Admin`).

---

### ⏳ Tugas yang Tersisa Sebelum Deployment Hari Rabu

1. **Modul Notifikasi Akun (`/api/notifications`)**:
   - `GET /api/notifications` (daftar notifikasi terhubung ke user yang login).
   - `PATCH /api/notifications/:id/read` & `POST /api/notifications/mark-all-read`.
2. **Pengalihan Port Frontend (Vite Proxy Switchover) & Pengujian Terpadu Seluruh 8 Role**:
   - Di `widatra-bhakti-fe/vite.config.ts`, alihkan target proxy `/api` dan `/storage` dari `http://127.0.0.1:8000` (Laravel) ke `http://127.0.0.1:8001` (Node).
   - Pengujian terpadu seluruh 8 role di antarmuka web.
