'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { BasemapKey } from '@/components/map/leaflet-map';
import { MapLegend } from '@/components/cpss/legend';
import { PointCard } from '@/components/cpss/point-card';
import { Badge } from '@/components/ui/badge';
import { MiniStat } from '@/components/ui/stat';
import {
  IconArrowRight,
  IconBattery,
  IconBolt,
  IconCrosshair,
  IconGlobe,
  IconMapPin,
  IconSearch,
  IconTrendUp,
} from '@/components/ui/icons';
import { CATEGORY_SHORT } from '@/lib/data/points';
import { ISLANDS, PROVINCES, provinceByCode, provinceName } from '@/lib/data/provinces';
import { useDemoState, useMounted } from '@/lib/hooks';
import { approvedPoints } from '@/lib/store';
import type { PointCategory } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-navy-50">
      <div className="flex flex-col items-center gap-3 text-navy-400">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-brand-500" />
        <span className="text-xs font-semibold">Memuat peta Indonesia…</span>
      </div>
    </div>
  );
}

const LeafletMap = dynamic(() => import('@/components/map/leaflet-map'), {
  ssr: false,
  loading: () => <MapLoading />,
});

const CATEGORIES: PointCategory[] = ['SPKLU', 'SPBKLU', 'MOBILE', 'KOMUNITAS'];
const BASEMAP_OPTIONS: { key: BasemapKey; label: string }[] = [
  { key: 'terang', label: 'Standar' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'satelit', label: 'Satelit' },
];

