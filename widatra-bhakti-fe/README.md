# PT Widatra Bhakti — Frontend v2

## Cara Menjalankan

```bash
# 1. Extract ZIP ini
# 2. Masuk ke folder project
cd widatra-bhakti-frontend

# 3. Install dependencies
npm install

# 4. Jalankan dev server
npm run dev

# 5. Buka browser di http://localhost:5173
```

## Build Production

```bash
npm run build
npm run preview
```

## Stack
- React 19 + TypeScript
- TanStack Router v1 (file-based routing)
- Tailwind CSS v4
- shadcn/ui components

## Struktur Utama
- `src/routes/` — semua halaman (file-based routing)
- `src/components/site-nav.tsx` — Navbar utama (SATU implementasi)
- `src/components/site-footer.tsx` — Footer
- `src/components/page-hero.tsx` — Hero section full-bleed
- `src/assets/` — semua gambar
