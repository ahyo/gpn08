import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { IconArrowRight, IconMapPin } from '@/components/ui/icons';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy-950 px-5 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-[0.10]" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-brand-600/25 blur-[110px]" />

      <div className="relative">
        <Logo variant="light" />
        <p className="mt-10 font-display text-[6rem] font-extrabold leading-none text-white/10 sm:text-[8rem]">
          404
        </p>
        <h1 className="-mt-6 text-2xl font-extrabold sm:text-3xl">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
          Alamat yang Anda tuju tidak tersedia atau telah dipindahkan. Silakan kembali ke beranda
          atau buka Dashboard CPSS.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Kembali ke Beranda
            <IconArrowRight width={16} height={16} />
          </Link>
          <Link href="/cpss" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
            <IconMapPin width={16} height={16} />
            Dashboard CPSS
          </Link>
        </div>
      </div>
    </div>
  );
}
