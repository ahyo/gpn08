import type { Province } from '@/lib/types';

/** 38 provinsi Republik Indonesia beserta titik pusat peta. */
export const PROVINCES: Province[] = [
  { code: 'AC', name: 'Aceh', island: 'Sumatera', lat: 4.695, lng: 96.749, capital: 'Banda Aceh', cities: ['Kota Banda Aceh', 'Kota Lhokseumawe', 'Kab. Aceh Besar', 'Kab. Pidie'] },
  { code: 'SU', name: 'Sumatera Utara', island: 'Sumatera', lat: 2.115, lng: 99.545, capital: 'Medan', cities: ['Kota Medan', 'Kota Binjai', 'Kota Pematangsiantar', 'Kab. Deli Serdang'] },
  { code: 'SB', name: 'Sumatera Barat', island: 'Sumatera', lat: -0.739, lng: 100.8, capital: 'Padang', cities: ['Kota Padang', 'Kota Bukittinggi', 'Kota Payakumbuh', 'Kab. Agam'] },
  { code: 'RI', name: 'Riau', island: 'Sumatera', lat: 0.293, lng: 101.707, capital: 'Pekanbaru', cities: ['Kota Pekanbaru', 'Kota Dumai', 'Kab. Kampar', 'Kab. Siak'] },
  { code: 'JA', name: 'Jambi', island: 'Sumatera', lat: -1.485, lng: 102.438, capital: 'Jambi', cities: ['Kota Jambi', 'Kota Sungai Penuh', 'Kab. Muaro Jambi'] },
  { code: 'SS', name: 'Sumatera Selatan', island: 'Sumatera', lat: -3.319, lng: 103.914, capital: 'Palembang', cities: ['Kota Palembang', 'Kota Prabumulih', 'Kota Lubuklinggau', 'Kab. Banyuasin'] },
  { code: 'BE', name: 'Bengkulu', island: 'Sumatera', lat: -3.792, lng: 102.261, capital: 'Bengkulu', cities: ['Kota Bengkulu', 'Kab. Rejang Lebong', 'Kab. Seluma'] },
  { code: 'LA', name: 'Lampung', island: 'Sumatera', lat: -4.559, lng: 105.407, capital: 'Bandar Lampung', cities: ['Kota Bandar Lampung', 'Kota Metro', 'Kab. Lampung Selatan'] },
  { code: 'BB', name: 'Kepulauan Bangka Belitung', island: 'Sumatera', lat: -2.741, lng: 106.44, capital: 'Pangkalpinang', cities: ['Kota Pangkalpinang', 'Kab. Belitung', 'Kab. Bangka'] },
  { code: 'KR', name: 'Kepulauan Riau', island: 'Sumatera', lat: 0.918, lng: 104.457, capital: 'Tanjungpinang', cities: ['Kota Batam', 'Kota Tanjungpinang', 'Kab. Bintan'] },
  { code: 'JK', name: 'DKI Jakarta', island: 'Jawa', lat: -6.208, lng: 106.846, capital: 'Jakarta', cities: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'] },
  { code: 'JB', name: 'Jawa Barat', island: 'Jawa', lat: -6.889, lng: 107.64, capital: 'Bandung', cities: ['Kota Bandung', 'Kota Bekasi', 'Kota Depok', 'Kota Bogor', 'Kota Cimahi', 'Kab. Bandung Barat'] },
  { code: 'JT', name: 'Jawa Tengah', island: 'Jawa', lat: -7.15, lng: 110.14, capital: 'Semarang', cities: ['Kota Semarang', 'Kota Surakarta', 'Kota Magelang', 'Kab. Kudus'] },
  { code: 'YO', name: 'DI Yogyakarta', island: 'Jawa', lat: -7.797, lng: 110.371, capital: 'Yogyakarta', cities: ['Kota Yogyakarta', 'Kab. Sleman', 'Kab. Bantul'] },
  { code: 'JI', name: 'Jawa Timur', island: 'Jawa', lat: -7.536, lng: 112.238, capital: 'Surabaya', cities: ['Kota Surabaya', 'Kota Malang', 'Kota Kediri', 'Kab. Sidoarjo', 'Kab. Gresik'] },
  { code: 'BT', name: 'Banten', island: 'Jawa', lat: -6.405, lng: 106.064, capital: 'Serang', cities: ['Kota Serang', 'Kota Tangerang', 'Kota Tangerang Selatan', 'Kota Cilegon'] },
  { code: 'BA', name: 'Bali', island: 'Bali & Nusa Tenggara', lat: -8.409, lng: 115.189, capital: 'Denpasar', cities: ['Kota Denpasar', 'Kab. Badung', 'Kab. Gianyar', 'Kab. Buleleng'] },
  { code: 'NB', name: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', lat: -8.652, lng: 117.361, capital: 'Mataram', cities: ['Kota Mataram', 'Kota Bima', 'Kab. Lombok Barat'] },
  { code: 'NT', name: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', lat: -8.657, lng: 121.079, capital: 'Kupang', cities: ['Kota Kupang', 'Kab. Sikka', 'Kab. Manggarai'] },
  { code: 'KB', name: 'Kalimantan Barat', island: 'Kalimantan', lat: -0.278, lng: 111.475, capital: 'Pontianak', cities: ['Kota Pontianak', 'Kota Singkawang', 'Kab. Kubu Raya'] },
  { code: 'KT', name: 'Kalimantan Tengah', island: 'Kalimantan', lat: -1.681, lng: 113.382, capital: 'Palangka Raya', cities: ['Kota Palangka Raya', 'Kab. Kotawaringin Timur'] },
  { code: 'KS', name: 'Kalimantan Selatan', island: 'Kalimantan', lat: -3.093, lng: 115.283, capital: 'Banjarbaru', cities: ['Kota Banjarmasin', 'Kota Banjarbaru', 'Kab. Banjar'] },
  { code: 'KI', name: 'Kalimantan Timur', island: 'Kalimantan', lat: 0.538, lng: 116.419, capital: 'Samarinda', cities: ['Kota Samarinda', 'Kota Balikpapan', 'Kota Bontang', 'Kab. Kutai Kartanegara'] },
  { code: 'KU', name: 'Kalimantan Utara', island: 'Kalimantan', lat: 3.073, lng: 116.041, capital: 'Tanjung Selor', cities: ['Kota Tarakan', 'Kab. Bulungan', 'Kab. Nunukan'] },
  { code: 'SA', name: 'Sulawesi Utara', island: 'Sulawesi', lat: 0.625, lng: 123.975, capital: 'Manado', cities: ['Kota Manado', 'Kota Bitung', 'Kota Tomohon'] },
  { code: 'ST', name: 'Sulawesi Tengah', island: 'Sulawesi', lat: -1.43, lng: 121.446, capital: 'Palu', cities: ['Kota Palu', 'Kab. Donggala', 'Kab. Poso'] },
  { code: 'SN', name: 'Sulawesi Selatan', island: 'Sulawesi', lat: -3.669, lng: 119.974, capital: 'Makassar', cities: ['Kota Makassar', 'Kota Parepare', 'Kota Palopo', 'Kab. Gowa'] },
  { code: 'SG', name: 'Sulawesi Tenggara', island: 'Sulawesi', lat: -4.145, lng: 122.175, capital: 'Kendari', cities: ['Kota Kendari', 'Kota Baubau', 'Kab. Konawe'] },
  { code: 'GO', name: 'Gorontalo', island: 'Sulawesi', lat: 0.699, lng: 122.446, capital: 'Gorontalo', cities: ['Kota Gorontalo', 'Kab. Bone Bolango'] },
  { code: 'SR', name: 'Sulawesi Barat', island: 'Sulawesi', lat: -2.844, lng: 119.232, capital: 'Mamuju', cities: ['Kab. Mamuju', 'Kab. Polewali Mandar'] },
  { code: 'MA', name: 'Maluku', island: 'Maluku & Papua', lat: -3.238, lng: 130.145, capital: 'Ambon', cities: ['Kota Ambon', 'Kota Tual', 'Kab. Maluku Tengah'] },
  { code: 'MU', name: 'Maluku Utara', island: 'Maluku & Papua', lat: 1.571, lng: 127.808, capital: 'Sofifi', cities: ['Kota Ternate', 'Kota Tidore Kepulauan'] },
  { code: 'PA', name: 'Papua', island: 'Maluku & Papua', lat: -2.533, lng: 140.718, capital: 'Jayapura', cities: ['Kota Jayapura', 'Kab. Keerom'] },
  { code: 'PB', name: 'Papua Barat', island: 'Maluku & Papua', lat: -0.863, lng: 132.298, capital: 'Manokwari', cities: ['Kab. Manokwari', 'Kab. Sorong'] },
  { code: 'PS', name: 'Papua Selatan', island: 'Maluku & Papua', lat: -7.5, lng: 139.6, capital: 'Merauke', cities: ['Kab. Merauke', 'Kab. Asmat'] },
  { code: 'PT', name: 'Papua Tengah', island: 'Maluku & Papua', lat: -3.98, lng: 136.1, capital: 'Nabire', cities: ['Kab. Nabire', 'Kab. Mimika'] },
  { code: 'PP', name: 'Papua Pegunungan', island: 'Maluku & Papua', lat: -4.09, lng: 138.95, capital: 'Wamena', cities: ['Kab. Jayawijaya', 'Kab. Yahukimo'] },
  { code: 'PD', name: 'Papua Barat Daya', island: 'Maluku & Papua', lat: -1.0, lng: 131.3, capital: 'Sorong', cities: ['Kota Sorong', 'Kab. Raja Ampat'] },
];

export const provinceByCode = (code: string) =>
  PROVINCES.find((p) => p.code === code);

export const provinceName = (code: string) =>
  provinceByCode(code)?.name ?? code;

export const ISLANDS = [
  'Sumatera',
  'Jawa',
  'Bali & Nusa Tenggara',
  'Kalimantan',
  'Sulawesi',
  'Maluku & Papua',
] as const;
