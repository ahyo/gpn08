import type { Member } from '@/lib/types';

const rows: [string, string, string, string, string, Member['status'], number][] = [
  ['Rizky Pratama', 'JB', 'Kota Bandung', 'Wiraswasta', 'S1', 'AKTIF', 320],
  ['Anisa Rahmadani', 'JK', 'Jakarta Selatan', 'Karyawan Swasta', 'S1', 'AKTIF', 298],
  ['Bagus Prakoso', 'JI', 'Kota Surabaya', 'Teknisi', 'SMA/SMK', 'AKTIF', 264],
  ['Citra Maharani', 'BA', 'Kota Denpasar', 'Pelaku UMKM', 'D3', 'AKTIF', 221],
  ['Dedi Kurniawan', 'SU', 'Kota Medan', 'Mahasiswa', 'SMA/SMK', 'AKTIF', 190],
  ['Eka Suryani', 'JT', 'Kota Semarang', 'Guru', 'S1', 'AKTIF', 176],
  ['Fajar Nugroho', 'YO', 'Kota Yogyakarta', 'Mahasiswa', 'SMA/SMK', 'MENUNGGU', 12],
  ['Gita Permatasari', 'JB', 'Kota Bekasi', 'Karyawan Swasta', 'S1', 'MENUNGGU', 8],
  ['Hasan Basri', 'SN', 'Kota Makassar', 'Wiraswasta', 'D3', 'MENUNGGU', 5],
  ['Indah Lestari', 'BT', 'Kota Tangerang', 'Ibu Rumah Tangga', 'SMA/SMK', 'MENUNGGU', 3],
  ['Joko Susilo', 'KI', 'Kota Balikpapan', 'Teknisi', 'D3', 'AKTIF', 143],
  ['Kartika Sari', 'LA', 'Kota Bandar Lampung', 'Perawat', 'D3', 'AKTIF', 131],
  ['Lukman Hakim', 'AC', 'Kota Banda Aceh', 'Wiraswasta', 'S1', 'AKTIF', 118],
  ['Maya Anggraeni', 'KR', 'Kota Batam', 'Karyawan Swasta', 'S1', 'MENUNGGU', 2],
  ['Nanda Firmansyah', 'PA', 'Kota Jayapura', 'ASN', 'S1', 'AKTIF', 97],
];

const iso = (daysAgo: number) => {
  const d = new Date('2026-09-16T08:00:00+07:00');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const SEED_MEMBERS: Member[] = rows.map((r, i) => {
  const [fullName, provinceCode, city, profession, education, status, daysAgo] = r;
  return {
    id: `m-${i + 1}`,
    fullName,
    nik: `32${String(73010101000000 + i * 7919)}`.slice(0, 16),
    email: fullName.toLowerCase().replace(/[^a-z]+/g, '.') + '@email.com',
    phone: `0812-${3000 + i}-${7000 + i}`,
    birthPlace: city.replace(/^(Kota|Kab\.) /, ''),
    birthDate: `19${85 + (i % 15)}-0${(i % 9) + 1}-1${i % 9}`,
    gender: i % 3 === 0 ? 'Perempuan' : 'Laki-laki',
    address: `Jl. Merdeka No. ${10 + i}, ${city}`,
    provinceCode,
    city,
    profession,
    education,
    interest: ['Tim Lapangan CPSS', 'Kaderisasi', 'Humas & Media', 'UMKM', 'Teknologi Informasi'][i % 5],
    motivation: 'Ingin berkontribusi pada penguatan persatuan nasional dan kemandirian energi daerah.',
    status,
    registeredAt: iso(daysAgo),
    memberNumber: status === 'AKTIF' ? `GPN08-${provinceCode}-${String(1000 + i)}` : undefined,
  };
});
