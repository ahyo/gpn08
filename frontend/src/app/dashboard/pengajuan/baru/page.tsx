'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Field, SelectInput, Stepper, TextArea, TextInput } from '@/components/forms/field';
import { Badge } from '@/components/ui/badge';
import {
  IconArrowRight,
  IconCheck,
  IconCrosshair,
  IconInfo,
  IconMapPin,
  IconWarning,
} from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { CATEGORY_LABEL } from '@/lib/data/points';
import { PROVINCES, provinceByCode, provinceName } from '@/lib/data/provinces';
import { createPoint, type NewPointInput } from '@/lib/store';
import type { CpssPoint, PointCategory } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const PickerMap = dynamic(() => import('@/components/map/picker-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-navy-100" />,
});

const STEPS = ['Lokasi & Koordinat', 'Data Teknis', 'Penanggung Jawab', 'Kirim'];
const CATEGORIES: PointCategory[] = ['SPKLU', 'SPBKLU', 'MOBILE', 'KOMUNITAS'];
const HOURS = ['24 Jam', '06.00 – 22.00 WIB', '07.00 – 21.00 WIB', '08.00 – 20.00 WIB'];

export default function PengajuanBaruPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<CpssPoint | null>(null);
  const [geoError, setGeoError] = useState('');

  const [form, setForm] = useState({
    name: '',
    provinceCode: '',
    city: '',
    district: '',
    address: '',
    lat: '',
    lng: '',
    category: 'SPKLU' as PointCategory,
    capacityKw: 150,
    connectors: 4,
    operatingHours: '24 Jam',
    picName: '',
    picPhone: '',
    notes: '',
  });

  // Prefill wilayah dan kontak sesuai jenjang pengguna yang masuk.
  useEffect(() => {
    if (!user?.provinceCode) return;
    setForm((f) =>
      f.provinceCode
        ? f
        : {
            ...f,
            provinceCode: user.provinceCode!,
            city: user.city ?? '',
            picName: f.picName || user.name,
            picPhone: f.picPhone || user.phone,
          },
    );
  }, [user]);

  const province = form.provinceCode ? provinceByCode(form.provinceCode) : undefined;

  /** Koordinat yang sudah valid sebagai angka, atau null jika masih diketik. */
  const coords = useMemo(() => {
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (form.lat.trim() === '' || form.lng.trim() === '') return null;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (lat < -11.5 || lat > 7 || lng < 94 || lng > 142) return null;
    return { lat, lng };
  }, [form.lat, form.lng]);

  const mapCenter: [number, number] = province ? [province.lat, province.lng] : [-2.5, 118];
  const mapZoom = coords ? 13 : province ? 8 : 4;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const validate = (target: number) => {
    const e: Record<string, string> = {};
    if (target > 0) {
      if (form.name.trim().length < 5) e.name = 'Nama titik minimal 5 karakter.';
      if (!form.provinceCode) e.provinceCode = 'Pilih provinsi.';
      if (!form.city) e.city = 'Pilih kota/kabupaten.';
      if (!form.district.trim()) e.district = 'Kecamatan wajib diisi.';
      if (form.address.trim().length < 8) e.address = 'Alamat terlalu pendek.';
      if (!coords)
        e.coords =
          'Tentukan koordinat yang valid dalam cakupan Indonesia dengan mengeklik peta atau mengisi manual.';
    }
    if (target > 1) {
      if (form.capacityKw < 3 || form.capacityKw > 600)
        e.capacityKw = 'Kapasitas antara 3 kW sampai 600 kW.';
      if (form.connectors < 1 || form.connectors > 24)
        e.connectors = 'Jumlah konektor antara 1 sampai 24 unit.';
    }
    if (target > 2) {
      if (form.picName.trim().length < 3) e.picName = 'Nama penanggung jawab wajib diisi.';
      if (!/^0\d{8,13}$/.test(form.picPhone.replace(/[-\s]/g, '')))
        e.picPhone = 'Nomor telepon diawali 0 dan terdiri dari 9–14 digit.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const useMyLocation = () => {
    setGeoError('');
    if (!('geolocation' in navigator)) {
      setGeoError('Perangkat ini tidak mendukung penentuan lokasi otomatis.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('lat', pos.coords.latitude.toFixed(6));
        set('lng', pos.coords.longitude.toFixed(6));
      },
      () => setGeoError('Izin lokasi ditolak. Silakan tentukan titik secara manual pada peta.'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const submit = () => {
    if (!user || !coords || !validate(3)) return;
    const payload: NewPointInput = {
      name: form.name.trim(),
      provinceCode: form.provinceCode,
      city: form.city,
      district: form.district.trim(),
      address: form.address.trim(),
      lat: coords.lat,
      lng: coords.lng,
      category: form.category,
      capacityKw: Number(form.capacityKw),
      connectors: Number(form.connectors),
      operatingHours: form.operatingHours,
      picName: form.picName.trim(),
      picPhone: form.picPhone.trim(),
      notes: form.notes.trim(),
    };
    setCreated(createPoint(payload, user));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) return null;

  if (created) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 px-8 py-10 text-center text-white">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <IconCheck width={30} height={30} />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold">Pengajuan Terkirim</h1>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-white/80">
              Titik <strong>{created.name}</strong> telah masuk antrean verifikasi DPW{' '}
              {provinceName(created.provinceCode)}.
            </p>
          </div>
          <div className="p-8">
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ['Kode Titik', created.code],
                ['Status', 'Menunggu verifikasi DPW'],
                ['Koordinat', `${created.lat}, ${created.lng}`],
                ['Diajukan', formatDate(created.submittedAt, true)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-navy-50/70 px-4 py-3">
                  <dt className="text-[10.5px] font-bold uppercase tracking-wide text-navy-400">
                    {k}
                  </dt>
                  <dd className="mt-1 text-[13.5px] font-semibold text-navy-900">{v}</dd>
                </div>
              ))}
            </dl>

            <ol className="mt-6 space-y-3 rounded-xl border border-sky-100 bg-sky-50 p-5 text-[13px] text-sky-900">
              <li className="flex gap-3">
                <span className="font-extrabold">1.</span>
                DPW {provinceName(created.provinceCode)} menerima notifikasi dan memverifikasi data lapangan.
              </li>
              <li className="flex gap-3">
                <span className="font-extrabold">2.</span>
                Setelah diverifikasi, DPP menerima notifikasi untuk memberi persetujuan akhir.
              </li>
              <li className="flex gap-3">
                <span className="font-extrabold">3.</span>
                Titik yang disetujui langsung tayang di Dashboard CPSS nasional.
              </li>
            </ol>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/dashboard/pengajuan" className="btn-primary">
                Lihat Daftar Pengajuan
                <IconArrowRight width={16} height={16} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setCreated(null);
                  setStep(0);
                  setForm((f) => ({
                    ...f,
                    name: '',
                    district: '',
                    address: '',
                    lat: '',
                    lng: '',
                    notes: '',
                  }));
                }}
                className="btn-outline"
              >
                Ajukan Titik Lain
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <IconCrosshair width={20} height={20} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-navy-950">Pengajuan Titik CPSS Baru</h1>
              <p className="mt-0.5 text-[13px] text-navy-500">
                Diajukan oleh {user.name} · {user.level}
                {user.city ? ` · ${user.city}` : ''}
              </p>
            </div>
          </div>
          <Badge tone="amber" dot>
            Akan diverifikasi DPW
          </Badge>
        </div>
        <div className="mt-6 border-t border-navy-100 pt-6">
          <Stepper steps={STEPS} current={step} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <section className="card p-6">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nama Titik" required error={errors.name} className="sm:col-span-2">
                <TextInput
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Contoh: CPSS Alun-Alun Kota Bandung"
                  error={!!errors.name}
                />
              </Field>

              <Field label="Provinsi" required error={errors.provinceCode}>
                <SelectInput
                  value={form.provinceCode}
                  onChange={(e) => {
                    set('provinceCode', e.target.value);
                    set('city', '');
                  }}
                  disabled={user.role !== 'PUSAT' && !!user.provinceCode}
                  error={!!errors.provinceCode}
                >
                  <option value="">— Pilih provinsi —</option>
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Kota / Kabupaten" required error={errors.city}>
                <SelectInput
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  disabled={!form.provinceCode || user.role === 'KOTA'}
                  error={!!errors.city}
                >
                  <option value="">— Pilih kota/kabupaten —</option>
                  {(province?.cities ?? []).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  {user.city && !(province?.cities ?? []).includes(user.city) && (
                    <option value={user.city}>{user.city}</option>
                  )}
                </SelectInput>
              </Field>

              <Field label="Kecamatan" required error={errors.district}>
                <TextInput
                  value={form.district}
                  onChange={(e) => set('district', e.target.value)}
                  placeholder="Contoh: Coblong"
                  error={!!errors.district}
                />
              </Field>

              <Field label="Alamat Lengkap" required error={errors.address}>
                <TextInput
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Nama jalan dan nomor"
                  error={!!errors.address}
                />
              </Field>

              <div className="sm:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="field-label mb-0">
                    Koordinat GPS<span className="ml-0.5 text-brand-600">*</span>
                  </label>
                  <button type="button" onClick={useMyLocation} className="btn-ghost btn-sm">
                    <IconMapPin width={14} height={14} />
                    Gunakan lokasi saya
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <TextInput
                    value={form.lat}
                    onChange={(e) => set('lat', e.target.value)}
                    placeholder="Lintang (latitude)"
                    inputMode="decimal"
                    error={!!errors.coords}
                  />
                  <TextInput
                    value={form.lng}
                    onChange={(e) => set('lng', e.target.value)}
                    placeholder="Bujur (longitude)"
                    inputMode="decimal"
                    error={!!errors.coords}
                  />
                </div>
                {errors.coords && (
                  <p className="mt-1 text-xs font-medium text-brand-600">{errors.coords}</p>
                )}
                {geoError && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <IconWarning width={13} height={13} />
                    {geoError}
                  </p>
                )}
                <p className="field-hint">
                  Klik pada peta di samping, geser penanda, atau isi manual hasil pengukuran GPS.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Kategori Layanan" required className="sm:col-span-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set('category', c)}
                      className={`rounded-xl border p-3.5 text-left transition ${
                        form.category === c
                          ? 'border-brand-300 bg-brand-50'
                          : 'border-navy-100 bg-white hover:border-navy-200'
                      }`}
                    >
                      <span className="block text-[13px] font-bold text-navy-950">{c}</span>
                      <span className="mt-0.5 block text-[11.5px] text-navy-500">
                        {CATEGORY_LABEL[c].split('—')[1]?.trim() ?? CATEGORY_LABEL[c]}
                      </span>
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label="Kapasitas Daya (kW)"
                required
                error={errors.capacityKw}
                hint="Sesuai kapasitas terpasang pada lokasi"
              >
                <TextInput
                  type="number"
                  value={form.capacityKw}
                  onChange={(e) => set('capacityKw', Number(e.target.value))}
                  min={3}
                  max={600}
                  error={!!errors.capacityKw}
                />
              </Field>

              <Field label="Jumlah Konektor" required error={errors.connectors}>
                <TextInput
                  type="number"
                  value={form.connectors}
                  onChange={(e) => set('connectors', Number(e.target.value))}
                  min={1}
                  max={24}
                  error={!!errors.connectors}
                />
              </Field>

              <Field label="Jam Operasional" required className="sm:col-span-2">
                <SelectInput
                  value={form.operatingHours}
                  onChange={(e) => set('operatingHours', e.target.value)}
                >
                  {HOURS.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field
                label="Catatan Lokasi"
                className="sm:col-span-2"
                hint="Kondisi akses jalan, ketersediaan daya, kerja sama dengan pemilik lahan, dll."
              >
                <TextArea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Tuliskan informasi pendukung untuk memudahkan verifikasi DPW."
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nama Penanggung Jawab" required error={errors.picName}>
                <TextInput
                  value={form.picName}
                  onChange={(e) => set('picName', e.target.value)}
                  placeholder="Nama petugas di lokasi"
                  error={!!errors.picName}
                />
              </Field>
              <Field label="Nomor Telepon PJ" required error={errors.picPhone}>
                <TextInput
                  value={form.picPhone}
                  onChange={(e) => set('picPhone', e.target.value)}
                  placeholder="08123456789"
                  error={!!errors.picPhone}
                />
              </Field>

              <div className="flex gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4 sm:col-span-2">
                <IconInfo width={18} height={18} className="mt-0.5 shrink-0 text-sky-600" />
                <p className="text-[13px] leading-relaxed text-sky-900">
                  Penanggung jawab akan dihubungi tim verifikasi DPW{' '}
                  {form.provinceCode ? provinceName(form.provinceCode) : 'provinsi'} untuk
                  penjadwalan survei lapangan. Pastikan nomor aktif.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-[15px] font-bold text-navy-950">Periksa kembali data pengajuan</h2>
              <p className="mt-1 text-[13px] text-navy-500">
                Data yang dikirim tidak dapat diubah setelah masuk antrean verifikasi.
              </p>
              <dl className="mt-5 divide-y divide-navy-50 rounded-xl border border-navy-100">
                {[
                  ['Nama Titik', form.name],
                  ['Wilayah', `${form.district}, ${form.city}, ${provinceName(form.provinceCode)}`],
                  ['Alamat', form.address],
                  ['Koordinat', coords ? `${coords.lat}, ${coords.lng}` : '—'],
                  ['Kategori', CATEGORY_LABEL[form.category]],
                  ['Kapasitas', `${form.capacityKw} kW · ${form.connectors} konektor`],
                  ['Jam Operasional', form.operatingHours],
                  ['Penanggung Jawab', `${form.picName} · ${form.picPhone}`],
                  ['Catatan', form.notes || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[170px_1fr] sm:gap-4">
                    <dt className="text-[11.5px] font-bold uppercase tracking-wide text-navy-400">
                      {k}
                    </dt>
                    <dd className="text-[13.5px] text-navy-800">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between gap-3 border-t border-navy-100 pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost"
            >
              Kembali
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => validate(step + 1) && setStep((s) => s + 1)}
                className="btn-primary"
              >
                Lanjutkan
                <IconArrowRight width={16} height={16} />
              </button>
            ) : (
              <button type="button" onClick={submit} className="btn-primary">
                <IconCheck width={16} height={16} />
                Kirim Pengajuan
              </button>
            )}
          </div>
        </section>

        {/* Peta pemilih */}
        <section className="card sticky top-24 h-fit overflow-hidden">
          <div className="flex items-center justify-between border-b border-navy-100 px-5 py-3.5">
            <div>
              <h2 className="text-[14px] font-bold text-navy-950">Tentukan Koordinat</h2>
              <p className="text-[11.5px] text-navy-400">Klik peta untuk menempatkan penanda</p>
            </div>
            {coords && (
              <code className="rounded-lg bg-navy-50 px-2.5 py-1.5 text-[11px] font-bold text-navy-800">
                {coords.lat}, {coords.lng}
              </code>
            )}
          </div>
          <div className="h-[420px] w-full xl:h-[560px]">
            <PickerMap
              lat={coords?.lat ?? null}
              lng={coords?.lng ?? null}
              onChange={(la, ln) => {
                set('lat', String(la));
                set('lng', String(ln));
              }}
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
