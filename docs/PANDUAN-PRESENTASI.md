# Panduan Presentasi & Skenario Demo — GPN 08

Dokumen ini dipakai oleh pembawa materi saat memperagakan aplikasi kepada pengurus,
mitra, atau calon pendukung. Durasi total ± **12–15 menit**.

---

## Persiapan (5 menit sebelum mulai)

1. Buka demo: `https://<user>.github.io/<nama-repo>/` — atau lokal dengan
   `cd frontend && npm run dev`.
2. Masuk ke `/dashboard` dan klik **"Atur ulang data demo"** agar data bersih.
3. Keluar dari akun (logout) supaya presentasi dimulai dari sudut pandang publik.
4. Siapkan tiga tab peramban:
   - Tab A — halaman publik
   - Tab B — dashboard DPW (`provinsi@gpn08.id`)
   - Tab C — dashboard DPP (`pusat@gpn08.id`)
5. Pastikan koneksi internet aktif (peta memuat ubin dari penyedia peta daring).

**Kata sandi seluruh akun demo: `demo1234`**

---

## Alur Presentasi

### Bagian 1 — Wajah Organisasi (2 menit)

**Halaman: `/` (Beranda)**

Poin bicara:
- "GPN 08 adalah organisasi kemasyarakatan dengan kepengurusan berjenjang di 38 provinsi
  dan 312 kota/kabupaten."
- Tunjuk **peta langsung di hero**: "Yang Anda lihat ini bukan gambar — ini peta nyata berisi
  titik layanan yang sudah disetujui, diperbarui otomatis."
- Gulir ke **empat pilar** dan **tiga jenjang organisasi**.

### Bagian 2 — Profil & Struktur (2 menit)

**Halaman: `/profil` lalu `/struktur`**

- Di `/profil`, klik pintasan **DPP / DPW / DPD** di bagian atas: "Setiap jenjang punya mandat
  dan perangkat organisasi yang berbeda."
- Pada bagian DPW, tunjukkan **sebaran 38 DPW** yang dikelompokkan per pulau.
- Pindah ke `/struktur`, tunjukkan **bagan kepengurusan DPP**, lalu gulir ke
  **matriks kewenangan**: "Tabel inilah yang menjadi dasar hak akses di sistem — dan tepat
  itulah yang akan saya buktikan sebentar lagi."

### Bagian 3 — Dashboard CPSS (3 menit) ⭐ **Inti presentasi**

**Halaman: `/cpss`**

- "Ini halaman terpenting: seluruh titik Charging Point Service System se-Indonesia."
- Tunjukkan **empat kartu statistik**: jumlah titik, provinsi terjangkau, kapasitas terpasang,
  kota/kabupaten terlayani.
- Peragakan interaksi:
  1. Klik salah satu penanda → **popup** berisi kapasitas, konektor, jam operasional, koordinat,
     dan penanggung jawab.
  2. Klik tab pulau **"Sulawesi"** → peta dan daftar menyaring bersamaan.
  3. Ketik `Bandung` di kotak pencarian.
  4. Ganti jenis peta ke **Satelit** lewat menu tarik-turun.
  5. Klik salah satu item di daftar kiri → peta terbang ke titik tersebut.
- Gulir ke bawah: **sebaran per pulau** dan **provinsi dengan titik terbanyak**.

> Kalimat kunci: *"Setiap titik di peta ini sudah melewati verifikasi wilayah dan persetujuan
> pusat. Tidak ada satu pun titik yang bisa muncul di sini tanpa melalui keduanya."*

### Bagian 4 — Pendaftaran Anggota (1,5 menit)

**Halaman: `/pendaftaran`**

- Tunjukkan **empat langkah** dengan indikator kemajuan.
- Sengaja klik **"Lanjutkan"** dengan kolom kosong → tunjukkan **pesan validasi** muncul.
- Isi cepat langkah 1, lanjut ke langkah 2, lalu pilih provinsi: perhatikan **daftar kota
  menyesuaikan otomatis** dan muncul keterangan DPW mana yang akan memverifikasi.
- Tidak perlu diselesaikan; cukup tunjukkan alurnya lalu lanjut.

### Bagian 5 — Alur Persetujuan Berjenjang (5 menit) ⭐ **Puncak presentasi**

Inilah bagian yang membedakan sistem ini dari sekadar situs profil.

#### Langkah 5a — DPD mengajukan titik

Masuk sebagai `kota@gpn08.id` (DPD Kota Bandung).