export function CpssDashboard() {
  const { state, ready } = useDemoState();
  // Peta baru dirender setelah mount agar markup server dan klien identik.
  const mounted = useMounted();
  const [query, setQuery] = useState('');
  const [island, setIsland] = useState<string>('Semua');
  const [province, setProvince] = useState('');
  const [cats, setCats] = useState<PointCategory[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [basemap, setBasemap] = useState<BasemapKey>('terang');

  const published = useMemo(() => approvedPoints(state), [state]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return published.filter((p) => {
      if (province && p.provinceCode !== province) return false;
      if (island !== 'Semua' && provinceByCode(p.provinceCode)?.island !== island) return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        provinceName(p.provinceCode).toLowerCase().includes(q)
      );
    });
  }, [published, province, island, cats, query]);

  const stats = useMemo(() => {
    const provinces = new Set(published.map((p) => p.provinceCode));
    const cities = new Set(published.map((p) => p.city));
    const capacity = published.reduce((a, p) => a + p.capacityKw, 0);
    const connectors = published.reduce((a, p) => a + p.connectors, 0);
    return { provinces: provinces.size, cities: cities.size, capacity, connectors };
  }, [published]);

  const counts = useMemo(() => {
    const c = { SPKLU: 0, SPBKLU: 0, MOBILE: 0, KOMUNITAS: 0 } as Record<PointCategory, number>;
    filtered.forEach((p) => (c[p.category] += 1));
    return c;
  }, [filtered]);

  const byIsland = useMemo(() => {
    const map = new Map<string, number>();
    ISLANDS.forEach((i) => map.set(i, 0));
    published.forEach((p) => {
      const key = provinceByCode(p.provinceCode)?.island;
      if (key) map.set(key, (map.get(key) ?? 0) + 1);
    });
    const max = Math.max(1, ...map.values());
    return [...map.entries()].map(([name, value]) => ({ name, value, pct: (value / max) * 100 }));
  }, [published]);

  const topProvinces = useMemo(() => {
    const map = new Map<string, number>();
    published.forEach((p) => map.set(p.provinceCode, (map.get(p.provinceCode) ?? 0) + 1));
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([code, value]) => ({ code, name: provinceName(code), value }));
  }, [published]);

  const toggleCat = (c: PointCategory) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const resetFilters = () => {
    setQuery('');
    setIsland('Semua');
    setProvince('');
    setCats([]);
  };

  const activeFilterCount =
    (query ? 1 : 0) + (island !== 'Semua' ? 1 : 0) + (province ? 1 : 0) + cats.length;

  return (
    <div className="bg-navy-50/40 pb-20">
      {/* Header dashboard */}
      <section className="relative overflow-hidden bg-navy-950 pb-28 pt-12 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-[0.12]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/25 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/15 blur-[110px]" />
        <div className="container-page relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge tone="brand" className="bg-brand-600/15 text-brand-200 ring-brand-500/30" dot>
                Sistem Informasi Nasional
              </Badge>
              <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
                Dashboard Charging Point
                <span className="block text-gold-400">Service System (CPSS)</span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65">
                Peta sebaran seluruh titik layanan CPSS yang telah disetujui Dewan Pimpinan Pusat
                GPN 08. Setiap titik melewati verifikasi wilayah dan persetujuan pusat sebelum
                tayang di sini.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/pengajuan/baru" className="btn-primary">
                <IconCrosshair width={17} height={17} />
                Ajukan Titik Baru
              </Link>
              <Link href="/login" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
                Masuk Tim Lapangan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Kartu statistik menggantung */}
      <div className="container-page relative z-10 -mt-20">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MiniStat
            label="Titik CPSS aktif"
            value={ready ? formatNumber(published.length) : '—'}
            icon={<IconBolt width={20} height={20} />}
            tone="brand"
          />
          <MiniStat
            label="Provinsi terjangkau"
            value={ready ? `${stats.provinces} / 38` : '—'}
            icon={<IconGlobe width={20} height={20} />}
            tone="sky"
          />
          <MiniStat
            label="Total kapasitas terpasang"
            value={ready ? `${formatNumber(stats.capacity)} kW` : '—'}
            icon={<IconBattery width={20} height={20} />}
            tone="emerald"
          />
          <MiniStat
            label="Kota/kabupaten terlayani"
            value={ready ? formatNumber(stats.cities) : '—'}
            icon={<IconMapPin width={20} height={20} />}
            tone="amber"
          />
        </div>
      </div>

      {/* Peta + panel daftar */}
      <div className="container-page mt-8">
        <div className="grid gap-5 xl:grid-cols-[400px_1fr]">
          {/* Panel kiri */}
          <aside className="card flex max-h-[760px] flex-col overflow-hidden">
            <div className="border-b border-navy-100 p-4">
              <div className="relative">
                <IconSearch
                  width={17}
                  height={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama titik, kota, atau kode…"
                  className="field pl-10"
                  aria-label="Cari titik CPSS"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Semua', ...ISLANDS].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIsland(i)}
                    className={cn(
                      'rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold transition',
                      island === i
                        ? 'bg-navy-900 text-white'
                        : 'bg-navy-50 text-navy-600 hover:bg-navy-100',
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="field py-2 text-[13px]"
                  aria-label="Filter provinsi"
                >
                  <option value="">Semua provinsi</option>
                  {PROVINCES.filter((p) => island === 'Semua' || p.island === island).map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={basemap}
                  onChange={(e) => setBasemap(e.target.value as BasemapKey)}
                  className="field py-2 text-[13px]"
                  aria-label="Jenis peta"
                >
                  {BASEMAP_OPTIONS.map((b) => (
                    <option key={b.key} value={b.key}>
                      Peta {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCat(c)}
                    className={cn(
                      'rounded-lg border px-2.5 py-1.5 text-[11.5px] font-semibold transition',
                      cats.includes(c)
                        ? 'border-brand-300 bg-brand-50 text-brand-700'
                        : 'border-navy-100 bg-white text-navy-500 hover:border-navy-200',
                    )}
                  >
                    {CATEGORY_SHORT[c]}
                  </button>
                ))}
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="ml-auto rounded-lg px-2 py-1.5 text-[11.5px] font-semibold text-brand-600 hover:underline"
                  >
                    Reset ({activeFilterCount})
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-navy-100 bg-navy-50/60 px-4 py-2.5">
              <span className="text-[12px] font-bold text-navy-700">
                {ready ? formatNumber(filtered.length) : '—'} titik ditampilkan
              </span>
              <span className="text-[11px] text-navy-400">Klik untuk fokus ke peta</span>
            </div>

            <div className="scroll-slim flex-1 space-y-2 overflow-y-auto p-3">
              {!ready && (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-[92px] animate-pulse rounded-xl bg-navy-50" />
                  ))}
                </div>
              )}
              {ready && filtered.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                  <IconSearch width={28} height={28} className="text-navy-200" />
                  <p className="text-sm font-semibold text-navy-700">Tidak ada titik yang cocok</p>
                  <p className="max-w-[220px] text-xs text-navy-400">
                    Coba ubah kata kunci atau reset filter untuk melihat seluruh titik.
                  </p>
                  <button type="button" onClick={resetFilters} className="btn-outline btn-sm mt-2">
                    Reset filter
                  </button>
                </div>
              )}
              {ready &&
                filtered.map((p) => (
                  <PointCard
                    key={p.id}
                    point={p}
                    active={selected === p.id}
                    onSelect={setSelected}
                  />
                ))}
            </div>
          </aside>

          {/* Peta */}
          <div className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
            <div className="absolute left-4 top-4 z-[500] flex items-center gap-2 rounded-xl border border-navy-100 bg-white/95 px-3 py-2 shadow-lift backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11.5px] font-bold text-navy-800">Peta Nasional CPSS</span>
              <span className="text-[11px] text-navy-400">· diperbarui langsung</span>
            </div>

            <div className="h-[520px] w-full xl:h-[760px]">
              {mounted ? (
                <LeafletMap
                  points={filtered}
                  selectedId={selected}
                  onSelect={setSelected}
                  basemap={basemap}
                  className="h-full w-full"
                />
              ) : (
                <MapLoading />
              )}
            </div>

            <MapLegend counts={counts} />
          </div>
        </div>
      </div>

      {/* Analitik sebaran */}
      <div className="container-page mt-6 grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-navy-950">Sebaran per Pulau</h3>
              <p className="mt-0.5 text-xs text-navy-400">Jumlah titik CPSS aktif</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-500">
              <IconGlobe width={18} height={18} />
            </span>
          </div>
          <ul className="space-y-3.5">
            {byIsland.map((row) => (
              <li key={row.name}>
                <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                  <span className="font-semibold text-navy-700">{row.name}</span>
                  <span className="font-bold tabular-nums text-navy-950">{row.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-navy-50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-[width] duration-1000 ease-out"
                    style={{ width: `${ready ? row.pct : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-navy-950">Provinsi dengan Titik Terbanyak</h3>
              <p className="mt-0.5 text-xs text-navy-400">Enam wilayah teratas</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy-500">
              <IconTrendUp width={18} height={18} />
            </span>
          </div>
          <ul className="divide-y divide-navy-50">
            {topProvinces.map((p, i) => (
              <li key={p.code} className="flex items-center gap-3 py-2.5">
                <span
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-extrabold',
                    i === 0 ? 'bg-brand-600 text-white' : 'bg-navy-50 text-navy-600',
                  )}
                >
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setProvince(p.code)}
                  className="flex-1 text-left text-[13.5px] font-semibold text-navy-800 hover:text-brand-600"
                >
                  {p.name}
                </button>
                <span className="text-[13px] font-bold tabular-nums text-navy-950">{p.value}</span>
                <span className="text-[11px] text-navy-300">titik</span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-600 hover:gap-2.5 hover:underline"
          >
            Lihat data lengkap di dashboard internal
            <IconArrowRight width={15} height={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
