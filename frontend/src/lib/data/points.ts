import type { CpssPoint, PointCategory, PointStatus } from '@/lib/types';

export const CATEGORY_LABEL: Record<PointCategory, string> = {
  SPKLU: 'SPKLU — Pengisian Cepat',
  SPBKLU: 'SPBKLU — Tukar Baterai',
  MOBILE: 'Unit Mobile Charging',
  KOMUNITAS: 'Titik Komunitas GPN 08',
};

export const CATEGORY_SHORT: Record<PointCategory, string> = {
  SPKLU: 'SPKLU',
  SPBKLU: 'SPBKLU',
  MOBILE: 'Mobile',
  KOMUNITAS: 'Komunitas',
};

export const STATUS_LABEL: Record<PointStatus, string> = {
  DRAFT: 'Draft',
  DIAJUKAN: 'Menunggu Verifikasi DPW',
  DIVERIFIKASI: 'Menunggu Persetujuan DPP',
  DISETUJUI: 'Disetujui & Tayang',
  DITOLAK: 'Ditolak',
};

export const STATUS_TONE: Record<PointStatus, 'slate' | 'amber' | 'sky' | 'emerald' | 'rose'> = {
  DRAFT: 'slate',
  DIAJUKAN: 'amber',
  DIVERIFIKASI: 'sky',
  DISETUJUI: 'emerald',
  DITOLAK: 'rose',
};

type Row = [
  code: string,
  name: string,
  prov: string,
  city: string,
  district: string,
  lat: number,
  lng: number,
  cat: PointCategory,
  kw: number,
  conn: number,
  status: PointStatus,
  submitter: string,
  daysAgo: number,
];

