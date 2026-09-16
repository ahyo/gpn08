'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/dashboard/shell';
import { Badge } from '@/components/ui/badge';
import { MiniStat } from '@/components/ui/stat';
import {
  IconCheck,
  IconLock,
  IconSearch,
  IconUsers,
  IconX,
} from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { PROVINCES, provinceName } from '@/lib/data/provinces';
import { useDemoState } from '@/lib/hooks';
import { setMemberStatus } from '@/lib/store';
import type { Member } from '@/lib/types';
import { formatDate, formatNumber, initials } from '@/lib/utils';

const STATUS_TONE = {
  AKTIF: 'emerald',
  MENUNGGU: 'amber',
  DITOLAK: 'rose',
} as const;

const STATUS_LABEL = {
  AKTIF: 'Anggota Aktif',
  MENUNGGU: 'Menunggu Verifikasi',
  DITOLAK: 'Ditolak',
} as const;

export default function AnggotaPage() {
  const { user } = useAuth();
  const { state } = useDemoState();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'SEMUA' | Member['status']>('SEMUA');
  const [province, setProvince] = useState('');
  const [detail, setDetail] = useState<Member | null>(null);

  const scoped = useMemo(() => {
    if (!user) return [];
    if (user.role === 'PUSAT') return state.members;
    return state.members.filter((m) => m.provinceCode === user.provinceCode);
  }, [state, user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped
      .filter((m) => (status === 'SEMUA' ? true : m.status === status))
      .filter((m) => (province ? m.provinceCode === province : true))
      .filter(
        (m) =>
          !q ||
          m.fullName.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q),
      )
      .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
  }, [scoped, status, province, query]);

  if (!user) return null;

  if (user.role !== 'PUSAT' && user.role !== 'PROVINSI') {
    return (
      <EmptyState
        icon={<IconLock width={26} height={26} />}
        title="Halaman ini di luar kewenangan Anda"
        description="Pengelolaan data anggota hanya dapat diakses oleh DPW provinsi dan DPP pusat."
        action={
          <Link href="/dashboard" className="btn-primary btn-sm">
            Kembali ke Ringkasan
          </Link>
        }
      />
    );
  }

  const stats = {
    total: scoped.length,
    aktif: scoped.filter((m) => m.status === 'AKTIF').length,
    menunggu: scoped.filter((m) => m.status === 'MENUNGGU').length,
    ditolak: scoped.filter((m) => m.status === 'DITOLAK').length,
  };

  const provincesInScope = PROVINCES.filter((p) =>
    scoped.some((m) => m.provinceCode === p.code),
  );

  return (
    <div className="space-y-6">
      <section className="card flex items-center gap-3 p-6">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <IconUsers width={20} height={20} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold text-navy-950">Data Anggota</h1>
          <p className="mt-0.5 text-[13px] text-navy-500">
            {user.role === 'PUSAT'
              ? 'Seluruh anggota terdaftar tingkat nasional.'
              : `Anggota terdaftar di wilayah ${provinceName(user.provinceCode!)}.`}
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Total anggota" value={formatNumber(stats.total)} tone="navy" icon={<IconUsers width={20} height={20} />} />
        <MiniStat label="Anggota aktif" value={formatNumber(stats.aktif)} tone="emerald" icon={<IconCheck width={20} height={20} />} />
        <MiniStat label="Menunggu verifikasi" value={formatNumber(stats.menunggu)} tone="amber" icon={<IconSearch width={20} height={20} />} />
        <MiniStat label="Ditolak" value={formatNumber(stats.ditolak)} tone="brand" icon={<IconX width={20} height={20} />} />
      </section>

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-navy-100 p-4 lg:flex-row lg:items-center">
          <div className="flex gap-1.5">
            {(['SEMUA', 'MENUNGGU', 'AKTIF', 'DITOLAK'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-lg px-3 py-2 text-[12.5px] font-bold transition ${
                  status === s
                    ? 'bg-navy-900 text-white'
                    : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                }`}
              >
                {s === 'SEMUA' ? 'Semua' : STATUS_LABEL[s]}
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
              placeholder="Cari nama, kota, atau email…"
              className="field py-2 pl-10 text-[13px]"
            />
          </div>

          {user.role === 'PUSAT' && (
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="field w-full py-2 text-[13px] lg:w-52"
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
          <div className="px-6 py-14 text-center text-[13.5px] text-navy-400">
            Tidak ada anggota yang cocok dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-navy-100 bg-navy-50/70 text-[11px] font-bold uppercase tracking-wide text-navy-500">
                  <th className="px-5 py-3.5">Anggota</th>
                  <th className="px-5 py-3.5">Wilayah</th>
                  <th className="px-5 py-3.5">Bidang Minat</th>
                  <th className="px-5 py-3.5">Terdaftar</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((m) => (
                  <tr key={m.id} className="transition hover:bg-navy-50/50">
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => setDetail(m)}
                        className="flex items-center gap-3 text-left"
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-950 font-display text-[11px] font-extrabold text-white">
                          {initials(m.fullName)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13.5px] font-bold text-navy-950">
                            {m.fullName}
                          </span>
                          <span className="block truncate text-[11.5px] text-navy-400">
                            {m.email}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-[13px] font-medium text-navy-800">{m.city}</div>
                      <div className="text-[11.5px] text-navy-400">
                        {provinceName(m.provinceCode)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12.5px] text-navy-700">{m.interest}</td>
                    <td className="px-5 py-3.5 text-[12.5px] text-navy-600">
                      {formatDate(m.registeredAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={STATUS_TONE[m.status]} dot>
                        {STATUS_LABEL[m.status]}
                      </Badge>
                      {m.memberNumber && (
                        <div className="mt-1 text-[10.5px] font-semibold text-navy-400">
                          {m.memberNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        {m.status !== 'AKTIF' && (
                          <button
                            type="button"
                            onClick={() => setMemberStatus(m.id, 'AKTIF')}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 text-[11.5px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <IconCheck width={14} height={14} />
                            Setujui
                          </button>
                        )}
                        {m.status !== 'DITOLAK' && (
                          <button
                            type="button"
                            onClick={() => setMemberStatus(m.id, 'DITOLAK')}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-navy-50 px-2.5 text-[11.5px] font-bold text-navy-600 transition hover:bg-rose-50 hover:text-rose-700"
                          >
                            <IconX width={14} height={14} />
                            Tolak
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {detail && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-navy-950/60 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="absolute inset-0" onClick={() => setDetail(null)} aria-hidden="true" />
          <div className="scroll-slim relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-lift sm:rounded-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-navy-950 font-display text-[13px] font-extrabold text-white">
                  {initials(detail.fullName)}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-navy-950">{detail.fullName}</h2>
                  <Badge tone={STATUS_TONE[detail.status]} dot>
                    {STATUS_LABEL[detail.status]}
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-navy-200 text-navy-600 hover:bg-navy-50"
                aria-label="Tutup"
              >
                <IconX width={17} height={17} />
              </button>
            </div>

            <dl className="mt-5 divide-y divide-navy-50 rounded-xl border border-navy-100">
              {[
                ['NIK', detail.nik],
                ['Email', detail.email],
                ['Telepon', detail.phone],
                ['Tempat, Tgl Lahir', `${detail.birthPlace}, ${formatDate(detail.birthDate)}`],
                ['Jenis Kelamin', detail.gender],
                ['Alamat', detail.address],
                ['Wilayah', `${detail.city}, ${provinceName(detail.provinceCode)}`],
                ['Pekerjaan', detail.profession],
                ['Pendidikan', detail.education],
                ['Bidang Minat', detail.interest],
                ['Nomor Anggota', detail.memberNumber ?? '— belum diterbitkan —'],
                ['Terdaftar', formatDate(detail.registeredAt, true)],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[150px_1fr] sm:gap-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-navy-400">
                    {k}
                  </dt>
                  <dd className="text-[13px] text-navy-800">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-xl bg-navy-50/70 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-navy-400">
                Motivasi
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-navy-700">
                {detail.motivation}
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              {detail.status !== 'AKTIF' && (
                <button
                  type="button"
                  onClick={() => {
                    setMemberStatus(detail.id, 'AKTIF');
                    setDetail(null);
                  }}
                  className="btn btn-sm flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <IconCheck width={15} height={15} />
                  Setujui Keanggotaan
                </button>
              )}
              {detail.status !== 'DITOLAK' && (
                <button
                  type="button"
                  onClick={() => {
                    setMemberStatus(detail.id, 'DITOLAK');
                    setDetail(null);
                  }}
                  className="btn-outline btn-sm flex-1"
                >
                  Tolak
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
