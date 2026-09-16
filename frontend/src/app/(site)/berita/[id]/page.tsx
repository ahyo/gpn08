import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/page-hero';
import { IconArrowRight, IconClock, IconUsers } from '@/components/ui/icons';
import { NEWS, newsById } from '@/lib/data/news';
import { formatDate } from '@/lib/utils';

export function generateStaticParams() {
  return NEWS.map((n) => ({ id: n.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = newsById(id);
  if (!item) return { title: 'Berita tidak ditemukan' };
  return { title: item.title, description: item.excerpt };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = newsById(id);
  if (!item) notFound();

  const related = NEWS.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <>
      <PageHero
        breadcrumb={[
          { href: '/', label: 'Beranda' },
          { href: '/berita', label: 'Berita' },
          { label: item.category },
        ]}
        eyebrow={item.category}
        title={item.title}
      >
        <div className="mt-7 flex flex-wrap items-center gap-5 text-[13px] text-white/55">
          <span className="flex items-center gap-2">
            <IconUsers width={15} height={15} className="text-gold-400" />
            {item.author}
          </span>
          <span className="flex items-center gap-2">
            <IconClock width={15} height={15} className="text-gold-400" />
            {formatDate(item.date)} · {item.readMinutes} menit baca
          </span>
        </div>
      </PageHero>

      <article className="container-page py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div className="prose-id max-w-2xl">
            <p className="mb-6 border-l-4 border-brand-500 pl-5 text-[16.5px] font-medium leading-relaxed text-navy-800">
              {item.excerpt}
            </p>
            {item.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <div className="mt-10 rounded-2xl border border-navy-100 bg-navy-50/60 p-6">
              <h3 className="text-[15px] font-bold text-navy-950">
                Ingin terlibat dalam program ini?
              </h3>
              <p className="mt-2 text-[13.5px] text-navy-600">
                Daftarkan diri sebagai anggota GPN 08 dan bergabung dengan tim lapangan di daerah
                Anda.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/pendaftaran" className="btn-primary btn-sm">
                  Daftar Anggota
                </Link>
                <Link href="/cpss" className="btn-outline btn-sm">
                  Lihat Dashboard CPSS
                </Link>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card p-6">
              <h3 className="text-[13px] font-bold uppercase tracking-wide text-navy-400">
                Berita lainnya
              </h3>
              <ul className="mt-4 space-y-4">
                {related.map((n) => (
                  <li key={n.id}>
                    <Link href={`/berita/${n.id}`} className="group block">
                      <span className="text-[11px] font-semibold text-brand-600">{n.category}</span>
                      <h4 className="mt-1 text-[13.5px] font-bold leading-snug text-navy-900 transition-colors group-hover:text-brand-600">
                        {n.title}
                      </h4>
                      <span className="mt-1 block text-[11.5px] text-navy-400">
                        {formatDate(n.date)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/berita"
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-600 hover:gap-2.5"
              >
                Semua berita
                <IconArrowRight width={14} height={14} />
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
