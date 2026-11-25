---
name: react-perf-state-guardian
description: >-
  Enforces modular React architecture, custom hooks/TanStack Query for API calls,
  mandatory Loading/Error/Empty UI states, and render-efficiency best practices.
  Use when building, refactoring, or reviewing components, hooks, or routes in widatra-bhakti-fe/.
---

# React Perf & State Guardian

Panduan arsitektur komponen, manajemen state, dan efisiensi render untuk frontend `widatra-bhakti-fe` (React 19 + TypeScript + TanStack Router + TanStack React Query + Tailwind CSS).

## 1. Arsitektur Komponen Modular & Data Fetching

1. **Pemisahan Tanggung Jawab yang Jelas**:
   - **`src/routes/`**: Tipis — fokus pada definisi route, parameter URL, layout section, dan merangkai komponen.
   - **`src/components/`**: Komponen UI reusable & presentasional. Pecah komponen yang mulai melebihi ~200–250 baris atau punya lebih dari satu tanggung jawab menjadi sub-komponen terfokus.
   - **`src/hooks/` & `src/lib/`**: Seluruh pemanggilan API (`api` dari `src/lib/api-client.ts`), transformasi data, dan query caching (`useQuery` / `useMutation` dari `@tanstack/react-query`) wajib dibungkus di custom hooks atau store — **dilarang** melakukan `fetch()` mentah berulang langsung di dalam komponen UI.
2. **Form & Validasi Client**:
   - Gunakan `react-hook-form` + `@hookform/resolvers/zod` dengan skema Zod yang jelas untuk form interaktif, dan tampilkan error validasi server (`ApiError.errors`) pada field terkait.

---

## 2. Penanganan Wajib 3 Kondisi UI (Loading, Error, Empty)

Setiap komponen atau halaman yang menampilkan data asinkron dari API **wajib** menangani ketiga kondisi berikut secara eksplisit (tidak boleh layar blank atau crash saat `undefined`):

1. **Loading State (`isLoading` / `isPending`)**:
   - Tampilkan skeleton placeholder atau indikator loading yang stabil dimensinya (mencegah *layout shift* / CLS).
   - Pada tombol submit/mutasi, tampilkan status loading & `disabled` untuk mencegah *double submit*.
2. **Error State (`isError` / `error`)**:
   - Tampilkan pesan error yang informatif dan ramah pengguna (bukan stack trace mentah), disertai aksi pemulihan seperti tombol **Coba Lagi (`refetch()`)** atau navigasi kembali.
3. **Empty State (`data.length === 0`)**:
   - Ketika data sukses dimuat namun kosong (termasuk hasil pencarian/filter kosong), tampilkan komponen empty state yang rapi beserta ajakan aksi atau reset filter.

---

## 3. Efisiensi Re-Render & Kebersihan Hook

1. **Hindari `useEffect` untuk Derived State**:
   - Jika suatu nilai dapat dihitung dari `props` atau `state` yang sudah ada (contoh: daftar terfilter, total jumlah, label terformat), hitung langsung di body komponen saat render — **jangan** duplikasi ke `useState` baru lalu sinkronisasi pakai `useEffect` (memicu render ganda yang tidak perlu).
2. **Kolokasi State (Keep State Local)**:
   - Letakkan state serendah mungkin di pohon komponen. Misalnya, state buka/tutup modal, input pencarian lokal, atau hover card jangan ditaruh di komponen root halaman jika hanya dipakai oleh satu sub-komponen.
3. **Gunakan `React.memo`, `useMemo`, dan `useCallback` Secara Bijak**:
   - **Jangan** membungkus setiap fungsi/nilai kecil dengan `useMemo`/`useCallback` (*premature optimization* justru menambah overhead memori).
   - Gunakan `useMemo` hanya untuk kalkulasi/sorting/filtering data besar yang mahal atau objek referensi yang menjadi dependensi `useEffect`/komponen ter-memo.
   - Gunakan `useCallback` + `React.memo` hanya ketika callback dikirim sebagai prop ke komponen anak yang berat/daftar panjang dan benar-benar di-memo.
4. **Key List & Cleanup**:
   - Selalu gunakan ID unik yang stabil untuk `key` dalam `.map()` (jangan gunakan index array pada daftar yang bisa berubah/diurutkan/dihapus).
   - Pastikan listener window, timer (`setTimeout`/`setInterval`), dan `AbortController` dibersihkan di return function `useEffect`.

---

## 4. Checklist Verifikasi Sebelum Selesai

1. Jalankan type-check & production build:
   ```bash
   cd widatra-bhakti-fe
   npm run build
   ```
2. Pastikan ketiga kondisi (**Loading**, **Error**, **Empty**) tertangani di UI baru/terubah dan tidak ada `useEffect` yang hanya menyalin props/state ke state lain.