- Tunjukkan **sidebar**: hanya ada Ringkasan, Peta Internal, Pengajuan Titik, Notifikasi.
  *"Perhatikan — tidak ada menu Verifikasi maupun Persetujuan. Sistem menyembunyikannya
  karena jenjang ini memang tidak berwenang."*
- Buka **Ajukan Titik Baru**:
  - Nama: `CPSS Demo Presentasi`
  - Kecamatan: `Coblong`, Alamat: `Jl. Ir. H. Juanda No. 100`
  - **Klik langsung di peta** untuk menentukan koordinat — penanda dapat digeser.
  - Lanjutkan ke data teknis, penanggung jawab, lalu **Kirim Pengajuan**.
- Muncul layar konfirmasi dengan **kode titik** dan tiga langkah berikutnya.

Buka tab publik `/cpss`, cari `Demo Presentasi` → **belum ada**.
*"Karena belum disetujui."*

#### Langkah 5b — DPW memverifikasi

Pindah ke tab DPW (`provinsi@gpn08.id`).

- Tunjukkan **lencana angka merah** pada menu "Verifikasi Wilayah" — notifikasi otomatis.
- Buka **Verifikasi Wilayah** → titik tadi ada di daftar "Perlu Tindakan".
- Klik barisnya → modal detail: peta mini, data teknis, **riwayat proses**.
- Isi catatan, klik **"Verifikasi & Teruskan ke DPP"**.

#### Langkah 5c — DPP menyetujui

Pindah ke tab DPP (`pusat@gpn08.id`).

- Tunjukkan **notifikasi** bertambah di menu "Persetujuan Pusat".
- Buka **Persetujuan Pusat** → klik titik → **"Setujui & Tayangkan"**.
- Tunjukkan **riwayat proses** kini berisi tiga tahap lengkap dengan nama pelaku dan waktu.

#### Langkah 5d — Titik tayang

Kembali ke tab publik `/cpss`, muat ulang, cari `Demo Presentasi` → **sudah muncul di peta**.

> Kalimat penutup bagian ini: *"Dari lapangan sampai tayang nasional, semuanya tercatat,
> berjenjang, dan bisa diaudit. Tidak ada berkas yang hilang atau tertahan tanpa penanganan."*

### Bagian 6 — Penutup (1 menit)

- Buka `/kontak` sekilas.
- Rangkum tiga hal: **satu data**, **satu peta**, **satu alur persetujuan**.
- Sebutkan tahap berikutnya: backend FastAPI + PostgreSQL sudah siap, tinggal dinyalakan untuk
  produksi (lihat `README.md` bagian "Beralih ke Backend Sungguhan").

---

## Pertanyaan yang Sering Muncul

**"Apakah data ini nyata?"**
Belum. Seluruh nama pengurus, berita, dan titik CPSS adalah data contoh untuk peragaan.
Struktur dan alur kerjanya yang nyata dan siap diisi data sebenarnya.

**"Di mana datanya tersimpan?"**
Pada demo ini di peramban masing-masing pengunjung, sehingga situs dapat berjalan tanpa server.
Pada produksi, di PostgreSQL melalui API FastAPI yang sudah tersedia di repositori ini.

**"Bisakah DPD menyetujui titiknya sendiri?"**
Tidak. Pembatasan ditegakkan di dua lapis: menu disembunyikan di antarmuka, dan API menolak
permintaan dengan galat `403`. DPP pun tidak dapat menyetujui titik yang belum diverifikasi DPW
— akan ditolak dengan galat `409`.

**"Berapa lama prosesnya?"**
Target layanan tiga hari kerja untuk verifikasi DPW. Karena berkas berpindah otomatis disertai
notifikasi, tidak ada tahap yang menunggu tanpa pemberitahuan.

**"Apakah bisa dipakai di ponsel?"**
Bisa. Seluruh halaman termasuk peta dan dashboard menyesuaikan layar ponsel.

---

## Kalau Terjadi Kendala

| Gejala | Penanganan |
| --- | --- |
| Peta kosong / abu-abu | Periksa koneksi internet — ubin peta dimuat dari penyedia daring |
| Data demo berantakan | Sidebar dashboard → **"Atur ulang data demo"** |
| Titik tidak muncul setelah disetujui | Muat ulang halaman `/cpss` (tab publik) |
| Tidak bisa masuk | Kata sandi seluruh akun demo: `demo1234` |
| Menu verifikasi tidak terlihat | Memang disembunyikan untuk jenjang DPD — itu perilaku yang benar |
