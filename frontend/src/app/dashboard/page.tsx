'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/dashboard/shell';
import { PointDetailModal } from '@/components/dashboard/point-detail';
import { PointTable } from '@/components/dashboard/point-table';
import { Badge } from '@/components/ui/badge';
import { MiniStat } from '@/components/ui/stat';
import {
  IconArrowRight,
  IconBell,
  IconBolt,
  IconCheck,
  IconClock,
  IconCrosshair,
  IconFileText,
  IconShield,
  IconUsers,
} from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { provinceName } from '@/lib/data/provinces';
import { useDemoState } from '@/lib/hooks';
import { notificationsFor, scopedPoints } from '@/lib/store';
import type { CpssPoint } from '@/lib/types';
import { formatNumber, relativeTime } from '@/lib/utils';

const PIPELINE = [
  { status: 'DIAJUKAN', label: 'Diajukan DPD', tone: 'amber', desc: 'Menunggu verifikasi wilayah' },
  { status: 'DIVERIFIKASI', label: 'Diverifikasi DPW', tone: 'sky', desc: 'Menunggu persetujuan pusat' },
  { status: 'DISETUJUI', label: 'Disetujui DPP', tone: 'emerald', desc: 'Tayang di peta nasional' },
  { status: 'DITOLAK', label: 'Ditolak', tone: 'rose', desc: 'Perlu perbaikan / pengajuan ulang' },
] as const;

