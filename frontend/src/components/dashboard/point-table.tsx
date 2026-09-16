'use client';

import { Badge } from '@/components/ui/badge';
import { CATEGORY_SHORT, STATUS_LABEL, STATUS_TONE } from '@/lib/data/points';
import { provinceName } from '@/lib/data/provinces';
import type { CpssPoint } from '@/lib/types';
import { formatDate, relativeTime } from '@/lib/utils';

export function PointTable({
  points,
  onSelect,
  emptyLabel = 'Belum ada data.',
}: {
  points: CpssPoint[];
  onSelect: (p: CpssPoint) => void;
  emptyLabel?: string;
}) {
  if (points.length === 0) {
    return (
      <div className="px-6 py-14 text-center text-[13.5px] text-navy-400">{emptyLabel}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left">
        <thead>
          <tr className="border-b border-navy-100 bg-navy-50/70 text-[11px] font-bold uppercase tracking-wide text-navy-500">
            <th className="px-5 py-3.5">Kode & Nama Titik</th>
            <th className="px-5 py-3.5">Wilayah</th>
            <th className="px-5 py-3.5">Kategori</th>
            <th className="px-5 py-3.5">Kapasitas</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Diajukan</th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-50">
          {points.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelect(p)}
              className="cursor-pointer transition hover:bg-navy-50/50"
            >
              <td className="px-5 py-3.5">
                <div className="text-[10.5px] font-bold uppercase tracking-wide text-navy-400">
                  {p.code}
                </div>
                <div className="mt-0.5 text-[13.5px] font-bold text-navy-950">{p.name}</div>
              </td>
              <td className="px-5 py-3.5">
                <div className="text-[13px] font-medium text-navy-800">{p.city}</div>
                <div className="text-[11.5px] text-navy-400">{provinceName(p.provinceCode)}</div>
              </td>
              <td className="px-5 py-3.5">
                <span className="rounded-md bg-navy-50 px-2 py-1 text-[11px] font-bold text-navy-600">
                  {CATEGORY_SHORT[p.category]}
                </span>
              </td>
              <td className="px-5 py-3.5 text-[13px] font-semibold tabular-nums text-navy-800">
                {p.capacityKw} kW
              </td>
              <td className="px-5 py-3.5">
                <Badge tone={STATUS_TONE[p.status]} dot>
                  {STATUS_LABEL[p.status]}
                </Badge>
              </td>
              <td className="px-5 py-3.5">
                <div className="text-[12.5px] text-navy-700">{formatDate(p.submittedAt)}</div>
                <div className="text-[11px] text-navy-400">{relativeTime(p.submittedAt)}</div>
              </td>
              <td className="px-5 py-3.5 text-right">
                <span className="text-[12.5px] font-bold text-brand-600">Detail</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
