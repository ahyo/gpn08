import type { OrgMember } from '@/lib/types';

export interface OrgLevel {
  key: 'pusat' | 'provinsi' | 'kota';
  code: string;
  title: string;
  subtitle: string;
  scope: string;
  description: string;
  mandate: string[];
  stats: { label: string; value: string }[];
  leadership: OrgMember[];
  departments: { name: string; lead: string; focus: string }[];
}

export const ORG_LEVELS: OrgLevel[] = [
  {
    key: 'pusat',
    code: 'DPP',
    title: 'GPN 08 Pusat',
    subtitle: 'Dewan Pimpinan Pusat',
    scope: 'Nasional — 38 Provinsi',
    description:
      'Dewan Pimpinan Pusat (DPP) GPN 08 adalah pemegang kebijakan tertinggi organisasi. DPP menetapkan arah gerakan, standar operasional Charging Point Service System (CPSS), serta memberikan persetujuan akhir atas seluruh titik layanan yang diusulkan daerah.',
    mandate: [
      'Menetapkan Anggaran Dasar/Anggaran Rumah Tangga dan garis besar program nasional.',
      'Memberikan persetujuan akhir (approval) titik CPSS yang telah diverifikasi DPW.',
      'Membina hubungan strategis dengan kementerian, BUMN, dan mitra industri.',
      'Mengelola sistem informasi nasional, data anggota, dan sertifikasi tim lapangan.',
    ],
    stats: [
      { label: 'Provinsi terhubung', value: '38' },
      { label: 'Pengurus inti', value: '24' },
      { label: 'Program nasional', value: '9' },
    ],
    leadership: [
      { name: 'Dr. Bagas Wicaksana, M.M.', position: 'Ketua Umum', initials: 'BW', since: '2021' },
      { name: 'Rahmawati Nursalim, S.T.', position: 'Sekretaris Jenderal', initials: 'RN', since: '2021' },
      { name: 'Ir. Yusuf Maulana', position: 'Bendahara Umum', initials: 'YM', since: '2021' },
      { name: 'Prof. Anindita Sari, Ph.D.', position: 'Ketua Dewan Pembina', initials: 'AS', since: '2021' },
      { name: 'Kolonel (Purn.) Harjanto', position: 'Ketua Dewan Penasihat', initials: 'HJ', since: '2022' },
      { name: 'Melati Rahayu, S.Sos.', position: 'Ketua Bidang Organisasi', initials: 'MR', since: '2022' },
    ],
    departments: [
      { name: 'Bidang Energi & Infrastruktur', lead: 'Ir. Tomi Alamsyah', focus: 'Standarisasi teknis CPSS, audit kelayakan titik, kemitraan penyedia daya.' },
      { name: 'Bidang Teknologi Informasi', lead: 'Galih Nurwanto, M.Kom.', focus: 'Platform digital GPN 08, keamanan data, integrasi peta nasional.' },
      { name: 'Bidang Kaderisasi', lead: 'Nur Aisyah, M.Pd.', focus: 'Pendidikan anggota, pelatihan tim lapangan, sertifikasi teknisi.' },
      { name: 'Bidang Hukum & Advokasi', lead: 'Farhan Abdullah, S.H., M.H.', focus: 'Perizinan, kepatuhan regulasi, pendampingan hukum daerah.' },
      { name: 'Bidang Humas & Media', lead: 'Kirana Dewi', focus: 'Komunikasi publik, kampanye energi bersih, hubungan media.' },
      { name: 'Bidang UMKM & Ekonomi Kerakyatan', lead: 'Bambang Sutrisno', focus: 'Pemberdayaan mitra usaha di sekitar titik CPSS.' },
    ],
  },
  {
    key: 'provinsi',
    code: 'DPW',
    title: 'GPN 08 Provinsi',
    subtitle: 'Dewan Pimpinan Wilayah',
    scope: 'Wilayah Provinsi',
    description:
      'Dewan Pimpinan Wilayah (DPW) menjadi simpul koordinasi antara pusat dan daerah. DPW melakukan verifikasi lapangan atas usulan titik CPSS dari DPD kota/kabupaten sebelum diteruskan ke DPP untuk persetujuan akhir.',
    mandate: [
      'Melakukan verifikasi administratif dan teknis usulan titik CPSS dari DPD.',
      'Mengoordinasikan program nasional agar sesuai karakteristik wilayah.',
      'Membina DPD kota/kabupaten dan tim lapangan di wilayahnya.',
      'Menjalin kerja sama dengan pemerintah provinsi dan mitra regional.',
    ],
    stats: [
      { label: 'DPW aktif', value: '38' },
      { label: 'Rata-rata DPD/DPW', value: '12' },
      { label: 'SLA verifikasi', value: '3 hari' },
    ],
    leadership: [
      { name: 'Hendra Kusuma, S.Kom.', position: 'Ketua DPW', initials: 'HK', province: 'Jawa Barat', since: '2022' },
      { name: 'Siti Nurhaliza Putri, S.H.', position: 'Ketua DPW', initials: 'SP', province: 'DKI Jakarta', since: '2022' },
      { name: 'Bayu Setiawan', position: 'Ketua DPW', initials: 'BS', province: 'Jawa Timur', since: '2022' },
      { name: 'Ratna Kumala', position: 'Ketua DPW', initials: 'RK', province: 'Sumatera Utara', since: '2023' },
      { name: 'I Made Adnyana', position: 'Ketua DPW', initials: 'MA', province: 'Bali', since: '2023' },
      { name: 'Andi Pangeran', position: 'Ketua DPW', initials: 'AP', province: 'Sulawesi Selatan', since: '2023' },
    ],
    departments: [
      { name: 'Biro Verifikasi CPSS', lead: 'Koordinator Wilayah', focus: 'Survei lapangan, validasi koordinat, kelayakan daya dan akses.' },
      { name: 'Biro Organisasi Wilayah', lead: 'Sekretaris DPW', focus: 'Pembentukan dan pembinaan DPD kota/kabupaten.' },
      { name: 'Biro Keanggotaan', lead: 'Wakil Sekretaris', focus: 'Rekrutmen, pendataan, dan kartu tanda anggota wilayah.' },
      { name: 'Biro Kemitraan Daerah', lead: 'Bendahara DPW', focus: 'Kolaborasi dengan Pemda, PLN wilayah, dan dunia usaha.' },
    ],
  },
  {
    key: 'kota',
    code: 'DPD',
    title: 'GPN 08 Kota/Kabupaten',
    subtitle: 'Dewan Pimpinan Daerah',
    scope: 'Kota & Kabupaten',
    description:
      'Dewan Pimpinan Daerah (DPD) adalah ujung tombak gerakan. DPD menggerakkan tim lapangan untuk melakukan survei, mengusulkan titik CPSS baru, serta merawat hubungan dengan komunitas dan warga sekitar titik layanan.',
    mandate: [
      'Melakukan survei dan mengajukan titik CPSS beserta koordinat dan dokumentasi.',
      'Merekrut, melatih, dan mendampingi tim lapangan di tingkat kecamatan.',
      'Menjalankan program sosial dan pemberdayaan warga di tingkat daerah.',
      'Memelihara kualitas layanan titik CPSS yang telah beroperasi.',
    ],
    stats: [
      { label: 'DPD terbentuk', value: '312' },
      { label: 'Tim lapangan', value: '4.180' },
      { label: 'Kecamatan terjangkau', value: '1.964' },
    ],
    leadership: [
      { name: 'Agus Firmansyah', position: 'Ketua DPD', initials: 'AF', province: 'Kota Bandung', since: '2022' },
      { name: 'Dewi Anggraini', position: 'Ketua DPD', initials: 'DA', province: 'Kota Bekasi', since: '2022' },
      { name: 'Reza Fahlevi', position: 'Ketua DPD', initials: 'RF', province: 'Jakarta Selatan', since: '2023' },
      { name: 'Sri Wahyuni', position: 'Ketua DPD', initials: 'SW', province: 'Kota Surabaya', since: '2023' },
      { name: 'Muhammad Iqbal', position: 'Ketua DPD', initials: 'MI', province: 'Kota Medan', since: '2023' },
      { name: 'Ni Luh Putu Ari', position: 'Ketua DPD', initials: 'NA', province: 'Kota Denpasar', since: '2024' },
    ],
    departments: [
      { name: 'Satuan Tim Lapangan', lead: 'Koordinator Lapangan', focus: 'Pendataan titik, foto lokasi, pengukuran koordinat GPS.' },
      { name: 'Seksi Keanggotaan Daerah', lead: 'Sekretaris DPD', focus: 'Pendaftaran anggota baru dan pembinaan kader.' },
      { name: 'Seksi Sosial Kemasyarakatan', lead: 'Wakil Ketua', focus: 'Bakti sosial, edukasi energi bersih, kegiatan kepemudaan.' },
    ],
  },
];