export default function DashboardHome() {
  const { user } = useAuth();
  const { state } = useDemoState();
  const [selected, setSelected] = useState<CpssPoint | null>(null);

  const points = useMemo(() => scopedPoints(state, user), [state, user]);
  const notifications = useMemo(() => notificationsFor(user), [state, user]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { DIAJUKAN: 0, DIVERIFIKASI: 0, DISETUJUI: 0, DITOLAK: 0 };
    points.forEach((p) => (c[p.status] = (c[p.status] ?? 0) + 1));
    return c;
  }, [points]);

  const members = useMemo(() => {
    if (!user) return [];
    if (user.role === 'PUSAT') return state.members;
    return state.members.filter((m) => m.provinceCode === user.provinceCode);
  }, [state, user]);

  if (!user) return null;

  const recent = [...points]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, 6);

  const actionable =
    user.role === 'PROVINSI'
      ? points.filter((p) => p.status === 'DIAJUKAN')
      : user.role === 'PUSAT'
        ? points.filter((p) => p.status === 'DIVERIFIKASI')
        : [];

  const scopeLabel =
    user.role === 'PUSAT'
      ? 'Nasional'
      : user.role === 'PROVINSI'
        ? provinceName(user.provinceCode!)
        : `${user.city ?? ''}, ${provinceName(user.provinceCode!)}`;

  return (
    <div className="space-y-6">
      {/* Sambutan */}
      <section className="relative overflow-hidden rounded-2xl bg-navy-950 px-7 py-8 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.10]" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-600/25 blur-[90px]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge tone="brand" className="bg-brand-600/20 text-brand-200 ring-brand-500/30" dot>
              Cakupan: {scopeLabel}
            </Badge>
            <h1 className="mt-3.5 text-2xl font-extrabold sm:text-[1.75rem]">
              Selamat datang, {user.name.split(' ')[0]}
            </h1>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-white/60">
              {user.position}. Berikut ringkasan aktivitas Charging Point Service System pada
              cakupan wewenang Anda.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {actionable.length > 0 && (
              <Link
                href={user.role === 'PROVINSI' ? '/dashboard/verifikasi' : '/dashboard/persetujuan'}
                className="btn-primary btn-sm"
              >
                <IconShield width={15} height={15} />
                {actionable.length} menunggu tindakan Anda
              </Link>
            )}
            <Link
              href="/dashboard/pengajuan/baru"
              className="btn btn-sm border border-white/20 bg-white/10 text-white hover:bg-white/15"
            >
              <IconCrosshair width={15} height={15} />
              Ajukan Titik
            </Link>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat
          label="Total titik dalam cakupan"
          value={formatNumber(points.length)}
          icon={<IconBolt width={20} height={20} />}
          tone="navy"
        />
        <MiniStat
          label="Menunggu verifikasi DPW"
          value={formatNumber(counts.DIAJUKAN)}
          icon={<IconClock width={20} height={20} />}
          tone="amber"
        />
        <MiniStat
          label="Menunggu persetujuan DPP"
          value={formatNumber(counts.DIVERIFIKASI)}
          icon={<IconFileText width={20} height={20} />}
          tone="sky"
        />
        <MiniStat
          label="Disetujui & tayang"
          value={formatNumber(counts.DISETUJUI)}
          icon={<IconCheck width={20} height={20} />}
          tone="emerald"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Pipeline + tabel */}
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-[15px] font-bold text-navy-950">Alur Pengajuan Titik</h2>
            <p className="mt-1 text-[12.5px] text-navy-400">
              Distribusi status seluruh pengajuan dalam cakupan wewenang Anda.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PIPELINE.map((s) => (
                <div
                  key={s.status}
                  className="rounded-xl border border-navy-100 bg-navy-50/40 p-4 transition hover:border-navy-200"
                >
                  <Badge tone={s.tone}>{s.label}</Badge>
                  <div className="mt-3 font-display text-3xl font-extrabold tabular-nums text-navy-950">
                    {formatNumber(counts[s.status] ?? 0)}
                  </div>
                  <p className="mt-1 text-[11.5px] leading-tight text-navy-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
              <div>
                <h2 className="text-[15px] font-bold text-navy-950">Pengajuan Terbaru</h2>
                <p className="mt-0.5 text-[12px] text-navy-400">
                  Enam pengajuan terakhir dalam cakupan Anda
                </p>
              </div>
              <Link
                href="/dashboard/pengajuan"
                className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand-600 hover:gap-2.5"
              >
                Semua
                <IconArrowRight width={14} height={14} />
              </Link>
            </div>
            <PointTable
              points={recent}
              onSelect={setSelected}
              emptyLabel="Belum ada pengajuan titik pada cakupan wilayah Anda."
            />
          </section>
        </div>

        {/* Sisi kanan */}
        <div className="space-y-6">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-navy-950">
                <IconBell width={17} height={17} className="text-brand-600" />
                Notifikasi
              </h2>
              <Link
                href="/dashboard/notifikasi"
                className="text-[12.5px] font-bold text-brand-600 hover:underline"
              >
                Lihat semua
              </Link>
            </div>
            {notifications.length === 0 ? (
              <div className="px-6 py-10 text-center text-[13px] text-navy-400">
                Belum ada notifikasi untuk jenjang Anda.
              </div>
            ) : (
              <ul className="divide-y divide-navy-50">
                {notifications.slice(0, 5).map((n) => (
                  <li key={n.id} className="flex gap-3 px-6 py-4">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        n.read ? 'bg-navy-200' : 'bg-brand-500'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold leading-snug text-navy-900">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-relaxed text-navy-500">
                        {n.body}
                      </p>
                      <span className="mt-1 block text-[11px] text-navy-400">
                        {relativeTime(n.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {(user.role === 'PUSAT' || user.role === 'PROVINSI') && (
            <section className="card p-6">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-navy-950">
                <IconUsers width={17} height={17} className="text-brand-600" />
                Keanggotaan
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { l: 'Total', v: members.length, c: 'text-navy-950' },
                  {
                    l: 'Aktif',
                    v: members.filter((m) => m.status === 'AKTIF').length,
                    c: 'text-emerald-600',
                  },
                  {
                    l: 'Menunggu',
                    v: members.filter((m) => m.status === 'MENUNGGU').length,
                    c: 'text-amber-600',
                  },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-navy-50/70 p-3.5 text-center">
                    <div className={`font-display text-2xl font-extrabold ${s.c}`}>
                      {formatNumber(s.v)}
                    </div>
                    <div className="mt-0.5 text-[11px] text-navy-400">{s.l}</div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/anggota" className="btn-outline btn-sm mt-4 w-full">
                Kelola data anggota
              </Link>
            </section>
          )}

          <section className="card bg-gradient-to-br from-navy-900 to-navy-950 p-6 text-white">
            <h2 className="text-[15px] font-bold">Panduan Singkat</h2>
            <ol className="mt-4 space-y-3 text-[13px] text-white/70">
              {[
                'DPD kota/kabupaten mengajukan titik lengkap dengan koordinat GPS.',
                'DPW provinsi memverifikasi kelayakan lokasi dan data teknis.',
                'DPP pusat memberi persetujuan akhir; titik langsung tayang publik.',
              ].map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[11px] font-extrabold text-gold-400">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {points.length === 0 && (
        <EmptyState
          icon={<IconCrosshair width={26} height={26} />}
          title="Belum ada titik pada cakupan Anda"
          description="Mulailah dengan mengajukan titik CPSS pertama di wilayah kerja Anda."
          action={
            <Link href="/dashboard/pengajuan/baru" className="btn-primary btn-sm">
              Ajukan Titik Baru
            </Link>
          }
        />
      )}

      <PointDetailModal point={selected} user={user} onClose={() => setSelected(null)} />
    </div>
  );
}
