'use client';

import { CATEGORY_SHORT, STATUS_LABEL, STATUS_TONE } from '@/lib/data/points';
import { provinceName } from '@/lib/data/provinces';
import type { CpssPoint } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { IconBattery, IconClock, IconMapPin } from '@/components/ui/icons';
import { cn, formatDate } from '@/lib/utils';

const DOT: Record<CpssPoint['category'], string> = {
  SPKLU: 'bg-brand-600',
  SPBKLU: 'bg-cyan-700',
  MOBILE: 'bg-gold-600',
  KOMUNITAS: 'bg-green-700',
};

export function PointCard({
  point,
  active,
  onSelect,
  showStatus = false,
}: {
  point: CpssPoint;
  active?: boolean;
  onSelect?: (id: string) => void;
  showStatus?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(point.id)}
      className={cn(
        'w-full rounded-xl border p-3.5 text-left transition-all duration-200',
        active
          ? 'border-brand-300 bg-brand-50/60 shadow-[0_0_0_3px_rgba(224,23,41,0.08)]'
          : 'border-navy-100 bg-white hover:border-navy-200 hover:bg-navy-50/60',
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-current/10', DOT[point.category])} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="truncate text-[14px] font-bold leading-snug text-navy-950">{point.name}</h4>
            <span className="shrink-0 rounded-md bg-navy-50 px-1.5 py-0.5 text-[10px] font-bold text-navy-500">
              {CATEGORY_SHORT[point.category]}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 truncate text-[12px] text-navy-500">
            <IconMapPin width={13} height={13} className="shrink-0 text-navy-300" />
            {point.city}, {provinceName(point.provinceCode)}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11.5px] font-medium text-navy-500">
            <span className="flex items-center gap-1">
              <IconBattery width={13} height={13} className="text-navy-300" />
              {point.capacityKw} kW · {point.connectors} konektor
            </span>
            <span className="flex items-center gap-1">
              <IconClock width={13} height={13} className="text-navy-300" />
              {point.operatingHours}
            </span>
          </div>
          {showStatus && (
            <div className="mt-2.5 flex items-center gap-2">
              <Badge tone={STATUS_TONE[point.status]} dot>
                {STATUS_LABEL[point.status]}
              </Badge>
              <span className="text-[11px] text-navy-400">{formatDate(point.submittedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
