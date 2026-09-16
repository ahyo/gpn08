import { CATEGORY_SHORT } from '@/lib/data/points';
import type { PointCategory } from '@/lib/types';

const COLORS: Record<PointCategory, string> = {
  SPKLU: '#e01729',
  SPBKLU: '#0e7490',
  MOBILE: '#c88a15',
  KOMUNITAS: '#15803d',
};

export function MapLegend({ counts }: { counts: Record<PointCategory, number> }) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-xl border border-navy-100 bg-white/95 p-3 shadow-lift backdrop-blur">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-navy-400">
        Kategori Titik
      </div>
      <ul className="space-y-1.5">
        {(Object.keys(COLORS) as PointCategory[]).map((k) => (
          <li key={k} className="flex items-center gap-2 text-[11.5px] font-semibold text-navy-700">
            <span
              className="h-2.5 w-2.5 rounded-full ring-2 ring-white"
              style={{ background: COLORS[k], boxShadow: `0 0 0 3px ${COLORS[k]}22` }}
            />
            {CATEGORY_SHORT[k]}
            <span className="ml-auto pl-3 tabular-nums text-navy-400">{counts[k] ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
