---
name: ponytail-anti-bloat
description: >-
  Enforces YAGNI (You Aren't Gonna Need It), KISS, zero dependency bloat,
  and concise native ES6+ JavaScript/TypeScript code.
  Use before adding npm packages, designing abstractions, or reviewing diffs across the workspace.
---

# Ponytail Anti-Bloat

Prinsip penulisan kode yang ramping, jujur, mudah dibaca, dan bebas *over-engineering* di seluruh workspace.

## 1. Prinsip YAGNI & Anti-Over-Engineering

1. **Kerjakan Kebutuhan Nyata Hari Ini**:
   - Jangan membuat *factory class*, *abstract base class*, *event bus*, atau config layer rumit untuk fitur yang saat ini hanya dipakai di 1 tempat.
   - Abstraksi (ekstraksi helper/hook) hanya dilakukan ketika ada minimal 2–3 blok logika nyata yang identik, bukan spekulasi masa depan.
2. **Ringkas & Langsung ke Inti**:
   - Gunakan *early return* untuk menjaga nesting tetap dangkal (maksimal 2–3 level indentasi).
   - Pecah fungsi panjang (>40–60 baris) menjadi fungsi kecil yang *single-purpose* dengan nama yang jelas.
   - Hapus *dead code*, variabel tak terpakai, `console.log` debug, serta komentar basa-basi yang sekadar mengulang apa yang sudah jelas tertulis di kode (komentari *why*, bukan *what*).

---

## 2. Kebijakan Ketat Dependensi `npm` (Zero Dependency Bloat)

**DILARANG** menambah paket `npm` baru untuk kebutuhan sepele yang bisa diselesaikan dengan ES6+, Native Node.js/Web API, atau library yang sudah terpasang di repo ini:

| Kebutuhan | DILARANG Install | Gunakan Ini (Sudah Native / Ada di Repo) |
| :--- | :--- | :--- |
| HTTP request | `axios`, `node-fetch`, `got` | `fetch()` native (Node 20+ & browser) / `src/lib/api-client.ts` |
| Generate UUID / token acak | `uuid`, `nanoid`, `shortid` | `crypto.randomUUID()` / `crypto.randomBytes()` bawaan Node/Web |
| Manipulasi array / object / clone | `lodash`, `underscore`, `ramda` | `map`, `filter`, `reduce`, `Set`, `Map`, `Object.groupBy`, `structuredClone()` |
| Format tanggal ringan | `moment`, `dayjs` | `Intl.DateTimeFormat` native (atau `date-fns` yang sudah ada di FE) |
| Validasi string / email / angka | `validator`, `is-odd`, `joi` (duplikat) | `zod` yang sudah terpasang di FE & BE |
| Gabung CSS class | `classnames` | `clsx` + `tailwind-merge` via helper `cn()` di repo |
| Query string URL | `qs`, `query-string` | `URL` dan `URLSearchParams` native |

### Syarat Jika Benar-Benar Harus Menambah Package Baru
1. Pastikan masalah tidak bisa diselesaikan rapi dalam <=30 baris TypeScript/ES6+ native.
2. Pastikan tidak ada library serupa yang sudah terpasang di `package.json`.
3. Perhatikan ukuran bundle (khususnya di `widatra-bhakti-fe`) dan status maintenance package.

---

## 3. Checklist Review Sebelum Commit

1. Cek `git diff`: adakah package baru di `package.json` yang sebenarnya bisa diganti native JS?
2. Adakah wrapper/file baru yang bisa disederhanakan atau langsung memakai utilitas repo (`src/utils/http.ts`, `src/lib/api-client.ts`, `src/lib/utils.ts`)?
3. Pastikan build tetap bersih (`npm run build`) dan tidak menambah warning bundle bloat tanpa alasan kuat.