const ROWS: Row[] = [
  ['CPSS-JK-001', 'CPSS Plaza Senayan', 'JK', 'Jakarta Pusat', 'Tanah Abang', -6.2255, 106.7993, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Jakarta Pusat', 210],
  ['CPSS-JK-002', 'CPSS Stasiun MRT Bundaran HI', 'JK', 'Jakarta Pusat', 'Menteng', -6.1934, 106.823, 'SPKLU', 120, 3, 'DISETUJUI', 'DPD Jakarta Pusat', 198],
  ['CPSS-JK-003', 'CPSS Blok M Square', 'JK', 'Jakarta Selatan', 'Kebayoran Baru', -6.2441, 106.7981, 'SPBKLU', 25, 8, 'DISETUJUI', 'DPD Jakarta Selatan', 185],
  ['CPSS-JK-004', 'CPSS Kelapa Gading Hub', 'JK', 'Jakarta Utara', 'Kelapa Gading', -6.1583, 106.9066, 'SPKLU', 100, 2, 'DISETUJUI', 'DPD Jakarta Utara', 160],
  ['CPSS-JK-005', 'CPSS Terminal Kalideres', 'JK', 'Jakarta Barat', 'Kalideres', -6.1477, 106.7039, 'KOMUNITAS', 22, 6, 'DISETUJUI', 'DPD Jakarta Barat', 140],
  ['CPSS-JK-006', 'CPSS Cakung Industrial Park', 'JK', 'Jakarta Timur', 'Cakung', -6.1786, 106.9455, 'SPKLU', 200, 4, 'DIVERIFIKASI', 'DPD Jakarta Timur', 6],
  ['CPSS-JB-001', 'CPSS Alun-Alun Bandung', 'JB', 'Kota Bandung', 'Regol', -6.9218, 107.6072, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Bandung', 220],
  ['CPSS-JB-002', 'CPSS Dago Plaza', 'JB', 'Kota Bandung', 'Coblong', -6.8896, 107.6135, 'SPBKLU', 25, 10, 'DISETUJUI', 'DPD Kota Bandung', 205],
  ['CPSS-JB-003', 'CPSS Gedebage Terpadu', 'JB', 'Kota Bandung', 'Gedebage', -6.9455, 107.6903, 'SPKLU', 120, 3, 'DISETUJUI', 'DPD Kota Bandung', 120],
  ['CPSS-JB-004', 'CPSS Summarecon Bekasi', 'JB', 'Kota Bekasi', 'Bekasi Utara', -6.2247, 107.0021, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Bekasi', 150],
  ['CPSS-JB-005', 'CPSS Margonda Depok', 'JB', 'Kota Depok', 'Beji', -6.3706, 106.8317, 'SPKLU', 100, 2, 'DISETUJUI', 'DPD Kota Depok', 132],
  ['CPSS-JB-006', 'CPSS Kebun Raya Bogor', 'JB', 'Kota Bogor', 'Bogor Tengah', -6.5971, 106.7994, 'KOMUNITAS', 22, 6, 'DISETUJUI', 'DPD Kota Bogor', 96],
  ['CPSS-JB-007', 'CPSS Cimahi Techno Park', 'JB', 'Kota Cimahi', 'Cimahi Tengah', -6.8724, 107.5424, 'SPBKLU', 25, 8, 'DIVERIFIKASI', 'DPD Kota Cimahi', 4],
  ['CPSS-JB-008', 'CPSS Rest Area KM 97 Cipularang', 'JB', 'Kab. Bandung Barat', 'Padalarang', -6.8402, 107.4652, 'SPKLU', 200, 6, 'DIAJUKAN', 'DPD Kab. Bandung Barat', 2],
  ['CPSS-JB-009', 'CPSS Pasar Baru Trade Center', 'JB', 'Kota Bandung', 'Andir', -6.9147, 107.6031, 'MOBILE', 30, 2, 'DIAJUKAN', 'DPD Kota Bandung', 1],
  ['CPSS-BT-001', 'CPSS Bandara Soekarno-Hatta T3', 'BT', 'Kota Tangerang', 'Benda', -6.1256, 106.6559, 'SPKLU', 250, 8, 'DISETUJUI', 'DPD Kota Tangerang', 240],
  ['CPSS-BT-002', 'CPSS BSD Green Office Park', 'BT', 'Kota Tangerang Selatan', 'Serpong', -6.3019, 106.6524, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Tangsel', 175],
  ['CPSS-BT-003', 'CPSS Pelabuhan Merak', 'BT', 'Kota Cilegon', 'Pulomerak', -5.9186, 105.9977, 'SPKLU', 120, 3, 'DISETUJUI', 'DPD Kota Cilegon', 110],
  ['CPSS-JT-001', 'CPSS Simpang Lima Semarang', 'JT', 'Kota Semarang', 'Semarang Tengah', -6.9903, 110.4229, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Semarang', 190],
  ['CPSS-JT-002', 'CPSS Solo Balapan', 'JT', 'Kota Surakarta', 'Banjarsari', -7.5566, 110.8221, 'SPBKLU', 25, 8, 'DISETUJUI', 'DPD Kota Surakarta', 165],
  ['CPSS-JT-003', 'CPSS Candi Borobudur Gateway', 'JT', 'Kota Magelang', 'Magelang Utara', -7.4698, 110.2177, 'KOMUNITAS', 22, 4, 'DISETUJUI', 'DPD Kota Magelang', 88],
  ['CPSS-YO-001', 'CPSS Malioboro', 'YO', 'Kota Yogyakarta', 'Gedongtengen', -7.7925, 110.3657, 'SPKLU', 120, 4, 'DISETUJUI', 'DPD Kota Yogyakarta', 200],
  ['CPSS-YO-002', 'CPSS Kampus UGM Bulaksumur', 'YO', 'Kab. Sleman', 'Depok', -7.7713, 110.3776, 'SPBKLU', 25, 10, 'DISETUJUI', 'DPD Kab. Sleman', 145],
  ['CPSS-JI-001', 'CPSS Tunjungan Plaza Surabaya', 'JI', 'Kota Surabaya', 'Genteng', -7.2623, 112.7387, 'SPKLU', 200, 6, 'DISETUJUI', 'DPD Kota Surabaya', 215],
  ['CPSS-JI-002', 'CPSS Pelabuhan Tanjung Perak', 'JI', 'Kota Surabaya', 'Pabean Cantian', -7.2044, 112.7345, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Surabaya', 178],
  ['CPSS-JI-003', 'CPSS Kota Malang Alun-Alun', 'JI', 'Kota Malang', 'Klojen', -7.9826, 112.6308, 'SPBKLU', 25, 8, 'DISETUJUI', 'DPD Kota Malang', 155],
  ['CPSS-JI-004', 'CPSS Juanda Sidoarjo', 'JI', 'Kab. Sidoarjo', 'Sedati', -7.3798, 112.7871, 'SPKLU', 180, 4, 'DIVERIFIKASI', 'DPD Kab. Sidoarjo', 5],
  ['CPSS-BA-001', 'CPSS Ngurah Rai International', 'BA', 'Kab. Badung', 'Kuta', -8.7467, 115.1668, 'SPKLU', 250, 8, 'DISETUJUI', 'DPD Kab. Badung', 230],
  ['CPSS-BA-002', 'CPSS Renon Denpasar', 'BA', 'Kota Denpasar', 'Denpasar Selatan', -8.6753, 115.2367, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Denpasar', 185],
  ['CPSS-BA-003', 'CPSS Ubud Creative Hub', 'BA', 'Kab. Gianyar', 'Ubud', -8.5069, 115.2625, 'KOMUNITAS', 22, 6, 'DISETUJUI', 'DPD Kab. Gianyar', 122],
  ['CPSS-BA-004', 'CPSS Singaraja Pelabuhan', 'BA', 'Kab. Buleleng', 'Buleleng', -8.1121, 115.0882, 'MOBILE', 30, 2, 'DIAJUKAN', 'DPD Kab. Buleleng', 3],
  ['CPSS-SU-001', 'CPSS Lapangan Merdeka Medan', 'SU', 'Kota Medan', 'Medan Kota', 3.5893, 98.6739, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Medan', 195],
  ['CPSS-SU-002', 'CPSS Bandara Kualanamu', 'SU', 'Kab. Deli Serdang', 'Beringin', 3.6422, 98.8853, 'SPKLU', 200, 6, 'DISETUJUI', 'DPD Kab. Deli Serdang', 168],
  ['CPSS-SU-003', 'CPSS Danau Toba Parapat', 'SU', 'Kota Pematangsiantar', 'Siantar Timur', 2.9595, 99.0687, 'KOMUNITAS', 22, 4, 'DIVERIFIKASI', 'DPD Pematangsiantar', 7],
  ['CPSS-SB-001', 'CPSS Pantai Padang', 'SB', 'Kota Padang', 'Padang Barat', -0.9471, 100.3543, 'SPKLU', 120, 3, 'DISETUJUI', 'DPD Kota Padang', 130],
  ['CPSS-RI-001', 'CPSS Pekanbaru City Center', 'RI', 'Kota Pekanbaru', 'Sukajadi', 0.5333, 101.4478, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Pekanbaru', 142],
  ['CPSS-SS-001', 'CPSS Jembatan Ampera', 'SS', 'Kota Palembang', 'Ilir Barat I', -2.9911, 104.7637, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Palembang', 158],
  ['CPSS-LA-001', 'CPSS Bandar Lampung Terminal', 'LA', 'Kota Bandar Lampung', 'Panjang', -5.4419, 105.2632, 'SPBKLU', 25, 8, 'DISETUJUI', 'DPD Bandar Lampung', 118],
  ['CPSS-KR-001', 'CPSS Batam Center Ferry', 'KR', 'Kota Batam', 'Batam Kota', 1.1301, 104.0529, 'SPKLU', 180, 4, 'DISETUJUI', 'DPD Kota Batam', 136],
  ['CPSS-KB-001', 'CPSS Tugu Khatulistiwa', 'KB', 'Kota Pontianak', 'Pontianak Utara', -0.0026, 109.3239, 'SPKLU', 120, 3, 'DISETUJUI', 'DPD Kota Pontianak', 112],
  ['CPSS-KS-001', 'CPSS Banjarmasin Riverside', 'KS', 'Kota Banjarmasin', 'Banjarmasin Tengah', -3.3186, 114.5921, 'SPKLU', 120, 3, 'DISETUJUI', 'DPD Banjarmasin', 104],
  ['CPSS-KI-001', 'CPSS Balikpapan Superblock', 'KI', 'Kota Balikpapan', 'Balikpapan Selatan', -1.2654, 116.8312, 'SPKLU', 200, 6, 'DISETUJUI', 'DPD Kota Balikpapan', 128],
  ['CPSS-KI-002', 'CPSS IKN Nusantara Gateway', 'KI', 'Kab. Kutai Kartanegara', 'Sepaku', -0.9975, 116.7099, 'SPKLU', 350, 8, 'DIVERIFIKASI', 'DPD Kutai Kartanegara', 3],
  ['CPSS-SN-001', 'CPSS Pantai Losari Makassar', 'SN', 'Kota Makassar', 'Ujung Pandang', -5.1442, 119.4076, 'SPKLU', 150, 4, 'DISETUJUI', 'DPD Kota Makassar', 172],
  ['CPSS-SN-002', 'CPSS Sultan Hasanuddin Airport', 'SN', 'Kab. Gowa', 'Somba Opu', -5.0617, 119.5541, 'SPKLU', 180, 4, 'DISETUJUI', 'DPD Kab. Gowa', 126],
  ['CPSS-SA-001', 'CPSS Boulevard Manado', 'SA', 'Kota Manado', 'Wenang', 1.4748, 124.8421, 'SPKLU', 120, 3, 'DISETUJUI', 'DPD Kota Manado', 98],
  ['CPSS-NB-001', 'CPSS Mandalika Circuit', 'NB', 'Kab. Lombok Barat', 'Pujut', -8.895, 116.3009, 'SPKLU', 200, 6, 'DISETUJUI', 'DPD Lombok Barat', 116],
  ['CPSS-NT-001', 'CPSS Kupang Waterfront', 'NT', 'Kota Kupang', 'Kelapa Lima', -10.1573, 123.6069, 'KOMUNITAS', 22, 4, 'DISETUJUI', 'DPD Kota Kupang', 84],
  ['CPSS-MA-001', 'CPSS Ambon City Center', 'MA', 'Kota Ambon', 'Sirimau', -3.6954, 128.1814, 'SPBKLU', 25, 6, 'DISETUJUI', 'DPD Kota Ambon', 76],
  ['CPSS-MU-001', 'CPSS Ternate Pelabuhan Ahmad Yani', 'MU', 'Kota Ternate', 'Ternate Tengah', 0.7893, 127.3813, 'MOBILE', 30, 2, 'DIAJUKAN', 'DPD Kota Ternate', 2],
  ['CPSS-PA-001', 'CPSS Jayapura Waterfront', 'PA', 'Kota Jayapura', 'Jayapura Utara', -2.5337, 140.7181, 'SPKLU', 120, 3, 'DISETUJUI', 'DPD Kota Jayapura', 70],
  ['CPSS-PD-001', 'CPSS Sorong Gateway', 'PD', 'Kota Sorong', 'Sorong', -0.8762, 131.2558, 'KOMUNITAS', 22, 4, 'DIVERIFIKASI', 'DPD Kota Sorong', 8],
  ['CPSS-GO-001', 'CPSS Gorontalo Sentral', 'GO', 'Kota Gorontalo', 'Kota Tengah', 0.5435, 123.0568, 'SPBKLU', 25, 6, 'DITOLAK', 'DPD Kota Gorontalo', 24],
  ['CPSS-JT-004', 'CPSS Kudus Menara', 'JT', 'Kab. Kudus', 'Kota Kudus', -6.8048, 110.8405, 'MOBILE', 30, 2, 'DITOLAK', 'DPD Kab. Kudus', 31],
];

const iso = (daysAgo: number) => {
  const d = new Date('2026-09-16T08:00:00+07:00');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const PIC_NAMES = ['Budi Santoso', 'Andi Nugraha', 'Sari Melati', 'Joko Prasetyo', 'Rina Marlina', 'Dimas Aryo', 'Fitri Handayani', 'Eko Wibowo'];
const HOURS = ['24 Jam', '06.00 – 22.00 WIB', '07.00 – 21.00 WIB', '24 Jam (dengan petugas jaga)'];

export const SEED_POINTS: CpssPoint[] = ROWS.map((r, i) => {
  const [code, name, provinceCode, city, district, lat, lng, category, capacityKw, connectors, status, submittedByName, daysAgo] = r;
  const submittedAt = iso(daysAgo);
  const history: CpssPoint['history'] = [
    { at: submittedAt, actor: submittedByName, action: 'Pengajuan titik dibuat oleh tim lapangan' },
  ];
  const point: CpssPoint = {
    id: `p-${i + 1}`,
    code,
    name,
    address: `${district}, ${city}`,
    provinceCode,
    city,
    district,
    lat,
    lng,
    category,
    capacityKw,
    connectors,
    operatingHours: HOURS[i % HOURS.length],
    picName: PIC_NAMES[i % PIC_NAMES.length],
    picPhone: `0812-${String(1000 + i).slice(0, 4)}-${String(8800 + i)}`,
    notes:
      category === 'KOMUNITAS'
        ? 'Titik dikelola bersama komunitas warga dan UMKM sekitar.'
        : 'Lokasi strategis dengan akses jalan utama dan daya listrik memadai.',
    status,
    submittedBy: 'u-kota-seed',
    submittedByName,
    submittedAt,
    history,
  };

  if (status === 'DIVERIFIKASI' || status === 'DISETUJUI') {
    point.verifiedAt = iso(Math.max(0, daysAgo - 2));
    point.verifiedByName = 'DPW ' + provinceCode;
    point.verifiedBy = 'u-prov-seed';
    history.push({ at: point.verifiedAt, actor: point.verifiedByName, action: 'Verifikasi wilayah selesai', note: 'Survei lapangan sesuai, koordinat valid.' });
  }
  if (status === 'DISETUJUI') {
    point.approvedAt = iso(Math.max(0, daysAgo - 4));
    point.approvedByName = 'DPP GPN 08';
    point.approvedBy = 'u-pusat-01';
    history.push({ at: point.approvedAt, actor: 'DPP GPN 08', action: 'Disetujui dan ditayangkan di dashboard CPSS' });
  }
  if (status === 'DITOLAK') {
    point.rejectedReason = 'Kapasitas daya lokasi belum memenuhi standar minimum CPSS. Mohon ajukan ulang setelah peningkatan daya.';
    point.verifiedAt = iso(Math.max(0, daysAgo - 2));
    history.push({ at: point.verifiedAt, actor: 'DPW ' + provinceCode, action: 'Ditolak pada tahap verifikasi', note: point.rejectedReason });
  }

  return point;
});
