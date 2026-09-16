'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Logo } from '@/components/ui/logo';
import {
  IconBell,
  IconCheck,
  IconCrosshair,
  IconFileText,
  IconLayout,
  IconLock,
  IconLogout,
  IconMapPin,
  IconMenu,
  IconShield,
  IconUsers,
  IconX,
} from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { provinceName } from '@/lib/data/provinces';
import { ROLE_LABEL } from '@/lib/data/users';
import { useDemoState } from '@/lib/hooks';
import { notificationsFor, resetDemo } from '@/lib/store';
import type { Role } from '@/lib/types';
import { cn, initials } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: (p: { width?: number; height?: number; className?: string }) => ReactNode;
  roles: Role[];
  badge?: 'notif' | 'verifikasi' | 'persetujuan';
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Ringkasan', icon: IconLayout, roles: ['PUSAT', 'PROVINSI', 'KOTA', 'ANGGOTA'] },
  { href: '/dashboard/peta', label: 'Peta Internal', icon: IconMapPin, roles: ['PUSAT', 'PROVINSI', 'KOTA', 'ANGGOTA'] },
  { href: '/dashboard/pengajuan', label: 'Pengajuan Titik', icon: IconCrosshair, roles: ['PUSAT', 'PROVINSI', 'KOTA', 'ANGGOTA'] },
  { href: '/dashboard/verifikasi', label: 'Verifikasi Wilayah', icon: IconFileText, roles: ['PROVINSI', 'PUSAT'], badge: 'verifikasi' },
  { href: '/dashboard/persetujuan', label: 'Persetujuan Pusat', icon: IconShield, roles: ['PUSAT'], badge: 'persetujuan' },
  { href: '/dashboard/anggota', label: 'Data Anggota', icon: IconUsers, roles: ['PUSAT', 'PROVINSI'] },
  { href: '/dashboard/notifikasi', label: 'Notifikasi', icon: IconBell, roles: ['PUSAT', 'PROVINSI', 'KOTA', 'ANGGOTA'], badge: 'notif' },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, ready, logout } = useAuth();
  const { state } = useDemoState();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const counts = useMemo(() => {
    if (!user) return { notif: 0, verifikasi: 0, persetujuan: 0 };
    const notif = notificationsFor(user).filter((n) => !n.read).length;
    const verifikasi = state.points.filter(
      (p) =>
        p.status === 'DIAJUKAN' &&
        (user.role === 'PUSAT' || p.provinceCode === user.provinceCode),
    ).length;
    const persetujuan = state.points.filter((p) => p.status === 'DIVERIFIKASI').length;
    return { notif, verifikasi, persetujuan };
  }, [state, user]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-navy-200 border-t-brand-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 px-5">
        <div className="card w-full max-w-md p-8 text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <IconLock width={26} height={26} />
          </span>
          <h1 className="mt-5 text-xl font-extrabold text-navy-950">Akses Terbatas</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-navy-600">
            Halaman ini hanya dapat diakses oleh pengurus dan tim lapangan GPN 08 yang telah masuk
            ke sistem.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/login" className="btn-primary w-full">
              Masuk ke Akun
            </Link>
            <Link href="/" className="btn-ghost w-full">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nav = NAV.filter((n) => n.roles.includes(user.role));
  const current = (pathname || '/').replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
  const isActive = (href: string) =>
    href === '/dashboard' ? current === '/dashboard' : current === href || current.startsWith(`${href}/`);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Link href="/">
          <Logo variant="light" />
        </Link>
      </div>

      <div className="mx-4 rounded-xl border border-white/10 bg-white/[0.06] p-3.5">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-[12px] font-extrabold text-white"
            style={{ background: user.avatarColor }}
          >
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold text-white">{user.name}</div>
            <div className="truncate text-[11px] text-white/50">{user.position}</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-brand-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-200">
            {user.level}
          </span>
          {user.provinceCode && (
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
              {user.city ?? provinceName(user.provinceCode)}
            </span>
          )}
        </div>
      </div>

      <nav className="scroll-slim mt-5 flex-1 space-y-1 overflow-y-auto px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const badge = item.badge ? counts[item.badge] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition',
                isActive(item.href)
                  ? 'bg-brand-600 text-white shadow-[0_8px_20px_-12px_rgba(224,23,41,0.9)]'
                  : 'text-white/65 hover:bg-white/[0.07] hover:text-white',
              )}
            >
              <Icon width={18} height={18} />
              <span className="flex-1">{item.label}</span>
              {badge > 0 && (
                <span
                  className={cn(
                    'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10.5px] font-extrabold',
                    isActive(item.href) ? 'bg-white text-brand-700' : 'bg-brand-500 text-white',
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link
          href="/dashboard/pengajuan/baru"
          className="btn-primary btn-sm w-full justify-center"
        >
          <IconCrosshair width={15} height={15} />
          Ajukan Titik Baru
        </Link>
        <button
          type="button"
          onClick={() => {
            if (confirm('Kembalikan seluruh data demo ke kondisi awal?')) resetDemo();
          }}
          className="w-full rounded-xl px-3.5 py-2 text-left text-[12px] font-semibold text-white/45 transition hover:bg-white/5 hover:text-white/75"
        >
          Atur ulang data demo
        </button>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <IconLogout width={17} height={17} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-50/60">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] bg-navy-950 lg:block">
        {sidebar}
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[272px] bg-navy-950 lg:hidden">
            {sidebar}
          </aside>
        </>
      )}

      <div className="lg:pl-[272px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/85 backdrop-blur-lg">
          <div className="flex h-16 items-center gap-3 px-5 sm:px-7">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-navy-200 text-navy-800 lg:hidden"
              aria-label="Buka menu"
            >
              {open ? <IconX /> : <IconMenu />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-navy-400">
                {ROLE_LABEL[user.role]}
              </div>
              <div className="truncate text-[14.5px] font-extrabold text-navy-950">
                {nav.find((n) => isActive(n.href))?.label ?? 'Dashboard'}
              </div>
            </div>

            <Link
              href="/cpss"
              className="hidden items-center gap-2 rounded-xl border border-navy-200 px-3.5 py-2 text-[12.5px] font-semibold text-navy-700 transition hover:bg-navy-50 sm:inline-flex"
            >
              <IconMapPin width={15} height={15} />
              Peta Publik
            </Link>

            <Link
              href="/dashboard/notifikasi"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-navy-200 text-navy-700 transition hover:bg-navy-50"
              aria-label="Notifikasi"
            >
              <IconBell width={18} height={18} />
              {counts.notif > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                  {counts.notif}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="px-5 py-7 sm:px-7 lg:py-9">{children}</main>
      </div>
    </div>
  );
}

export function EmptyState({
  icon = <IconCheck width={26} height={26} />,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-400">
        {icon}
      </span>
      <h3 className="mt-4 text-[15.5px] font-bold text-navy-950">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-navy-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
