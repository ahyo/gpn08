'use client';

import { DEMO_MODE, api } from '@/lib/api';
import { SEED_POINTS } from '@/lib/data/points';
import { SEED_MEMBERS } from '@/lib/data/members';
import { DEMO_USERS } from '@/lib/data/users';
import { provinceName } from '@/lib/data/provinces';
import type {
  CpssPoint,
  Member,
  Notification,
  SessionUser,
} from '@/lib/types';

const STORAGE_KEY = 'gpn08.demo.v1';
const SESSION_KEY = 'gpn08.session.v1';

export interface DemoState {
  points: CpssPoint[];
  members: Member[];
  notifications: Notification[];
  seq: number;
}

const seedNotifications = (): Notification[] => {
  const pending = SEED_POINTS.filter((p) => p.status === 'DIAJUKAN');
  const verified = SEED_POINTS.filter((p) => p.status === 'DIVERIFIKASI');
  const list: Notification[] = [];

  pending.forEach((p, i) => {
    list.push({
      id: `nt-p-${i}`,
      title: 'Pengajuan titik baru menunggu verifikasi',
      body: `${p.name} (${p.city}) diajukan oleh ${p.submittedByName}.`,
      targetRole: 'PROVINSI',
      targetProvince: p.provinceCode,
      pointId: p.id,
      createdAt: p.submittedAt,
      read: false,
      kind: 'VERIFIKASI',
    });
  });

  verified.forEach((p, i) => {
    list.push({
      id: `nt-v-${i}`,
      title: 'Titik telah diverifikasi DPW, menunggu persetujuan DPP',
      body: `${p.name} (${provinceName(p.provinceCode)}) siap disetujui.`,
      targetRole: 'PUSAT',
      pointId: p.id,
      createdAt: p.verifiedAt ?? p.submittedAt,
      read: false,
      kind: 'PERSETUJUAN',
    });
  });

  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const initialState = (): DemoState => ({
  points: JSON.parse(JSON.stringify(SEED_POINTS)),
  members: JSON.parse(JSON.stringify(SEED_MEMBERS)),
  notifications: seedNotifications(),
  seq: SEED_POINTS.length + 1,
});

let state: DemoState | null = null;
const listeners = new Set<() => void>();

function readStorage(): DemoState {
  if (typeof window === 'undefined') return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed && Array.isArray(parsed.points)) return parsed;
    }
  } catch {
    /* storage tidak tersedia (private mode) — gunakan seed */
  }
  return initialState();
}

function persist() {
  if (typeof window === 'undefined' || !state) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* abaikan: demo tetap berjalan di memori */
  }
}

export function getState(): DemoState {
  if (!state) state = readStorage();
  return state;
}

function commit(next: DemoState) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetDemo() {
  commit(initialState());
}

/**
 * Pada mode langsung, tarik data terbaru dari FastAPI ke dalam state.
 * Pada mode demo fungsi ini tidak melakukan apa pun.
 */
export async function hydrateFromApi(authenticated: boolean): Promise<void> {
  if (DEMO_MODE) return;
  try {
    const [points, notifications, members] = await Promise.all([
      authenticated ? api.scopedPoints() : api.publicPoints(),
      authenticated ? api.notifications().catch(() => []) : Promise.resolve([]),
      authenticated ? api.members().catch(() => []) : Promise.resolve([]),
    ]);
    const s = getState();
    commit({
      ...s,
      points,
      notifications,
      members: members.length ? members : s.members,
    });
  } catch {
    // Backend tidak dapat dihubungi — pertahankan data yang sudah ada agar
    // antarmuka tetap dapat digunakan.
  }
}

/** Menjalankan aksi ke backend lalu menyegarkan state. Aman di mode demo. */
function syncWithApi(action: () => Promise<unknown>) {
  if (DEMO_MODE) return;
  void action()
    .then(() => hydrateFromApi(true))
    .catch(() => hydrateFromApi(true));
}

const now = () => new Date().toISOString();

