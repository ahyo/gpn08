'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/dashboard/shell';
import { PointDetailModal } from '@/components/dashboard/point-detail';
import { PointTable } from '@/components/dashboard/point-table';
import { Badge } from '@/components/ui/badge';
import { IconCrosshair, IconSearch } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/data/points';
import { useDemoState } from '@/lib/hooks';
import { scopedPoints } from '@/lib/store';
import type { CpssPoint, PointStatus } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

const FILTERS: (PointStatus | 'SEMUA')[] = [
  'SEMUA',
  'DIAJUKAN',
  'DIVERIFIKASI',
  'DISETUJUI',
  'DITOLAK',
];

export default function PengajuanPage() {
  const { user } = useAuth();
  const { state } = useDemoState();
  const [selected, setSelected] = useState<CpssPoint | null>(null);
  const [status, setStatus] = useState<PointStatus | 'SEMUA'>('SEMUA');
  const [query, setQuery] = useState('');

  const all = useMemo(() => scopedPoints(state, user), [state, user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((p) => (status === 'SEMUA' ? true : p.status === status))
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q),
      )
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [all, status, query]);

  if (!user) return null;

  const countOf = (s: PointStatus | 'SEMUA') =>
    s === 'SEMUA' ? all.length : all.filter((p) => p.status === s).length;

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IconCrosshair width={20} height={20} />
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-navy-950">Pengajuan Titik CPSS</h1>
            <p className="mt-0.5 text-[13px] text-navy-500">
              Seluruh pengajuan titik pada cakupan wewenang {user.level}.
            </p>
          </div>
        </div>
        <Link href="/dashboard/pengajuan/baru" className="btn-primary shrink-0">
          <IconCrosshair width={16} height={16} />
          Ajukan Titik Baru
        </Link>
      </section>

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-navy-100 p-4 lg:flex-row lg:items-center">
          <div className="scroll-slim flex gap-1.5 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatus(f)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-bold transition ${
                  status === f
                    ? 'bg-navy-900 text-white'
                    : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                }`}
              >
                {f === 'SEMUA' ? 'Semua' : STATUS_LABEL[f]}
                <span
                  className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10.5px] ${
                    status === f ? 'bg-white/20 text-white' : 'bg-white text-navy-500'
                  }`}
                >
                  {formatNumber(countOf(f))}
                </span>
              </button>
            ))}
          </div>
          <div className="relative lg:ml-auto lg:w-72">
            <IconSearch
              width={16}
              height={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari titik…"
              className="field py-2 pl-10 text-[13px]"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<IconCrosshair width={26} height={26} />}
              title="Belum ada pengajuan"
              description="Tidak ada data pengajuan titik yang cocok dengan filter saat ini."
              action={
                <Link href="/dashboard/pengajuan/baru" className="btn-primary btn-sm">
                  Ajukan Titik Baru
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {status !== 'SEMUA' && (
              <div className="flex items-center gap-2 border-b border-navy-100 bg-navy-50/60 px-5 py-2.5 text-[12.5px] text-navy-600">
                <Badge tone={STATUS_TONE[status]} dot>
                  {STATUS_LABEL[status]}
                </Badge>
                Menampilkan {formatNumber(filtered.length)} pengajuan.
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
