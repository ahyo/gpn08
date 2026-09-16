export type Role = 'PUSAT' | 'PROVINSI' | 'KOTA' | 'ANGGOTA';

export type PointStatus =
  | 'DRAFT'
  | 'DIAJUKAN'
  | 'DIVERIFIKASI'
  | 'DISETUJUI'
  | 'DITOLAK';

export type PointCategory =
  | 'SPKLU'
  | 'SPBKLU'
  | 'MOBILE'
  | 'KOMUNITAS';

export type MemberStatus = 'MENUNGGU' | 'AKTIF' | 'DITOLAK';

export interface Province {
  code: string;
  name: string;
  island: string;
  lat: number;
  lng: number;
  capital: string;
  cities: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  level: 'Pusat' | 'Provinsi' | 'Kota/Kabupaten' | 'Anggota';
  provinceCode?: string;
  city?: string;
  position: string;
  avatarColor: string;
  phone: string;
  joinedAt: string;
}

export interface SessionUser extends Omit<User, 'password'> {}

export interface CpssPoint {
  id: string;
  code: string;
  name: string;
  address: string;
  provinceCode: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  category: PointCategory;
  capacityKw: number;
  connectors: number;
  operatingHours: string;
  picName: string;
  picPhone: string;
  notes: string;
  status: PointStatus;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectedReason?: string;
  history: PointHistory[];
}

export interface PointHistory {
  at: string;
  actor: string;
  action: string;
  note?: string;
}

export interface Member {
  id: string;
  fullName: string;
  nik: string;
  email: string;
  phone: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  provinceCode: string;
  city: string;
  profession: string;
  education: string;
  interest: string;
  motivation: string;
  status: MemberStatus;
  registeredAt: string;
  memberNumber?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  targetRole: Role;
  targetProvince?: string;
  pointId?: string;
  createdAt: string;
  read: boolean;
  kind: 'INFO' | 'VERIFIKASI' | 'PERSETUJUAN' | 'PENOLAKAN';
}

export interface OrgMember {
  name: string;
  position: string;
  initials: string;
  province?: string;
  since?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  date: string;
  author: string;
  readMinutes: number;
}