function pushNotification(
  s: DemoState,
  n: Omit<Notification, 'id' | 'createdAt' | 'read'>,
) {
  s.notifications.unshift({
    ...n,
    id: `nt-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now(),
    read: false,
  });
}

/* ------------------------------ Titik CPSS ------------------------------ */

export interface NewPointInput {
  name: string;
  provinceCode: string;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  category: CpssPoint['category'];
  capacityKw: number;
  connectors: number;
  operatingHours: string;
  picName: string;
  picPhone: string;
  notes: string;
}

export function createPoint(input: NewPointInput, actor: SessionUser): CpssPoint {
  const s = { ...getState() };
  const seq = s.seq + 1;
  const point: CpssPoint = {
    id: `p-${seq}`,
    code: `CPSS-${input.provinceCode}-${String(seq).padStart(3, '0')}`,
    name: input.name,
    address: input.address,
    provinceCode: input.provinceCode,
    city: input.city,
    district: input.district,
    lat: input.lat,
    lng: input.lng,
    category: input.category,
    capacityKw: input.capacityKw,
    connectors: input.connectors,
    operatingHours: input.operatingHours,
    picName: input.picName,
    picPhone: input.picPhone,
    notes: input.notes,
    status: 'DIAJUKAN',
    submittedBy: actor.id,
    submittedByName: actor.name,
    submittedAt: now(),
    history: [
      { at: now(), actor: actor.name, action: 'Pengajuan titik dibuat oleh tim lapangan' },
    ],
  };

  const next: DemoState = { ...s, seq, points: [point, ...s.points] };
  pushNotification(next, {
    title: 'Pengajuan titik baru menunggu verifikasi',
    body: `${point.name} (${point.city}) diajukan oleh ${actor.name}.`,
    targetRole: 'PROVINSI',
    targetProvince: point.provinceCode,
    pointId: point.id,
    kind: 'VERIFIKASI',
  });
  commit(next);
  syncWithApi(() =>
    api.createPoint({
      name: input.name,
      province_code: input.provinceCode,
      city: input.city,
      district: input.district,
      address: input.address,
      lat: input.lat,
      lng: input.lng,
      category: input.category,
      capacity_kw: input.capacityKw,
      connectors: input.connectors,
      operating_hours: input.operatingHours,
      pic_name: input.picName,
      pic_phone: input.picPhone,
      notes: input.notes,
    }),
  );
  return point;
}

export function verifyPoint(pointId: string, actor: SessionUser, note?: string) {
  const s = getState();
  const points = s.points.map((p) =>
    p.id === pointId
      ? {
          ...p,
          status: 'DIVERIFIKASI' as const,
          verifiedAt: now(),
          verifiedBy: actor.id,
          verifiedByName: actor.name,
          history: [
            ...p.history,
            {
              at: now(),
              actor: actor.name,
              action: 'Verifikasi wilayah selesai',
              note: note || 'Data lapangan sesuai, diteruskan ke DPP.',
            },
          ],
        }
      : p,
  );
  const target = points.find((p) => p.id === pointId);
  const next: DemoState = { ...s, points };
  if (target) {
    pushNotification(next, {
      title: 'Titik telah diverifikasi DPW, menunggu persetujuan DPP',
      body: `${target.name} (${provinceName(target.provinceCode)}) diverifikasi oleh ${actor.name}.`,
      targetRole: 'PUSAT',
      pointId: target.id,
      kind: 'PERSETUJUAN',
    });
  }
  commit(next);
  syncWithApi(() => api.verifyPoint(pointId, note));
}

export function approvePoint(pointId: string, actor: SessionUser, note?: string) {
  const s = getState();
  const points = s.points.map((p) =>
    p.id === pointId
      ? {
          ...p,
          status: 'DISETUJUI' as const,
          approvedAt: now(),
          approvedBy: actor.id,
          approvedByName: actor.name,
          history: [
            ...p.history,
            {
              at: now(),
              actor: actor.name,
              action: 'Disetujui dan ditayangkan di dashboard CPSS',
              note,
            },
          ],
        }
      : p,
  );
  const target = points.find((p) => p.id === pointId);
  const next: DemoState = { ...s, points };
  if (target) {
    pushNotification(next, {
      title: 'Titik CPSS disetujui DPP',
      body: `${target.name} kini tayang di dashboard CPSS nasional.`,
      targetRole: 'PROVINSI',
      targetProvince: target.provinceCode,
      pointId: target.id,
      kind: 'INFO',
    });
    pushNotification(next, {
      title: 'Pengajuan Anda disetujui',
      body: `${target.name} telah disetujui DPP dan tayang di peta nasional.`,
      targetRole: 'KOTA',
      targetProvince: target.provinceCode,
      pointId: target.id,
      kind: 'INFO',
    });
  }
  commit(next);
  syncWithApi(() => api.approvePoint(pointId, note));
}

export function rejectPoint(pointId: string, actor: SessionUser, reason: string) {
  const s = getState();
  const points = s.points.map((p) =>
    p.id === pointId
      ? {
          ...p,
          status: 'DITOLAK' as const,
          rejectedReason: reason,
          history: [
            ...p.history,
            { at: now(), actor: actor.name, action: 'Pengajuan ditolak', note: reason },
          ],
        }
      : p,
  );
  const target = points.find((p) => p.id === pointId);
  const next: DemoState = { ...s, points };
  if (target) {
    pushNotification(next, {
      title: 'Pengajuan titik ditolak',
      body: `${target.name} ditolak oleh ${actor.name}. Alasan: ${reason}`,
      targetRole: 'KOTA',
      targetProvince: target.provinceCode,
      pointId: target.id,
      kind: 'PENOLAKAN',
    });
  }
  commit(next);
  syncWithApi(() => api.rejectPoint(pointId, reason));
}

/* ------------------------------- Anggota -------------------------------- */

export type MemberInput = Omit<
  Member,
  'id' | 'status' | 'registeredAt' | 'memberNumber'
>;

export function registerMember(input: MemberInput): Member {
  const s = getState();
  const member: Member = {
    ...input,
    id: `m-${Math.random().toString(36).slice(2, 9)}`,
    status: 'MENUNGGU',
    registeredAt: now(),
  };
  const next: DemoState = { ...s, members: [member, ...s.members] };
  pushNotification(next, {
    title: 'Pendaftaran anggota baru',
    body: `${member.fullName} dari ${member.city} mendaftar sebagai anggota.`,
    targetRole: 'PROVINSI',
    targetProvince: member.provinceCode,
    kind: 'INFO',
  });
  commit(next);
  syncWithApi(() =>
    api.registerMember({
      full_name: member.fullName,
      nik: member.nik,
      email: member.email,
      phone: member.phone.replace(/[-\s]/g, ''),
      birth_place: member.birthPlace,
      birth_date: member.birthDate,
      gender: member.gender,
      address: member.address,
      province_code: member.provinceCode,
      city: member.city,
      profession: member.profession,
      education: member.education,
      interest: member.interest,
      motivation: member.motivation,
    }),
  );
  return member;
}

export function setMemberStatus(id: string, status: Member['status']) {
  const s = getState();
  const members = s.members.map((m) =>
    m.id === id
      ? {
          ...m,
          status,
          memberNumber:
            status === 'AKTIF'
              ? m.memberNumber ??
                `GPN08-${m.provinceCode}-${String(Math.floor(Math.random() * 9000) + 1000)}`
              : m.memberNumber,
        }
      : m,
  );
  commit({ ...s, members });
  syncWithApi(() => api.setMemberStatus(id, status));
}

/* ----------------------------- Notifikasi ------------------------------- */

export function notificationsFor(user: SessionUser | null): Notification[] {
  if (!user) return [];
  return getState().notifications.filter((n) => {
    if (n.targetRole !== user.role) return false;
    if (n.targetProvince && user.provinceCode && n.targetProvince !== user.provinceCode)
      return false;
    return true;
  });
}

export function markNotificationRead(id: string) {
  const s = getState();
  commit({
    ...s,
    notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  });
  syncWithApi(() => api.markRead(id));
}

export function markAllNotificationsRead(user: SessionUser | null) {
  if (!user) return;
  const ids = new Set(notificationsFor(user).map((n) => n.id));
  const s = getState();
  commit({
    ...s,
    notifications: s.notifications.map((n) => (ids.has(n.id) ? { ...n, read: true } : n)),
  });
  syncWithApi(() => api.markAllRead());
}

/* -------------------------------- Sesi ---------------------------------- */

export function loadSession(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(user: SessionUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* abaikan */
  }
}

export async function authenticate(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  if (!DEMO_MODE) {
    try {
      return await api.login(email.trim(), password);
    } catch {
      return null;
    }
  }
  const found = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  if (!found) return null;
  const { password: _pw, ...session } = found;
  return session;
}

/* ------------------------------ Selector -------------------------------- */

export const approvedPoints = (s: DemoState) =>
  s.points.filter((p) => p.status === 'DISETUJUI');

export function scopedPoints(s: DemoState, user: SessionUser | null) {
  if (!user) return [];
  if (user.role === 'PUSAT') return s.points;
  if (user.role === 'PROVINSI')
    return s.points.filter((p) => p.provinceCode === user.provinceCode);
  return s.points.filter(
    (p) => p.provinceCode === user.provinceCode && (!user.city || p.city === user.city),
  );
}
