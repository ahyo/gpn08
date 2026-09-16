/**
 * Klien HTTP untuk backend FastAPI.
 *
 * Aplikasi berjalan dalam dua mode:
 *
 * - **Mode demo** (`NEXT_PUBLIC_DEMO_MODE=true`, dipakai pada GitHub Pages):
 *   seluruh data berasal dari `@/lib/store` yang disimpan di localStorage,
 *   sehingga situs dapat berjalan sepenuhnya statis tanpa server.
 * - **Mode langsung** (`NEXT_PUBLIC_DEMO_MODE=false` dan `NEXT_PUBLIC_API_URL`
 *   diisi): data dibaca dan ditulis melalui modul ini ke FastAPI.
 */

import type {
  CpssPoint,
  Member,
  Notification,
  PointHistory,
  SessionUser,
} from '@/lib/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
export const DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE !== 'false' || API_URL === '';

const TOKEN_KEY = 'gpn08.token.v1';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* localStorage tidak tersedia — token hanya berlaku selama sesi ini */
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new ApiError('NEXT_PUBLIC_API_URL belum dikonfigurasi.', 0);

  const token = getToken();
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body && typeof init.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    let detail = `Permintaan gagal (${res.status}).`;
    try {
      const body = await res.json();
      if (typeof body?.detail === 'string') detail = body.detail;
    } catch {
      /* respons bukan JSON — pakai pesan bawaan */
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/* ------------------------------ Pemetaan ------------------------------- */

interface ApiPoint {
  id: string;
  code: string;
  name: string;
  address: string;
  province_code: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  category: CpssPoint['category'];
  capacity_kw: number;
  connectors: number;
  operating_hours: string;
  pic_name: string;
  pic_phone: string;
  notes: string;
  status: CpssPoint['status'];
  rejected_reason?: string | null;
  submitted_at: string;
  verified_at?: string | null;
  approved_at?: string | null;
  history: { at: string; actor: string; action: string; note?: string | null }[];
}

export function toPoint(p: ApiPoint): CpssPoint {
  const history: PointHistory[] = p.history.map((h) => ({
    at: h.at,
    actor: h.actor,
    action: h.action,
    note: h.note ?? undefined,
  }));
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    address: p.address,
    provinceCode: p.province_code,
    city: p.city,
    district: p.district,
    lat: p.lat,
    lng: p.lng,
    category: p.category,
    capacityKw: p.capacity_kw,
    connectors: p.connectors,
    operatingHours: p.operating_hours,
    picName: p.pic_name,
    picPhone: p.pic_phone,
    notes: p.notes,
    status: p.status,
    rejectedReason: p.rejected_reason ?? undefined,
    submittedBy: '',
    submittedByName: history[0]?.actor ?? '',
    submittedAt: p.submitted_at,
    verifiedAt: p.verified_at ?? undefined,
    approvedAt: p.approved_at ?? undefined,
    history,
  };
}

interface ApiMember {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  province_code: string;
  city: string;
  profession: string;
  education: string;
  interest: string;
  status: Member['status'];
  member_number?: string | null;
  registered_at: string;
}

export function toMember(m: ApiMember): Member {
  return {
    id: m.id,
    fullName: m.full_name,
    nik: '',
    email: m.email,
    phone: m.phone,
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki',
    address: '',
    provinceCode: m.province_code,
    city: m.city,
    profession: m.profession,
    education: m.education,
    interest: m.interest,
    motivation: '',
    status: m.status,
    registeredAt: m.registered_at,
    memberNumber: m.member_number ?? undefined,
  };
}

interface ApiNotification {
  id: string;
  title: string;
  body: string;
  kind: Notification['kind'];
  target_role: Notification['targetRole'];
  target_province?: string | null;
  point_id?: string | null;
  is_read: boolean;
  created_at: string;
}

export function toNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    kind: n.kind,
    targetRole: n.target_role,
    targetProvince: n.target_province ?? undefined,
    pointId: n.point_id ?? undefined,
    createdAt: n.created_at,
    read: n.is_read,
  };
}

/* ------------------------------ Endpoint ------------------------------- */

export const api = {
  async login(email: string, password: string): Promise<SessionUser> {
    const body = new URLSearchParams({ username: email, password });
    const token = await request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    setToken(token.access_token);

    const me = await request<{
      id: string;
      name: string;
      email: string;
      role: SessionUser['role'];
      level: SessionUser['level'];
      position: string;
      phone: string;
      province_code?: string | null;
      city?: string | null;
    }>('/auth/me');

    return {
      id: me.id,
      name: me.name,
      email: me.email,
      role: me.role,
      level: me.level,
      position: me.position,
      phone: me.phone,
      provinceCode: me.province_code ?? undefined,
      city: me.city ?? undefined,
      avatarColor: '#bc0f1f',
      joinedAt: '',
    };
  },

  logout() {
    setToken(null);
  },

  async publicPoints(): Promise<CpssPoint[]> {
    return (await request<ApiPoint[]>('/points/public')).map(toPoint);
  },

  async scopedPoints(): Promise<CpssPoint[]> {
    return (await request<ApiPoint[]>('/points')).map(toPoint);
  },

  async createPoint(payload: Record<string, unknown>): Promise<CpssPoint> {
    return toPoint(
      await request<ApiPoint>('/points', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  },

  async verifyPoint(id: string, note?: string): Promise<CpssPoint> {
    return toPoint(
      await request<ApiPoint>(`/points/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify({ note: note ?? null }),
      }),
    );
  },

  async approvePoint(id: string, note?: string): Promise<CpssPoint> {
    return toPoint(
      await request<ApiPoint>(`/points/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ note: note ?? null }),
      }),
    );
  },

  async rejectPoint(id: string, reason: string): Promise<CpssPoint> {
    return toPoint(
      await request<ApiPoint>(`/points/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    );
  },

  async members(): Promise<Member[]> {
    return (await request<ApiMember[]>('/members')).map(toMember);
  },

  async registerMember(payload: Record<string, unknown>): Promise<Member> {
    return toMember(
      await request<ApiMember>('/members', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  },

  async setMemberStatus(id: string, status: Member['status']): Promise<Member> {
    return toMember(
      await request<ApiMember>(`/members/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    );
  },

  async notifications(): Promise<Notification[]> {
    return (await request<ApiNotification[]>('/notifications')).map(toNotification);
  },

  async markRead(id: string): Promise<void> {
    await request(`/notifications/${id}/read`, { method: 'POST' });
  },

  async markAllRead(): Promise<void> {
    await request('/notifications/read-all', { method: 'POST' });
  },

  async summary(): Promise<Record<string, number>> {
    return request('/stats/summary');
  },
};
