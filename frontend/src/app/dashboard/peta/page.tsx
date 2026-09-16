'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { PointDetailModal } from '@/components/dashboard/point-detail';
import { PointCard } from '@/components/cpss/point-card';
import { Badge } from '@/components/ui/badge';
import { IconMapPin, IconSearch } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/data/points';
import { useDemoState } from '@/lib/hooks';
import { scopedPoints } from '@/lib/store';
import type { CpssPoint, PointStatus } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

const LeafletMap = dynamic(() => import('@/components/map/leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-navy-50">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-brand-500" />
    </div>
  ),
});

const STATUSES: PointStatus[] = ['DIAJUKAN', 'DIVERIFIKASI', 'DISETUJUI', 'DITOLAK'];

export default function PetaInternalPage() {
  const { user } = useAuth();
  const { state } = useDemoState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CpssPoint | null>(null);
  const [statuses, setStatuses] = useState<PointStatus[]>(['DIAJUKAN', 'DIVERIFIKASI', 'DISETUJUI']);
  const [query, setQuery] = useState('');

  const all = useMemo(() => scopedPoints(state, user), [state, user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all
      .filter((p) => statuses.includes(p.status))
      .filter(
        (p) =>
          !q || p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q),
      );
  }, [all, statuses, query]);

  if (!user) return null;

  const toggle = (s: PointStatus) =>
    setStatuses((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <div className="space-y-6">
      <section className="card flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IconMapPin width={20} height={20} />
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-navy-950">Peta Internal</h1>
            <p className="mt-0.5 text-[13px] text-navy-500">
              Seluruh titik pada cakupan Anda, termasuk yang belum disetujui — berbeda dengan peta
              publik yang hanya menampilkan titik disetujui.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-navy-50/70 px-5 py-3 text-center">
          <div className="font-display text-2xl font-extrabold tabular-nums text-navy-950">
            {formatNumber(filtered.length)}
          </div>
          <div className="text-[11.5px] font-semibold text-navy-500">titik ditampilkan</div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <aside className="card flex max-h-[720px] flex-col overflow-hidden">
          <div className="space-y-3 border-b border-navy-100 p-4">
            <div className="relative">
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
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(s)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11.5px] font-semibold transition ${
                    statuses.includes(s)
                      ? 'border-navy-900 bg-navy-900 text-white'
                      : 'border-navy-100 bg-white text-navy-500 hover:border-navy-200'
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="scroll-slim flex-1 space-y-2 overflow-y-auto p-3">
            {filtered.length === 0 ? (
              <p className="px-3 py-12 text-center text-[13px] text-navy-400">
                Tidak ada titik yang cocok dengan filter.
              </p>
            ) : (
              filtered.map((p) => (
                <div key={p.id}>
                  <PointCard
                    point={p}
                    active={selectedId === p.id}
                    onSelect={(id) => setSelectedId(id)}
                    showStatus
                  />
                  {selectedId === p.id && (
                    <button
                      type="button"
                      onClick={() => setDetail(p)}
                      className="mt-1.5 w-full rounded-lg bg-navy-900 py-2 text-[12px] font-bold text-white transition hover:bg-navy-950"
                    >
                      Buka detail & tindakan
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        <div className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
          <div className="absolute left-4 top-4 z-[500] flex flex-wrap gap-1.5">
            {statuses.map((s) => (
              <Badge key={s} tone={STATUS_TONE[s]} className="bg-white/95 shadow-sm backdrop-blur">
                {STATUS_LABEL[s]}
              </Badge>
            ))}
          </div>
          <div className="h-[520px] w-full xl:h-[720px]">
            <LeafletMap
              points={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
              basemap="terang"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      <PointDetailModal point={detail} user={user} onClose={() => setDetail(null)} />
    </div>
  );
}
