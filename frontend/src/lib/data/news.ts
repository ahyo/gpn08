import type { NewsItem } from '@/lib/types';

export const NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'GPN 08 Resmikan 250 Titik Charging Point Service System di 18 Provinsi',
    excerpt:
      'Peresmian serentak menandai tahap kedua program CPSS yang menargetkan 1.000 titik layanan pada akhir 2026.',
    body: 'Dewan Pimpinan Pusat GPN 08 meresmikan 250 titik Charging Point Service System (CPSS) yang tersebar di 18 provinsi. Peresmian dilakukan secara serentak melalui sambungan daring dari kantor DPP, disaksikan oleh perwakilan DPW dan DPD di seluruh Indonesia.\n\nKetua Umum DPP GPN 08 menyatakan bahwa CPSS bukan sekadar infrastruktur pengisian daya, melainkan simpul ekonomi kerakyatan. Setiap titik dirancang agar dapat menampung aktivitas UMKM di sekitarnya, sehingga manfaatnya langsung dirasakan warga.\n\nTahap kedua ini menggunakan mekanisme pengajuan berjenjang: tim lapangan DPD mengusulkan titik, DPW melakukan verifikasi lapangan, dan DPP memberikan persetujuan akhir sebelum titik ditayangkan pada dashboard nasional.',
    category: 'Program Nasional',
    date: '2026-09-02',
    author: 'Humas DPP GPN 08',
    readMinutes: 4,
  },
  {
    id: 'n2',
    title: 'Sistem Verifikasi Berjenjang Pangkas Waktu Persetujuan Titik Jadi 3 Hari',
    excerpt:
      'Digitalisasi alur pengajuan membuat proses dari usulan hingga tayang di peta nasional jauh lebih ringkas.',
    body: 'Sebelum platform digital GPN 08 diluncurkan, pengajuan titik CPSS memerlukan waktu rata-rata 21 hari karena bergantung pada dokumen fisik. Dengan alur digital berjenjang, waktu rata-rata turun menjadi tiga hari kerja.\n\nAlurnya sederhana: tim lapangan DPD mengisi formulir pengajuan lengkap dengan koordinat GPS dan dokumentasi. DPW menerima notifikasi seketika, melakukan verifikasi, lalu meneruskan ke DPP. Notifikasi otomatis memastikan tidak ada berkas yang tertahan tanpa penanganan.',
    category: 'Teknologi',
    date: '2026-08-21',
    author: 'Bidang Teknologi Informasi',
    readMinutes: 3,
  },
  {
    id: 'n3',
    title: 'Pelatihan Tim Lapangan Angkatan VII Diikuti 640 Kader dari 34 Provinsi',
    excerpt:
      'Materi mencakup survei lokasi, pengukuran koordinat, keselamatan kelistrikan, dan pelaporan digital.',
    body: 'Bidang Kaderisasi DPP GPN 08 menyelenggarakan Pelatihan Tim Lapangan Angkatan VII yang diikuti 640 kader dari 34 provinsi. Pelatihan berlangsung selama lima hari dengan kombinasi kelas daring dan praktik lapangan.\n\nPeserta yang lulus memperoleh sertifikat Tim Lapangan CPSS dan berhak mengajukan titik melalui platform resmi GPN 08.',
    category: 'Kaderisasi',
    date: '2026-08-09',
    author: 'Bidang Kaderisasi',
    readMinutes: 3,
  },
  {
    id: 'n4',
    title: 'Kolaborasi GPN 08 dan Pemerintah Daerah Perkuat Ekosistem Energi Bersih',
    excerpt:
      'Nota kesepahaman ditandatangani bersama 12 pemerintah provinsi untuk percepatan penyediaan lahan titik CPSS.',
    body: 'GPN 08 menandatangani nota kesepahaman dengan 12 pemerintah provinsi. Kerja sama mencakup penyediaan lahan milik daerah untuk titik CPSS, kemudahan perizinan, serta program edukasi energi bersih bagi masyarakat.\n\nDPW di masing-masing provinsi bertindak sebagai pelaksana teknis kerja sama, dengan pendampingan Bidang Hukum & Advokasi DPP.',
    category: 'Kemitraan',
    date: '2026-07-28',
    author: 'Bidang Hukum & Advokasi',
    readMinutes: 4,
  },
  {
    id: 'n5',
    title: 'Musyawarah Nasional GPN 08 Tetapkan Peta Jalan 2026–2031',
    excerpt:
      'Empat pilar gerakan ditetapkan: kemandirian energi, ekonomi kerakyatan, kaderisasi, dan digitalisasi organisasi.',
    body: 'Musyawarah Nasional GPN 08 menetapkan peta jalan organisasi periode 2026–2031 dengan empat pilar utama. Forum tertinggi organisasi ini dihadiri seluruh ketua DPW dan perwakilan DPD.\n\nSalah satu keputusan penting adalah penguatan sistem informasi terpadu agar seluruh data anggota dan titik CPSS terkonsolidasi dalam satu basis data nasional.',
    category: 'Organisasi',
    date: '2026-07-12',
    author: 'Sekretariat Jenderal',
    readMinutes: 5,
  },
  {
    id: 'n6',
    title: 'Titik CPSS Komunitas Jadi Ruang Belajar Warga tentang Kendaraan Listrik',
    excerpt:
      'Model titik komunitas menggabungkan layanan pengisian daya dengan edukasi dan lapak UMKM binaan GPN 08.',
    body: 'Titik CPSS berkategori komunitas dirancang berbeda dari titik komersial. Selain menyediakan pengisian daya berkapasitas menengah, titik ini menjadi ruang belajar warga mengenai kendaraan listrik, perawatan baterai, dan peluang usaha di sekitarnya.\n\nHingga kini terdapat puluhan titik komunitas yang dikelola bersama DPD dan warga setempat.',
    category: 'Sosial',
    date: '2026-06-30',
    author: 'Bidang UMKM & Ekonomi Kerakyatan',
    readMinutes: 3,
  },
];

export const newsById = (id: string) => NEWS.find((n) => n.id === id);
