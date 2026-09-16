'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/dashboard/shell';
import { PointDetailModal } from '@/components/dashboard/point-detail';
import { Badge } from '@/components/ui/badge';
import { IconBell, IconCheck, IconInfo, IconShield, IconX } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { useDemoState } from '@/lib/hooks';
import {
  markAllNotificationsRead,
  markNotificationRead,
  notificationsFor,
} from '@/lib/store';
import type { CpssPoint, Notification } from '@/lib/types';
import { formatDate, relativeTime } from '@/lib/utils';

const KIND_META: Record<
  Notification['kind'],
  { tone: 'amber' | 'sky' | 'emerald' | 'rose'; icon: typeof IconBell; label: string }
> = {
  VERIFIKASI: { tone: 'amber', icon: IconShield, label: 'Perlu Verifikasi' },
  PERSETUJUAN: { tone: 'sky', icon: IconCheck, label: 'Perlu Persetujuan' },
  PENOLAKAN: { tone: 'rose', icon: IconX, label: 'Penolakan' },
  INFO: { tone: 'emerald', icon: IconInfo, label: 'Informasi' },
};

export default function NotifikasiPage() {
  const { user } = useAuth();
  const { state } = useDemoState();
  const [selected, setSelected] = useState<CpssPoint | null>(null);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const list = useMemo(() => {
    const items = notificationsFor(user);
    return onlyUnread ? items.filter((n) => !n.read) : items;
  }, [state, user, onlyUnread]);

  if (!user) return null;

  const unread = notificationsFor(user).filter((n) => !n.read).length;

  const open = (n: Notification) => {
    markNotificationRead(n.id);
    if (n.pointId) {
      const point = state.points.find((p) => p.id === n.pointId);
      if (point) setSelected(point);
    }
  };

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IconBell width={20} height={20} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                {unread}
              </span>
            )}
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-navy-950">Notifikasi</h1>
            <p className="mt-0.5 text-[13px] text-navy-500">
              Pemberitahuan alur persetujuan untuk jenjang {user.level}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOnlyUnread((v) => !v)}
            className={`btn btn-sm ${onlyUnread ? 'bg-navy-900 text-white' : 'btn-outline'}`}
          >
            {onlyUnread ? 'Tampilkan semua' : 'Hanya belum dibaca'}
          </button>
          <button
            type="button"
            onClick={() => markAllNotificationsRead(user)}
            disabled={unread === 0}
            className="btn-outline btn-sm"
          >
            <IconCheck width={15} height={15} />
            Tandai semua dibaca
          </button>
        </div>
      </section>

      {list.length === 0 ? (
        <EmptyState
          icon={<IconBell width={26} height={26} />}
          title={onlyUnread ? 'Tidak ada notifikasi belum dibaca' : 'Belum ada notifikasi'}
          description="Notifikasi muncul otomatis saat ada pengajuan baru, hasil verifikasi, atau keputusan persetujuan."
          action={
            <Link href="/dashboard" className="btn-primary btn-sm">
              Kembali ke Ringkasan
            </Link>
          }
        />
      ) : (
        <section className="card overflow-hidden">
          <ul className="divide-y divide-navy-50">
            {list.map((n) => {
              const meta = KIND_META[n.kind];
              const Icon = meta.icon;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => open(n)}
                    className={`flex w-full gap-4 px-6 py-4 text-left transition hover:bg-navy-50/60 ${
                      n.read ? '' : 'bg-brand-50/25'
                    }`}
                  >
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        {
                          amber: 'bg-amber-50 text-amber-600',
                          sky: 'bg-sky-50 text-sky-600',
                          emerald: 'bg-emerald-50 text-emerald-600',
                          rose: 'bg-rose-50 text-rose-600',
                        }[meta.tone]
                      }`}
                    >
                      <Icon width={18} height={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {!n.read && (
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <p className="mt-1.5 text-[14px] font-bold leading-snug text-navy-950">
                        {n.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-navy-600">{n.body}</p>
                      <p className="mt-1.5 text-[11.5px] text-navy-400">
                        {relativeTime(n.createdAt)} · {formatDate(n.createdAt, true)}
                      </p>
                    </div>
                    {n.pointId && (
                      <span className="hidden shrink-0 self-center text-[12.5px] font-bold text-brand-600 sm:block">
                        Buka detail
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <PointDetailModal point={selected} user={user} onClose={() => setSelected(null)} />
    </div>
  );
}
