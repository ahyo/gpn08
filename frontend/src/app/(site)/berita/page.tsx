import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/ui/section';
import { IconArrowRight, IconBuilding } from '@/components/ui/icons';
import { NEWS } from '@/lib/data/news';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Berita & Kegiatan',
  description:
    'Kabar terbaru program, kerja sama, dan agenda organisasi Gerakan Persatuan Nasional 08 di seluruh Indonesia.',
};

export default function BeritaPage() {
  const [lead, ...rest] = NEWS;

  return (
    <>
      <PageHero
        breadcrumb={[{ href: '/', label: 'Beranda' }, { label: 'Berita' }]}
        eyebrow="Ruang Informasi"
        title={
          <>
            Berita & Kegiatan <span className="text-gold-400">GPN 08</span>
          </>
        }
        description="Dokumentasi perkembangan program, kemitraan, dan agenda organisasi dari pusat hingga daerah."
      />

      <section className="container-page py-14 lg:py-20">
        {/* Berita utama */}
        <Reveal>
          <Link
            href={`/berita/${lead.id}`}
            className="group grid overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:shadow-lift lg:grid-cols-2"
          >
            <div className="relative min-h-[240px] overflow-hidden bg-gradient-to-br from-navy-900 to-navy-950">
              <div className="absolute inset-0 bg-grid-light bg-[size:32px_32px] opacity-20" />
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-600/30 blur-3xl" />
              <div className="absolute -bottom-10 left-8 h-40 w-40 rounded-full bg-gold-500/20 blur-3xl" />
              <IconBuilding
                width={64}
                height={64}
                className="absolute right-8 top-8 text-white/10"
              />
              <span className="absolute bottom-6 left-6">
                <Badge tone="brand" className="bg-brand-600 text-white ring-brand-600">
                  Berita Utama
                </Badge>
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div className="flex items-center gap-2 text-[12px] text-navy-400">
                <span className="font-semibold text-brand-600">{lead.category}</span>
                <span className="h-1 w-1 rounded-full bg-navy-200" />
                {formatDate(lead.date)}
                <span className="h-1 w-1 rounded-full bg-navy-200" />
                {lead.readMinutes} menit baca
              </div>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-navy-950 transition-colors group-hover:text-brand-600 lg:text-[1.75rem]">
                {lead.title}
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-navy-600">{lead.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-brand-600 transition-all group-hover:gap-3">
                Baca selengkapnya
                <IconArrowRight width={16} height={16} />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Daftar berita */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((n, i) => (
            <Reveal key={n.id} delay={i * 80}>
              <Link
                href={`/berita/${n.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950">
                  <div className="absolute inset-0 bg-grid-light bg-[size:26px_26px] opacity-20" />
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-600/25 blur-2xl" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {n.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-[11.5px] text-navy-400">
                    {formatDate(n.date)}
                    <span className="h-1 w-1 rounded-full bg-navy-200" />
                    {n.readMinutes} menit
                  </div>
                  <h3 className="mt-2.5 text-[15.5px] font-bold leading-snug text-navy-950 transition-colors group-hover:text-brand-600">
                    {n.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-navy-500">
                    {n.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-600 transition-all group-hover:gap-2.5">
                    Baca
                    <IconArrowRight width={14} height={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
