'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Field, TextInput } from '@/components/forms/field';
import { Logo } from '@/components/ui/logo';
import {
  IconArrowRight,
  IconInfo,
  IconLock,
  IconShield,
  IconWarning,
} from '@/components/ui/icons';
import { DEMO_USERS, ROLE_LABEL } from '@/lib/data/users';
import { provinceName } from '@/lib/data/provinces';
import { useAuth } from '@/lib/auth';

const QUICK = DEMO_USERS.filter((u) =>
  ['pusat@gpn08.id', 'provinsi@gpn08.id', 'kota@gpn08.id', 'anggota@gpn08.id'].includes(u.email),
);

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    if (!res.ok) {
      setError(res.error ?? 'Gagal masuk.');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  };

  const fill = (mail: string) => {
    setEmail(mail);
    setPassword('demo1234');
    setError('');
  };

  return (
    <section className="grid min-h-[calc(100vh-70px)] lg:grid-cols-[1.05fr_1fr]">
      {/* Panel kiri */}
      <div className="relative hidden overflow-hidden bg-navy-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-[0.10]" />
        <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-600/25 blur-[110px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky-500/15 blur-[110px]" />

        <div className="relative">
          <Logo variant="light" />
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-gold-400 backdrop-blur">
            <IconShield width={24} height={24} />
          </span>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight">
            Dashboard internal
            <span className="block text-gold-400">GPN 08</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65">
            Satu pintu untuk pengajuan titik CPSS, verifikasi wilayah, persetujuan pusat, dan
            pengelolaan keanggotaan — dengan hak akses sesuai jenjang kepengurusan.
          </p>

          <ul className="mt-8 space-y-3.5">
            {[
              { t: 'DPD Kota/Kabupaten', d: 'Mengajukan titik CPSS baru dari lapangan.' },
              { t: 'DPW Provinsi', d: 'Memverifikasi kelayakan pengajuan wilayah.' },
              { t: 'DPP Pusat', d: 'Memberi persetujuan akhir dan menayangkan titik.' },
            ].map((r, i) => (
              <li key={r.t} className="flex gap-3.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[11px] font-extrabold text-gold-400">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[13.5px] font-bold text-white">{r.t}</span>
                  <span className="text-[12.5px] text-white/55">{r.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12px] text-white/35">
          © {new Date().getFullYear()} Gerakan Persatuan Nasional 08 · Lingkungan demo
        </p>
      </div>

      {/* Panel kanan */}
      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>

          <h1 className="mt-8 text-2xl font-extrabold text-navy-950 lg:mt-0">Masuk ke akun Anda</h1>
          <p className="mt-2 text-[14px] text-navy-500">
            Gunakan email dan kata sandi yang terdaftar pada sistem GPN 08.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field label="Email" required>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gpn08.id"
                autoComplete="username"
                required
              />
            </Field>
            <Field label="Kata Sandi" required>
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </Field>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-brand-200 bg-brand-50 p-3.5 text-[13px] text-brand-800">
                <IconWarning width={17} height={17} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <IconLock width={16} height={16} />
              )}
              {loading ? 'Memproses…' : 'Masuk'}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-navy-100 bg-navy-50/60 p-5">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-navy-500">
              <IconInfo width={15} height={15} />
              Akun demo — klik untuk mengisi otomatis
            </div>
            <div className="mt-3.5 grid gap-2">
              {QUICK.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => fill(u.email)}
                  className="group flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3 text-left transition hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-[11px] font-extrabold text-white"
                    style={{ background: u.avatarColor }}
                  >
                    {u.role.slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-navy-950">
                      {ROLE_LABEL[u.role]}
                      {u.provinceCode ? ` · ${provinceName(u.provinceCode)}` : ''}
                    </span>
                    <span className="block truncate text-[11.5px] text-navy-400">{u.email}</span>
                  </span>
                  <IconArrowRight
                    width={15}
                    height={15}
                    className="shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                  />
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] text-navy-400">
              Kata sandi untuk seluruh akun demo: <code className="font-bold text-navy-600">demo1234</code>
            </p>
          </div>

          <p className="mt-6 text-center text-[13.5px] text-navy-500">
            Belum memiliki akun?{' '}
            <Link href="/pendaftaran" className="font-bold text-brand-600 hover:underline">
              Daftar sebagai anggota
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