export const orgLevel = (key: OrgLevel['key']) =>
  ORG_LEVELS.find((l) => l.key === key)!;

/** Struktur bagan DPP untuk halaman Struktur Organisasi. */
export const ORG_CHART = {
  top: { name: 'Musyawarah Nasional', position: 'Forum Tertinggi Organisasi', initials: 'MN' },
  advisory: [
    { name: 'Dewan Pembina', position: 'Prof. Anindita Sari, Ph.D.', initials: 'DP' },
    { name: 'Dewan Penasihat', position: 'Kolonel (Purn.) Harjanto', initials: 'DN' },
    { name: 'Dewan Pakar', position: 'Dr. Ir. Sutomo Handoko', initials: 'DK' },
  ],
  chair: { name: 'Dr. Bagas Wicaksana, M.M.', position: 'Ketua Umum DPP GPN 08', initials: 'BW' },
  secondLine: [
    { name: 'Rahmawati Nursalim, S.T.', position: 'Sekretaris Jenderal', initials: 'RN' },
    { name: 'Ir. Yusuf Maulana', position: 'Bendahara Umum', initials: 'YM' },
  ],
  bureaus: [
    'Bidang Energi & Infrastruktur',
    'Bidang Teknologi Informasi',
    'Bidang Kaderisasi',
    'Bidang Hukum & Advokasi',
    'Bidang Humas & Media',
    'Bidang UMKM & Ekonomi Kerakyatan',
  ],
};
