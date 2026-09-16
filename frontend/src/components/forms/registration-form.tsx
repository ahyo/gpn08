'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Field, SelectInput, Stepper, TextArea, TextInput } from '@/components/forms/field';
import {
  IconArrowRight,
  IconCheck,
  IconDownload,
  IconShield,
  IconUsers,
} from '@/components/ui/icons';
import { PROVINCES, provinceByCode } from '@/lib/data/provinces';
import { registerMember } from '@/lib/store';
import type { Member } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const STEPS = ['Data Pribadi', 'Alamat & Wilayah', 'Minat Organisasi', 'Konfirmasi'];

const INTERESTS = [
  'Tim Lapangan CPSS',
  'Kaderisasi & Pendidikan',
  'Humas & Media',
  'UMKM & Ekonomi Kerakyatan',
  'Teknologi Informasi',
  'Hukum & Advokasi',
  'Sosial Kemasyarakatan',
];

const EDUCATIONS = ['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3'];

type FormState = {
  fullName: string;
  nik: string;
  email: string;
  phone: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  provinceCode: string;
  city: string;
  profession: string;
  education: string;
  interest: string;
  motivation: string;
  agree: boolean;
};

const EMPTY: FormState = {
  fullName: '',
  nik: '',
  email: '',
  phone: '',
  birthPlace: '',
  birthDate: '',
  gender: 'Laki-laki',
  address: '',
  provinceCode: '',
  city: '',
  profession: '',
  education: '',
  interest: '',
  motivation: '',
  agree: false,
};

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Member | null>(null);

  const cities = useMemo(
    () => (form.provinceCode ? (provinceByCode(form.provinceCode)?.cities ?? []) : []),
    [form.provinceCode],
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
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
      if (form.fullName.trim().length < 3) e.fullName = 'Nama lengkap minimal 3 karakter.';
      if (!/^\d{16}$/.test(form.nik)) e.nik = 'NIK harus terdiri dari 16 digit angka.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Format email tidak valid.';
      if (!/^0\d{8,13}$/.test(form.phone.replace(/[-\s]/g, '')))
        e.phone = 'Nomor telepon diawali 0 dan terdiri dari 9–14 digit.';
      if (!form.birthPlace.trim()) e.birthPlace = 'Tempat lahir wajib diisi.';
      if (!form.birthDate) e.birthDate = 'Tanggal lahir wajib diisi.';
    }
    if (target > 1) {
      if (form.address.trim().length < 8) e.address = 'Alamat terlalu pendek.';
      if (!form.provinceCode) e.provinceCode = 'Pilih provinsi domisili.';
      if (!form.city) e.city = 'Pilih kota/kabupaten.';
    }
    if (target > 2) {
      if (!form.profession.trim()) e.profession = 'Pekerjaan wajib diisi.';
      if (!form.education) e.education = 'Pilih pendidikan terakhir.';
      if (!form.interest) e.interest = 'Pilih bidang yang diminati.';
      if (form.motivation.trim().length < 20)
        e.motivation = 'Ceritakan motivasi Anda minimal 20 karakter.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step + 1)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const submit = () => {
    if (!validate(3)) return;
    if (!form.agree) {
      setErrors({ agree: 'Anda harus menyetujui pernyataan keanggotaan.' });
      return;
    }
    const { agree: _agree, ...payload } = form;
    setResult(registerMember(payload));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 px-8 py-10 text-center text-white">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <IconCheck width={30} height={30} />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">Pendaftaran Berhasil Dikirim</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-white/80">
              Terima kasih, {result.fullName.split(' ')[0]}. Berkas Anda diteruskan ke DPW{' '}
              {provinceByCode(result.provinceCode)?.name} untuk diverifikasi.
            </p>
          </div>

          <div className="p-8">
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { t: 'Nomor Registrasi', d: result.id.toUpperCase() },
                { t: 'Tanggal Daftar', d: formatDate(result.registeredAt, true) },
                { t: 'Nama Lengkap', d: result.fullName },
                { t: 'Domisili', d: `${result.city}, ${provinceByCode(result.provinceCode)?.name}` },
                { t: 'Bidang Diminati', d: result.interest },
                { t: 'Status', d: 'Menunggu verifikasi DPW' },
              ].map((r) => (
                <div key={r.t} className="rounded-xl bg-navy-50/70 px-4 py-3">
                  <dt className="text-[10.5px] font-bold uppercase tracking-wide text-navy-400">
                    {r.t}
                  </dt>
                  <dd className="mt-1 text-[14px] font-semibold text-navy-900">{r.d}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="flex items-center gap-2 text-[13px] font-bold text-amber-900">
                <IconShield width={16} height={16} />
                Langkah berikutnya
              </h3>
              <ol className="mt-2.5 space-y-1.5 text-[13px] text-amber-900/85">
                <li>1. DPW provinsi memverifikasi data dalam 3 hari kerja.</li>
                <li>2. Anda menerima nomor anggota resmi melalui email terdaftar.</li>
                <li>3. Akun platform diaktifkan untuk mengakses fitur tim lapangan.</li>
              </ol>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-outline"
              >
                <IconDownload width={16} height={16} />
                Cetak Bukti Pendaftaran
              </button>
              <Link href="/cpss" className="btn-primary">
                Lihat Dashboard CPSS
                <IconArrowRight width={16} height={16} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setForm(EMPTY);
                  setStep(0);
                }}
                className="btn-ghost"
              >
                Daftarkan orang lain
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="card p-6 sm:p-8">
        <Stepper steps={STEPS} current={step} />

        <div className="mt-8 border-t border-navy-100 pt-8">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nama Lengkap" required error={errors.fullName} className="sm:col-span-2">
                <TextInput
                  value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                  placeholder="Sesuai Kartu Tanda Penduduk"
                  error={!!errors.fullName}
                  autoComplete="name"
                />
              </Field>
              <Field label="NIK" required error={errors.nik} hint="16 digit tanpa spasi">
                <TextInput
                  value={form.nik}
                  onChange={(e) => set('nik', e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="3273010101900001"
                  inputMode="numeric"
                  error={!!errors.nik}
                />
              </Field>
              <Field label="Jenis Kelamin" required>
                <SelectInput
                  value={form.gender}
                  onChange={(e) => set('gender', e.target.value as FormState['gender'])}
                >
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </SelectInput>
              </Field>
              <Field label="Tempat Lahir" required error={errors.birthPlace}>
                <TextInput
                  value={form.birthPlace}
                  onChange={(e) => set('birthPlace', e.target.value)}
                  placeholder="Bandung"
                  error={!!errors.birthPlace}
                />
              </Field>
              <Field label="Tanggal Lahir" required error={errors.birthDate}>
                <TextInput
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => set('birthDate', e.target.value)}
                  error={!!errors.birthDate}
                />
              </Field>
              <Field label="Email Aktif" required error={errors.email}>
                <TextInput
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="nama@email.com"
                  error={!!errors.email}
                  autoComplete="email"
                />
              </Field>
              <Field label="Nomor Telepon / WhatsApp" required error={errors.phone}>
                <TextInput
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="08123456789"
                  inputMode="tel"
                  error={!!errors.phone}
                  autoComplete="tel"
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Alamat Domisili" required error={errors.address} className="sm:col-span-2">
                <TextArea
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                  error={!!errors.address}
                />
              </Field>
              <Field label="Provinsi" required error={errors.provinceCode}>
                <SelectInput
                  value={form.provinceCode}
                  onChange={(e) => {
                    set('provinceCode', e.target.value);
                    set('city', '');
                  }}
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
              <Field
                label="Kota / Kabupaten"
                required
                error={errors.city}
                hint={!form.provinceCode ? 'Pilih provinsi terlebih dahulu' : undefined}
              >
                <SelectInput
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  disabled={!form.provinceCode}
                  error={!!errors.city}
                >
                  <option value="">— Pilih kota/kabupaten —</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              {form.provinceCode && (
                <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-[13px] text-sky-900 sm:col-span-2">
                  Berkas pendaftaran Anda akan diverifikasi oleh{' '}
                  <strong>DPW GPN 08 {provinceByCode(form.provinceCode)?.name}</strong>
                  {form.city && (
                    <>
                      {' '}
                      dan diteruskan ke <strong>DPD {form.city}</strong>
                    </>
                  )}
                  .
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Pekerjaan" required error={errors.profession}>
                <TextInput
                  value={form.profession}
                  onChange={(e) => set('profession', e.target.value)}
                  placeholder="Wiraswasta, karyawan, mahasiswa, …"
                  error={!!errors.profession}
                />
              </Field>
              <Field label="Pendidikan Terakhir" required error={errors.education}>
                <SelectInput
                  value={form.education}
                  onChange={(e) => set('education', e.target.value)}
                  error={!!errors.education}
                >
                  <option value="">— Pilih —</option>
                  {EDUCATIONS.map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field
                label="Bidang yang Diminati"
                required
                error={errors.interest}
                className="sm:col-span-2"
              >
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => set('interest', i)}
                      className={`rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition ${
                        form.interest === i
                          ? 'border-brand-300 bg-brand-50 text-brand-700'
                          : 'border-navy-100 bg-white text-navy-600 hover:border-navy-200'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </Field>

              <Field
                label="Motivasi Bergabung"
                required
                error={errors.motivation}
                hint={`${form.motivation.length} karakter — minimal 20`}
                className="sm:col-span-2"
              >
                <TextArea
                  value={form.motivation}
                  onChange={(e) => set('motivation', e.target.value)}
                  placeholder="Ceritakan alasan Anda ingin bergabung dengan GPN 08 dan kontribusi yang ingin diberikan."
                  error={!!errors.motivation}
                />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-[15px] font-bold text-navy-950">Periksa kembali data Anda</h3>
              <p className="mt-1 text-[13px] text-navy-500">
                Pastikan seluruh data benar sebelum dikirim ke DPW untuk verifikasi.
              </p>

              <dl className="mt-5 divide-y divide-navy-50 rounded-xl border border-navy-100">
                {[
                  ['Nama Lengkap', form.fullName],
                  ['NIK', form.nik],
                  ['Jenis Kelamin', form.gender],
                  ['Tempat, Tanggal Lahir', `${form.birthPlace}, ${formatDate(form.birthDate)}`],
                  ['Email', form.email],
                  ['Telepon', form.phone],
                  ['Alamat', form.address],
                  ['Wilayah', `${form.city}, ${provinceByCode(form.provinceCode)?.name ?? '—'}`],
                  ['Pekerjaan', form.profession],
                  ['Pendidikan', form.education],
                  ['Bidang Diminati', form.interest],
                  ['Motivasi', form.motivation],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
                    <dt className="text-[12px] font-bold uppercase tracking-wide text-navy-400">
                      {k}
                    </dt>
                    <dd className="text-[13.5px] text-navy-800">{v || '—'}</dd>
                  </div>
                ))}
              </dl>

              <label className="mt-6 flex cursor-pointer gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-4">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => set('agree', e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                />
                <span className="text-[13px] leading-relaxed text-navy-700">
                  Saya menyatakan data yang saya isi adalah benar, bersedia mematuhi Anggaran
                  Dasar/Anggaran Rumah Tangga GPN 08, serta bersedia data saya diverifikasi oleh
                  pengurus wilayah dan daerah.
                </span>
              </label>
              {errors.agree && (
                <p className="mt-2 text-xs font-medium text-brand-600">{errors.agree}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-navy-100 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost"
          >
            Kembali
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">
              Lanjutkan
              <IconArrowRight width={16} height={16} />
            </button>
          ) : (
            <button type="button" onClick={submit} className="btn-primary">
              <IconCheck width={16} height={16} />
              Kirim Pendaftaran
            </button>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card p-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IconUsers width={19} height={19} />
          </span>
          <h3 className="mt-4 text-[15px] font-bold text-navy-950">Syarat Keanggotaan</h3>
          <ul className="mt-3 space-y-2.5 text-[13px] text-navy-600">
            {[
              'Warga Negara Indonesia berusia minimal 17 tahun.',
              'Memiliki Kartu Tanda Penduduk yang masih berlaku.',
              'Menerima Pancasila dan UUD 1945 sebagai asas organisasi.',
              'Tidak sedang menjalani hukuman pidana.',
            ].map((s) => (
              <li key={s} className="flex gap-2.5">
                <IconCheck
                  width={16}
                  height={16}
                  className="mt-0.5 shrink-0 rounded-full bg-emerald-50 p-0.5 text-emerald-600"
                />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="card bg-navy-950 p-6 text-white">
          <h3 className="text-[15px] font-bold">Gratis, tanpa biaya</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-white/65">
            GPN 08 tidak memungut biaya apa pun dalam proses pendaftaran anggota. Waspadai pihak
            yang mengatasnamakan organisasi untuk meminta pembayaran.
          </p>
          <Link
            href="/kontak"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-gold-400 hover:gap-2.5"
          >
            Laporkan penyalahgunaan
            <IconArrowRight width={14} height={14} />
          </Link>
        </div>

        <div className="card p-6">
          <h3 className="text-[15px] font-bold text-navy-950">Sudah jadi anggota?</h3>
          <p className="mt-2 text-[13px] text-navy-600">
            Masuk untuk mengakses dashboard internal dan mengajukan titik CPSS.
          </p>
          <Link href="/login" className="btn-outline btn-sm mt-4 w-full">
            Masuk ke Akun
          </Link>
        </div>
      </aside>
    </div>
  );
}
