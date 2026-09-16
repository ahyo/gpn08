# Catatan Arsitektur — GPN 08

Dokumen untuk pengembang yang akan melanjutkan atau meninjau kode ini.

## Keputusan Desain

### 1. Static export, bukan server Next.js

`output: 'export'` dipilih agar demo dapat dihosting di GitHub Pages tanpa runtime Node.
Konsekuensinya: tidak ada Route Handler, Server Action, maupun middleware. Seluruh logika
berjalan di sisi klien, dan data demo disimpan di `localStorage`.

`basePath` diambil dari `NEXT_PUBLIC_BASE_PATH` saat build sehingga aplikasi bekerja baik di
akar domain maupun di subdirektori `/nama-repo` milik GitHub Pages.

### 2. Leaflet langsung, tanpa react-leaflet

`react-leaflet` mengikat versi React secara ketat (v4 untuk React 18, v5 untuk React 19).
Membungkus Leaflet sendiri dalam `useEffect` menghilangkan ketergantungan itu sepenuhnya dan
memberi kendali penuh atas siklus hidup peta.

Penanda memakai `L.divIcon` berisi HTML, bukan gambar. Ini menghindari masalah klasik
`marker-icon.png` yang tidak ditemukan ketika aplikasi dihosting di subdirektori.

Komponen peta dimuat lewat `next/dynamic` dengan `ssr: false`, **dan** baru dirender setelah
`useMounted()` bernilai true. Tanpa penjagaan kedua ini, markup hasil prerender dan render
klien pertama bisa berbeda dan memicu galat hidrasi React.

### 3. Menghindari galat hidrasi

Dua pola dipakai konsisten:

- `useDemoState()` mengembalikan `ready`. Render pertama (server maupun klien) selalu memakai
  snapshot benih yang sama; data `localStorage` baru masuk setelah `useEffect`. Komponen
  menampilkan `—` atau kerangka pemuatan selama `ready` masih `false`.
- Penentuan menu aktif menormalkan `usePathname()` terhadap akhiran `/` dan `index.html`,
  sehingga status aktif tetap sama baik URL diakses sebagai `/profil/` maupun
  `/profil/index.html`.

### 4. Koordinat disimpan sebagai teks di formulir

Kolom lintang/bujur menyimpan **string**, bukan `number`. Saat pengguna mengetik `-6.9`,
nilai antara `"-"` akan menjadi `NaN` bila langsung dikonversi, dan `NaN` yang diteruskan ke
`L.marker()` membuat Leaflet melempar galat sehingga halaman berhenti bekerja. Konversi ke
angka dilakukan sekali di `useMemo` `coords`, lengkap dengan pemeriksaan rentang wilayah
Indonesia. Komponen peta juga menolak koordinat non-finite sebagai lapis pengaman kedua.

### 5. Satu sumber kebenaran untuk state demo

`src/lib/store.ts` adalah satu-satunya pemilik data demo. Ia memakai pola pub/sub sederhana
(`subscribe` + `commit`) sehingga setiap komponen yang memakai `useDemoState()` ikut
diperbarui ketika ada perubahan — misalnya saat DPP menyetujui titik, peta publik, notifikasi,
dan kartu statistik ikut menyesuaikan tanpa perlu muat ulang.

Ketika `NEXT_PUBLIC_DEMO_MODE=false`, fungsi mutasi yang sama juga meneruskan tindakan ke API
(`syncWithApi`) lalu menarik ulang state dari server. Pembaruan lokal bersifat optimistik agar
antarmuka tetap responsif.

### 6. Hashing kata sandi memakai scrypt pustaka standar

`passlib` + `bcrypt` kerap bermasalah versi, dan `argon2-cffi` memerlukan kompilasi. `hashlib.scrypt`
tersedia di pustaka standar Python dan memenuhi rekomendasi OWASP (N=2¹⁵, r=8, p=1). Perhatikan
bahwa OpenSSL membatasi memori scrypt pada 32 MiB secara bawaan, sementara parameter tersebut
membutuhkan tepat 32 MiB — karena itu `maxmem` dinaikkan secara eksplisit di
`app/core/security.py`.

### 7. Penegakan kewenangan di dua lapis

Antarmuka menyembunyikan menu yang tidak relevan, tetapi itu **bukan** mekanisme keamanan.
Penegakan sesungguhnya ada di API melalui dependensi `require_roles()` ditambah pemeriksaan
cakupan wilayah dan pemeriksaan transisi status. Pengujian di `backend/tests/test_api.py`
memverifikasi keduanya.

## Alur Data Titik CPSS

```
PointStatus:  DIAJUKAN ──verify(DPW)──▶ DIVERIFIKASI ──approve(DPP)──▶ DISETUJUI
                  │                          │
                  └──── reject(DPW/DPP) ─────┴────────▶ DITOLAK
```

- `GET /points/public` hanya mengembalikan `DISETUJUI` — inilah satu-satunya sumber peta publik.
- `GET /points` menyaring menurut jenjang: DPP melihat semua, DPW satu provinsi, DPD satu kota.
- Setiap transisi menambah satu baris `PointHistory` dan membuat `Notification` untuk jenjang
  berikutnya.

## Yang Perlu Dikerjakan Berikutnya

1. **Alembic** menggantikan `Base.metadata.create_all()`.
2. **Unggah foto lokasi** pada pengajuan titik (saat ini belum ada; perlu penyimpanan objek).
3. **Akun pengguna untuk anggota** — saat ini `Member` dan `User` masih entitas terpisah;
   aktivasi keanggotaan belum otomatis membuat akun login.
4. **Penomoran kode titik** memakai urutan basis data yang aman terhadap kondisi balapan
   (saat ini memakai `COUNT(*)` per provinsi).
5. **Uji end-to-end otomatis** untuk frontend (Playwright) di dalam CI.
