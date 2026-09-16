'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  IconCheck,
  IconClock,
  IconMapPin,
  IconPhone,
  IconShield,
  IconX,
} from '@/components/ui/icons';
import { CATEGORY_LABEL, STATUS_LABEL, STATUS_TONE } from '@/lib/data/points';
import { provinceName } from '@/lib/data/provinces';
import { approvePoint, rejectPoint, verifyPoint } from '@/lib/store';
import type { CpssPoint, SessionUser } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const LeafletMap = dynamic(() => import('@/components/map/leaflet-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-navy-50" />,
});

export function PointDetailModal({
  point,
  user,
  onClose,
}: {
  point: CpssPoint | null;
  user: SessionUser;
  onClose: () => void;
}) {
  const [note, setNote] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    setNote('');
    setRejecting(false);
    setDone(null);
  }, [point?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = point ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [point, onClose]);

  if (!point) return null;

  const canVerify = user.role === 'PROVINSI' && point.status === 'DIAJUKAN';
  const canApprove = user.role === 'PUSAT' && point.status === 'DIVERIFIKASI';
  const canReject =
    (user.role === 'PROVINSI' && point.status === 'DIAJUKAN') ||
    (user.role === 'PUSAT' && ['DIAJUKAN', 'DIVERIFIKASI'].includes(point.status));

  const handleVerify = () => {
    verifyPoint(point.id, user, note || undefined);
    setDone('Titik berhasil diverifikasi dan diteruskan ke DPP untuk persetujuan akhir.');
  };

  const handleApprove = () => {
    approvePoint(point.id, user, note || undefined);
    setDone('Titik disetujui dan kini tayang di Dashboard CPSS nasional.');
  };

  const handleReject = () => {
    if (note.trim().length < 10) return;
    rejectPoint(point.id, user, note.trim());
    setDone('Pengajuan ditolak. Notifikasi dikirim ke pengaju.');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-navy-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        className="absolute inset-0"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <div className="scroll-slim relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-lift sm:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-navy-100 bg-white/95 px-6 py-5 backdrop-blur">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10.5px] font-bold uppercase tracking-wide text-navy-400">
                {point.code}
              </span>
              <Badge tone={STATUS_TONE[point.status]} dot>
                {STATUS_LABEL[point.status]}
              </Badge>
            </div>
            <h2 className="mt-1 truncate text-lg font-extrabold text-navy-950">{point.name}</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-navy-500">
              <IconMapPin width={14} height={14} className="text-navy-300" />
              {point.district}, {point.city}, {provinceName(point.provinceCode)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-navy-200 text-navy-600 transition hover:bg-navy-50"
            aria-label="Tutup"
          >
            <IconX width={17} height={17} />
          </button>
        </div>

        <div className="p-6">
          {done && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <IconCheck width={18} height={18} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-[13.5px] font-bold text-emerald-900">Tindakan tersimpan</p>
                <p className="mt-0.5 text-[13px] text-emerald-800/85">{done}</p>
              </div>
            </div>
          )}

          {/* Peta mini */}
          <div className="overflow-hidden rounded-xl border border-navy-100">
            <div className="h-48 w-full">
              <LeafletMap
                points={[point]}
                selectedId={point.id}
                basemap="terang"
                interactive={false}
                className="h-full w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-navy-100 bg-navy-50/60 px-4 py-2.5 text-[12px]">
              <span className="font-semibold text-navy-700">Koordinat GPS</span>
              <code className="rounded-md bg-white px-2 py-1 font-bold text-navy-900 ring-1 ring-navy-100">
                {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
              </code>
            </div>
          </div>

          {/* Detail teknis */}
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Kategori Layanan', CATEGORY_LABEL[point.category]],
              ['Kapasitas Daya', `${point.capacityKw} kW`],
              ['Jumlah Konektor', `${point.connectors} unit`],
              ['Jam Operasional', point.operatingHours],
              ['Alamat Lengkap', point.address],
              ['Penanggung Jawab', `${point.picName} · ${point.picPhone}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-navy-50/70 px-4 py-3">
                <dt className="text-[10.5px] font-bold uppercase tracking-wide text-navy-400">
                  {k}
                </dt>
                <dd className="mt-1 text-[13.5px] font-semibold text-navy-900">{v}</dd>
              </div>
            ))}
          </dl>

          {point.notes && (
            <div className="mt-4 rounded-xl border border-navy-100 p-4">
              <div className="text-[10.5px] font-bold uppercase tracking-wide text-navy-400">
                Catatan Pengaju
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-navy-700">{point.notes}</p>
            </div>
          )}

          {point.rejectedReason && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <div className="text-[10.5px] font-bold uppercase tracking-wide text-rose-600">
                Alasan Penolakan
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-rose-900">
                {point.rejectedReason}
              </p>
            </div>
          )}

          {/* Riwayat */}
          <div className="mt-6">
            <h3 className="text-[13px] font-bold uppercase tracking-wide text-navy-500">
              Riwayat Proses
            </h3>
            <ol className="mt-4 space-y-4 border-l-2 border-navy-100 pl-5">
              {point.history.map((h, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-brand-500" />
                  <div className="text-[13.5px] font-bold text-navy-900">{h.action}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11.5px] text-navy-400">
                    <IconClock width={12} height={12} />
                    {formatDate(h.at, true)}
                    <span className="h-1 w-1 rounded-full bg-navy-200" />
                    {h.actor}
                  </div>
                  {h.note && (
                    <p className="mt-1.5 rounded-lg bg-navy-50 px-3 py-2 text-[12.5px] text-navy-600">
                      {h.note}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Tindakan */}
          {!done && (canVerify || canApprove || canReject) && (
            <div className="mt-7 rounded-xl border border-navy-100 bg-navy-50/50 p-5">
              <h3 className="flex items-center gap-2 text-[13.5px] font-bold text-navy-950">
                <IconShield width={16} height={16} className="text-brand-600" />
                Tindakan {user.level}
              </h3>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  rejecting
                    ? 'Tuliskan alasan penolakan (minimal 10 karakter). Alasan ini akan dikirim ke pengaju.'
                    : 'Catatan tambahan (opsional) — misalnya hasil survei atau syarat teknis.'
                }
                className="field mt-3 min-h-[84px] resize-y bg-white"
              />

              <div className="mt-3 flex flex-wrap gap-2.5">
                {canVerify && (
                  <button type="button" onClick={handleVerify} className="btn-primary btn-sm">
                    <IconCheck width={15} height={15} />
                    Verifikasi & Teruskan ke DPP
                  </button>
                )}
                {canApprove && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <IconCheck width={15} height={15} />
                    Setujui & Tayangkan
                  </button>
                )}
                {canReject && !rejecting && (
                  <button
                    type="button"
                    onClick={() => setRejecting(true)}
                    className="btn-outline btn-sm text-brand-700"
                  >
                    <IconX width={15} height={15} />
                    Tolak Pengajuan
                  </button>
                )}
                {rejecting && (
                  <>
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={note.trim().length < 10}
                      className="btn btn-sm bg-brand-700 text-white hover:bg-brand-800"
                    >
                      Konfirmasi Penolakan
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejecting(false)}
                      className="btn-ghost btn-sm"
                    >
                      Batal
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {!done && !canVerify && !canApprove && !canReject && (
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50/60 p-4 text-[13px] text-navy-600">
              <IconPhone width={17} height={17} className="mt-0.5 shrink-0 text-navy-400" />
              <span>
                Tidak ada tindakan yang tersedia untuk jenjang <strong>{user.level}</strong> pada
                status titik ini.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
