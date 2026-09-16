'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/dashboard/shell';
import { PointDetailModal } from '@/components/dashboard/point-detail';
import { PointTable } from '@/components/dashboard/point-table';
import { Badge } from '@/components/ui/badge';
import { IconCheck, IconLock, IconSearch, IconShield } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { PROVINCES, provinceName } from '@/lib/data/provinces';
import { useDemoState } from '@/lib/hooks';
import { scopedPoints } from '@/lib/store';
import type { CpssPoint, PointStatus, Role } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

export function ReviewPage({
  title,
  description,
  pendingStatus,
  allowedRoles,
  actionLabel,
  historyStatuses,
}: {
  title: string;
  description: string;
  pendingStatus: PointStatus;
  allowedRoles: Role[];
  actionLabel: string;
  historyStatuses: PointStatus[];
}) {
  const { user } = useAuth();
  const { state } = useDemoState();
  const [selected, setSelected] = useState<CpssPoint | null>(null);
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('');
  const [tab, setTab] = useState<'pending' | 'riwayat'>('pending');

  const all = useMemo(() => scopedPoints(state, user), [state, user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = all.filter((p) =>
      tab === 'pending' ? p.status === pendingStatus : historyStatuses.includes(p.status),
    );
    return source
      .filter((p) => (province ? p.provinceCode === province : true))
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q),
      )
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [all, tab, pendingStatus, historyStatuses, province, query]);

  if (!user) return null;

  if (!allowedRoles.includes(user.role)) {
    return (
      <EmptyState
        icon={<IconLock width={26} height={26} />}
        title="Halaman ini di luar kewenangan Anda"
        description={`Hanya ${allowedRoles.map((r) => (r === 'PUSAT' ? 'DPP Pusat' : r === 'PROVINSI' ? 'DPW Provinsi' : 'DPD')).join(' dan ')} yang dapat mengakses halaman ini.`}
        action={
          <Link href="/dashboard" className="btn-primary btn-sm">
            Kembali ke Ringkasan
          </Link>
        }
      />
    );
  }

  const pendingCount = all.filter((p) => p.status === pendingStatus).length;
  const provincesInScope = PROVINCES.filter((p) =>
    all.some((pt) => pt.provinceCode === p.code),
  );

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <IconShield width={20} height={20} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-navy-950">{title}</h1>
              <p className="mt-0.5 text-[13px] text-navy-500">{description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-navy-50/70 px-5 py-3.5">
          <div>
            <div className="font-display text-3xl font-extrabold tabular-nums text-brand-600">
              {formatNumber(pendingCount)}
            </div>
            <div className="text-[11.5px] font-semibold text-navy-500">menunggu tindakan</div>
          </div>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-navy-100 p-4 sm:flex-row sm:items-center">
          <div className="flex rounded-xl bg-navy-50 p-1">
            {[
              { k: 'pending' as const, l: 'Perlu Tindakan', n: pendingCount },
              {
                k: 'riwayat' as const,
                l: 'Riwayat',
                n: all.filter((p) => historyStatuses.includes(p.status)).length,
              },
            ].map((t) => (
              <button
                key={t.k}
                type="button"
                onClick={() => setTab(t.k)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition ${
                  tab === t.k ? 'bg-white text-navy-950 shadow-sm' : 'text-navy-500 hover:text-navy-800'
                }`}
              >
                {t.l}
                <span
                  className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10.5px] ${
                    tab === t.k ? 'bg-brand-600 text-white' : 'bg-navy-200/70 text-navy-600'
                  }`}
                >
                  {t.n}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <IconSearch
              width={16}
              height={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama titik, kota, atau kode…"
              className="field py-2 pl-10 text-[13px]"
            />
          </div>

          {user.role === 'PUSAT' && (
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="field w-full py-2 text-[13px] sm:w-56"
            >
              <option value="">Semua provinsi</option>
              {provincesInScope.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<IconCheck width={26} height={26} />}
              title={tab === 'pending' ? 'Tidak ada yang perlu ditindaklanjuti' : 'Riwayat masih kosong'}
              description={
                tab === 'pending'
                  ? `Semua pengajuan pada cakupan ${user.role === 'PUSAT' ? 'nasional' : provinceName(user.provinceCode ?? '')} sudah ditangani.`
                  : 'Belum ada pengajuan yang selesai diproses pada cakupan ini.'
              }
            />
          </div>
        ) : (
          <>
            {tab === 'pending' && (
              <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50/70 px-5 py-2.5 text-[12.5px] text-amber-900">
                <Badge tone="amber" dot>
                  {actionLabel}
                </Badge>
                Klik baris untuk membuka detail titik dan memberikan keputusan.
              </div>
            )}
            <PointTable points={filtered} onSelect={setSelected} />
          </>
        )}
      </section>

      <PointDetailModal point={selected} user={user} onClose={() => setSelected(null)} />
    </div>
  );
}
