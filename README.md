# GPN 08 — Gerakan Persatuan Nasional 08

Portal resmi dan sistem informasi terpadu **Gerakan Persatuan Nasional 08**: profil organisasi
berjenjang (Pusat, Provinsi, Kota/Kabupaten), pendaftaran anggota, dan **Dashboard Charging Point
Service System (CPSS)** berupa peta sebaran titik layanan di seluruh Indonesia dengan alur
persetujuan berjenjang.

> **Status: Demo.** Tahap awal dijalankan sebagai situs statis di GitHub Pages. Seluruh data
> pada mode demo tersimpan di `localStorage` peramban, sehingga seluruh alur — termasuk
> pengajuan, verifikasi, dan persetujuan — dapat diperagakan tanpa server. Backend FastAPI +
> PostgreSQL sudah tersedia lengkap di repositori ini untuk tahap produksi.

---

## Daftar Isi

1. [Fitur](#fitur)
2. [Alur Persetujuan Berjenjang](#alur-persetujuan-berjenjang)
3. [Akun Demo](#akun-demo)
4. [Arsitektur](#arsitektur)
5. [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
6. [Deploy Demo ke GitHub Pages](#deploy-demo-ke-github-pages)
7. [Beralih ke Backend Sungguhan](#beralih-ke-backend-sungguhan)
8. [Referensi API](#referensi-api)
9. [Pengujian](#pengujian)
10. [Struktur Proyek](#struktur-proyek)
11. [Catatan Produksi](#catatan-produksi)

---

## Fitur

### Halaman Publik

| Halaman | Rute | Isi |
| --- | --- | --- |
| Beranda | `/` | Hero dengan pratinjau peta langsung, empat pilar gerakan, tiga jenjang organisasi, alur persetujuan, berita terbaru |
| Profil | `/profil` | Identitas, visi & misi, lini masa, serta uraian lengkap **GPN 08 Pusat (DPP)**, **Provinsi (DPW)**, dan **Kota/Kabupaten (DPD)** |
| Struktur Organisasi | `/struktur` | Bagan kepengurusan DPP, jenjang DPW/DPD, dan matriks kewenangan |
| **Dashboard CPSS** | `/cpss` | **Peta Indonesia interaktif** berisi seluruh titik yang telah disetujui, filter pulau/provinsi/kategori/pencarian, tiga jenis basemap, kartu statistik, dan analitik sebaran |
| Pendaftaran Anggota | `/pendaftaran` | Formulir empat langkah dengan validasi dan bukti pendaftaran |
| Berita | `/berita`, `/berita/[id]` | Daftar dan detail berita organisasi |
| Kontak | `/kontak` | Formulir pesan, kantor sekretariat & perwakilan, kontak per bidang, FAQ |
| Masuk | `/login` | Autentikasi dengan pengisian akun demo sekali klik |

### Dashboard Internal (wajib masuk)

| Halaman | Rute | Hak Akses |
| --- | --- | --- |
| Ringkasan | `/dashboard` | Semua jenjang — statistik dan notifikasi sesuai cakupan wilayah |
| Peta Internal | `/dashboard/peta` | Semua jenjang — menampilkan titik pada **semua status**, bukan hanya yang disetujui |
| Pengajuan Titik | `/dashboard/pengajuan` | Semua jenjang — daftar pengajuan dengan filter status |
| Ajukan Titik Baru | `/dashboard/pengajuan/baru` | Tim lapangan — formulir empat langkah dengan **pemilih koordinat di peta** dan tombol "gunakan lokasi saya" |
| Verifikasi Wilayah | `/dashboard/verifikasi` | **DPW Provinsi** dan DPP |
| Persetujuan Pusat | `/dashboard/persetujuan` | **DPP Pusat** saja |
| Data Anggota | `/dashboard/anggota` | DPW dan DPP — verifikasi keanggotaan dan penerbitan nomor anggota |
| Notifikasi | `/dashboard/notifikasi` | Semua jenjang — otomatis tersaring per peran dan wilayah |

Menu yang tidak sesuai jenjang **tidak ditampilkan** di sidebar, dan halamannya menolak akses
apabila dibuka langsung.

---

## Alur Persetujuan Berjenjang

Inti sistem CPSS. Titik baru **tidak akan tampil di peta publik** sebelum melewati seluruh tahap.

```
┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐   ┌───────────────┐
│ 1. DPD Kota/Kab.     │   │ 2. DPW Provinsi      │   │ 3. DPP Pusat         │   │ 4. Publik     │
│    (tim lapangan)    │──▶│    (verifikasi)      │──▶│    (persetujuan)     │──▶│  /cpss        │
│ Survei + koordinat   │   │ Cek kelayakan teknis │   │ Keputusan akhir      │   │ Tayang di     │
│ GPS + data teknis    │   │ dan administratif    │   │ sesuai standar       │   │ peta nasional │
└──────────────────────┘   └──────────────────────┘   └──────────────────────┘   └───────────────┘
      status: DIAJUKAN          status: DIVERIFIKASI        status: DISETUJUI
            │                          │                          │
            └─ notifikasi ke DPW ──────┴─ notifikasi ke DPP ──────┴─ notifikasi ke DPW & DPD
```

Aturan yang ditegakkan baik di antarmuka maupun di API:

- Hanya **DPW** (dan DPP) yang dapat memverifikasi titik berstatus `DIAJUKAN`.
- Hanya **DPP** yang dapat menyetujui, dan hanya titik yang **sudah** berstatus `DIVERIFIKASI`.
  Upaya menyetujui titik yang belum diverifikasi ditolak dengan `409 Conflict`.
- DPW hanya berwenang atas titik di provinsinya; DPD hanya melihat titik di kotanya.
- Penolakan wajib disertai alasan minimal 10 karakter, dan alasan tersebut dikirim ke pengaju.
- Setiap perubahan status tercatat pada **riwayat proses** yang dapat ditelusuri.

---

## Akun Demo

Kata sandi seluruh akun: **`demo1234`**

| Email | Peran | Cakupan | Dapat melakukan |
| --- | --- | --- | --- |
| `pusat@gpn08.id` | DPP Pusat | Nasional | Persetujuan akhir, tolak, kelola anggota |
| `provinsi@gpn08.id` | DPW Jawa Barat | Provinsi Jawa Barat | Verifikasi, tolak, kelola anggota wilayah |
| `kota@gpn08.id` | DPD Kota Bandung | Kota Bandung | Ajukan titik baru |
| `anggota@gpn08.id` | Anggota / tim lapangan | Kota Bandung | Ajukan titik baru |

Akun tambahan: `sekjen@gpn08.id` (DPP), `provinsi.jakarta@gpn08.id` (DPW DKI),
`kota.bekasi@gpn08.id` (DPD Bekasi).

Tombol **"Atur ulang data demo"** di sidebar dashboard mengembalikan seluruh data ke kondisi awal.

---

## Arsitektur

```
gpn08/
├── frontend/          Next.js 15 (App Router) + TypeScript + Tailwind CSS + Leaflet
├── backend/           FastAPI + SQLAlchemy 2 + PostgreSQL
├── docker-compose.yml Orkestrasi db + api + web
└── .github/workflows/ CI dan deploy otomatis ke GitHub Pages
```

**Frontend** — Next.js 15 dengan `output: 'export'` sehingga menghasilkan situs sepenuhnya
statis (26 halaman, ±3,3 MB) yang dapat dihosting di GitHub Pages tanpa server Node.
Peta memakai **Leaflet** langsung (tanpa react-leaflet) agar bebas dari masalah kompatibilitas
versi React, dengan penanda `divIcon` kustom sehingga tidak memerlukan berkas gambar tambahan.

**Backend** — FastAPI dengan SQLAlchemy 2 (gaya `Mapped[...]`), autentikasi JWT, hashing kata
sandi memakai **scrypt** dari pustaka standar Python (tanpa dependensi terkompilasi), dan
penegakan kewenangan berjenjang pada setiap endpoint.

**Dua mode operasi** dikendalikan variabel lingkungan:

| | Mode Demo | Mode Langsung |
| --- | --- | --- |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | `false` |
| Sumber data | `localStorage` (`src/lib/store.ts`) | FastAPI (`src/lib/api.ts`) |
| Perlu server | Tidak | Ya |
| Untuk | GitHub Pages, presentasi | Produksi |

---

## Menjalankan Secara Lokal

### A. Hanya demo frontend (paling cepat)

```bash
cd frontend
npm install
npm run dev
# buka http://localhost:3000
```

### B. Seluruh tumpukan dengan Docker

```bash
cp backend/.env.example backend/.env    # sesuaikan SECRET_KEY
docker compose up --build
```

| Layanan | Alamat |
| --- | --- |
| Frontend | http://localhost:8080 |
| API | http://localhost:8000 |
| Dokumentasi API (Swagger) | http://localhost:8000/docs |
| PostgreSQL | `localhost:5432` (pengguna/sandi/basis data: `gpn08`) |

### C. Backend tanpa Docker

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Saat pertama dijalankan, aplikasi membuat tabel dan mengisi data awal: 38 provinsi, 7 akun
pengurus, 54 titik CPSS, serta data keanggotaan dan notifikasi. Matikan dengan
`SEED_ON_STARTUP=false`.

---

## Deploy Demo ke GitHub Pages

Alur kerja `.github/workflows/deploy-pages.yml` sudah menangani seluruh prosesnya, termasuk
menentukan `basePath` secara otomatis dari nama repositori.

```bash
git init
git add .
git commit -m "GPN 08: portal organisasi dan dashboard CPSS"
git branch -M main
git remote add origin https://github.com/<user>/<nama-repo>.git
git push -u origin main
```

Lalu di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Setiap `push` ke `main` akan membangun ulang dan menerbitkan demo ke
`https://<user>.github.io/<nama-repo>/`.

**Build manual** (untuk memeriksa hasil sebelum mengunggah):

```bash
cd frontend
NEXT_PUBLIC_BASE_PATH=/<nama-repo> NEXT_PUBLIC_DEMO_MODE=true npm run build
# hasil ada di frontend/out/
```

Berkas `public/.nojekyll` sudah disertakan agar GitHub Pages tidak mengabaikan direktori
`_next/`.

---

## Beralih ke Backend Sungguhan

1. Jalankan backend dan PostgreSQL (lihat bagian B atau C di atas).
2. Isi `frontend/.env.local`:

   ```env
   NEXT_PUBLIC_DEMO_MODE=false
   NEXT_PUBLIC_API_URL=https://api.domain-anda.id/api/v1
   ```

3. Tambahkan asal frontend ke `CORS_ORIGINS` pada `backend/.env`.
4. Bangun ulang frontend.

Pada mode ini `src/lib/store.ts` menarik data dari API saat halaman dimuat
(`hydrateFromApi`) dan meneruskan setiap tindakan — pengajuan, verifikasi, persetujuan,
penolakan, pendaftaran anggota, notifikasi — ke endpoint yang bersesuaian, lalu menyegarkan
state dari server.

---

## Referensi API

Prefiks: `/api/v1`. Dokumentasi interaktif tersedia di `/docs`.

### Autentikasi
| Metode | Endpoint | Keterangan |
| --- | --- | --- |
| `POST` | `/auth/login` | Form `username` + `password`, mengembalikan token JWT |
| `GET` | `/auth/me` | Profil pengguna yang sedang masuk |

### Titik CPSS
| Metode | Endpoint | Kewenangan |
| --- | --- | --- |
| `GET` | `/points/public` | **Publik** — hanya titik berstatus `DISETUJUI` |
| `GET` | `/points` | Terautentikasi — tersaring sesuai jenjang |
| `GET` | `/points/{id}` | Terautentikasi — dibatasi cakupan wilayah |
| `POST` | `/points` | Tim lapangan — membuat pengajuan (`DIAJUKAN`) |
| `POST` | `/points/{id}/verify` | **DPW**, DPP |
| `POST` | `/points/{id}/approve` | **DPP saja**, hanya dari status `DIVERIFIKASI` |
| `POST` | `/points/{id}/reject` | DPW, DPP — alasan wajib |

### Keanggotaan, Notifikasi, Statistik
| Metode | Endpoint | Kewenangan |
| --- | --- | --- |
| `POST` | `/members` | **Publik** — pendaftaran anggota |
| `GET` | `/members` | DPW, DPP |
| `PATCH` | `/members/{id}/status` | DPW, DPP — aktivasi menerbitkan nomor anggota |
| `GET` | `/notifications` | Terautentikasi — tersaring per peran & wilayah |
| `POST` | `/notifications/{id}/read`, `/notifications/read-all` | Terautentikasi |
| `GET` | `/provinces` | Publik — 38 provinsi |
| `GET` | `/stats/summary`, `/stats/by-island`, `/stats/by-province` | Publik |

---

## Pengujian

```bash
# Backend — 10 pengujian, mencakup alur penuh DPD → DPW → DPP
cd backend && pytest -q

# Frontend — pemeriksaan tipe dan build
cd frontend && npx tsc --noEmit && npm run build
```

Pengujian backend memverifikasi antara lain bahwa:

- titik baru **tidak** muncul di `/points/public` sebelum disetujui;
- DPP **tidak dapat** menyetujui titik yang belum diverifikasi DPW (`409`);
- DPD **tidak berwenang** memverifikasi (`403`);
- setelah disetujui, titik langsung muncul di endpoint publik;
- NIK ganda pada pendaftaran anggota ditolak (`409`).

---

## Struktur Proyek

```
frontend/src/
├── app/
│   ├── (site)/              Halaman publik (header + footer)
│   │   ├── page.tsx         Beranda
│   │   ├── profil/ struktur/ cpss/ pendaftaran/ berita/ kontak/ login/
│   ├── dashboard/           Dashboard internal (sidebar, terproteksi)
│   ├── layout.tsx  globals.css  not-found.tsx  icon.svg
├── components/
│   ├── cpss/                Dashboard peta, kartu titik, legenda, pratinjau hero
│   ├── dashboard/           Kerangka sidebar, tabel titik, modal detail, halaman tinjauan
│   ├── forms/               Primitif formulir, pendaftaran, login, kontak
│   ├── map/                 leaflet-map.tsx (tampilan), picker-map.tsx (pemilih koordinat)
│   ├── ui/                  Logo, ikon SVG inline, badge, heading, kartu statistik
│   └── site-header.tsx  site-footer.tsx  page-hero.tsx
└── lib/
    ├── data/                provinces (38), org, points (54), members, users, news
    ├── api.ts               Klien FastAPI + pemetaan snake_case → camelCase
    ├── auth.tsx             Konteks autentikasi
    ├── store.ts             State demo + sinkronisasi API
    ├── hooks.ts  types.ts  utils.ts

backend/app/
├── main.py                  Aplikasi FastAPI, CORS, lifespan, seeding
├── core/                    config.py (pydantic-settings), security.py (scrypt + JWT)
├── db/session.py            Engine, session, kelas Base
├── models/models.py         Province, User, CpssPoint, PointHistory, Member, Notification
├── schemas/schemas.py       Skema Pydantic v2
├── api/                     deps.py, routes_auth, routes_points, routes_members,
│                            routes_notifications, routes_stats
└── services/                seed.py, seed_data.py
```

---

## Catatan Produksi

Hal-hal yang **wajib** disesuaikan sebelum dipakai sungguhan:

- **`SECRET_KEY`** — ganti dengan nilai acak minimal 32 karakter; jangan pakai nilai bawaan.
- **Migrasi basis data** — ganti `Base.metadata.create_all()` di `app/main.py` dengan Alembic.
- **Seeding** — setel `SEED_ON_STARTUP=false`.
- **CORS** — batasi `CORS_ORIGINS` hanya pada domain frontend resmi.
- **HTTPS dan reverse proxy** — jalankan di belakang Nginx/Caddy dengan TLS.
- **Data contoh** — seluruh nama pengurus, berita, dan titik CPSS pada repositori ini adalah
  **data fiktif untuk keperluan demo**, bukan data organisasi yang sesungguhnya.

---

© Gerakan Persatuan Nasional 08
