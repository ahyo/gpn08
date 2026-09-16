'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useDemoState, useMounted } from '@/lib/hooks';
import { approvedPoints } from '@/lib/store';
import { formatNumber } from '@/lib/utils';

const LeafletMap = dynamic(() => import('@/components/map/leaflet-map'), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder() {
  return <div className="h-full w-full animate-pulse bg-navy-100" />;
}

export function HeroMapPreview() {
  const { state, ready } = useDemoState();
  // Peta baru dirender setelah mount agar markup server dan klien identik.
  const mounted = useMounted();
  const points = useMemo(() => approvedPoints(state), [state]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </span>
          <span className="ml-1 text-[11.5px] font-bold text-white/80">
            gpn08.id / dashboard-cpss
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="h-[300px] w-full sm:h-[360px]">
        {mounted ? (
          <LeafletMap points={points} basemap="minimal" interactive={false} className="h-full w-full" />
        ) : (
          <MapPlaceholder />
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-white/[0.04]">
        {[
          { label: 'Titik aktif', value: ready ? formatNumber(points.length) : '—' },
          {
            label: 'Provinsi',
            value: ready ? String(new Set(points.map((p) => p.provinceCode)).size) : '—',
          },
          {
            label: 'Kapasitas',
            value: ready
              ? `${formatNumber(points.reduce((a, p) => a + p.capacityKw, 0))} kW`
              : '—',
          },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 text-center">
            <div className="font-display text-lg font-extrabold tabular-nums text-white">
              {s.value}
            </div>
            <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-white/45">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
