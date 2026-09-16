'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  IconArrowRight,
  IconLayout,
  IconMenu,
  IconX,
} from '@/components/ui/icons';

const NAV = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/struktur', label: 'Struktur Organisasi' },
  { href: '/cpss', label: 'Dashboard CPSS', highlight: true },
  { href: '/berita', label: 'Berita' },
  { href: '/kontak', label: 'Kontak' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, ready } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Normalisasi agar tetap benar untuk URL berakhiran "/" maupun "/index.html".
  const current = (pathname || '/').replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
  const isActive = (href: string) =>
    href === '/' ? current === '/' : current === href || current.startsWith(`${href}/`);

  return (
    <>
      <div className="hidden bg-navy-950 py-2 text-[12px] text-white/70 lg:block">
        <div className="container-page flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Sekretariat Nasional GPN 08 — Jakarta Pusat · Senin–Jumat 08.00–17.00 WIB
          </p>
          <div className="flex items-center gap-5">
            <a href="mailto:sekretariat@gpn08.id" className="link-underline hover:text-white">
              sekretariat@gpn08.id
            </a>
            <a href="tel:+622180808008" className="link-underline hover:text-white">
              (021) 8080-8008
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-navy-100 bg-white/90 shadow-[0_8px_30px_-24px_rgba(7,26,54,0.6)] backdrop-blur-lg'
            : 'border-b border-transparent bg-white',
        )}
      >
        <div className="container-page flex h-[70px] items-center justify-between gap-4">
          <Link href="/" aria-label="Beranda GPN 08">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-[14px] font-semibold transition-colors',
                  isActive(item.href)
                    ? 'text-brand-600'
                    : 'text-navy-700 hover:bg-navy-50 hover:text-navy-950',
                )}
              >
                {item.label}
                {item.highlight && !isActive(item.href) && (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
                )}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {ready && user ? (
              <Link href="/dashboard" className="btn-navy btn-sm">
                <IconLayout width={16} height={16} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost btn-sm">
                  Masuk
                </Link>
                <Link href="/pendaftaran" className="btn-primary btn-sm">
                  Daftar Anggota
                  <IconArrowRight width={15} height={15} />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-navy-200 text-navy-800 lg:hidden"
          >
            {open ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 top-[70px] z-40 overflow-y-auto bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold',
                  isActive(item.href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-navy-800 hover:bg-navy-50',
                )}
              >
                {item.label}
                <IconArrowRight width={16} height={16} className="opacity-40" />
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-navy-100 pt-5">
              {ready && user ? (
                <Link href="/dashboard" className="btn-navy w-full">
                  Buka Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-outline w-full">
                    Masuk
                  </Link>
                  <Link href="/pendaftaran" className="btn-primary w-full">
                    Daftar Anggota
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
