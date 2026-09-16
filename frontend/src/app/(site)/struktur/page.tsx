import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Badge } from '@/components/ui/badge';
import { Reveal, SectionHeading } from '@/components/ui/section';
import {
  IconArrowRight,
  IconCheck,
  IconGlobe,
  IconMapPin,
  IconShield,
  IconX,
} from '@/components/ui/icons';
import { ORG_CHART, ORG_LEVELS } from '@/lib/data/org';

export const metadata: Metadata = {
  title: 'Struktur Organisasi',
  description:
    'Bagan struktur organisasi GPN 08 dari Musyawarah Nasional, Dewan Pimpinan Pusat, Dewan Pimpinan Wilayah, hingga Dewan Pimpinan Daerah, beserta matriks kewenangan.',
};

const MATRIX = [
  { task: 'Mengusulkan titik CPSS baru', dpd: true, dpw: false, dpp: false },
  { task: 'Melengkapi data teknis & koordinat', dpd: true, dpw: true, dpp: false },
  { task: 'Verifikasi kelayakan lapangan', dpd: false, dpw: true, dpp: false },
  { task: 'Persetujuan akhir & penayangan', dpd: false, dpw: false, dpp: true },
  { task: 'Menolak / mengembalikan pengajuan', dpd: false, dpw: true, dpp: true },
  { task: 'Verifikasi keanggotaan wilayah', dpd: true, dpw: true, dpp: true },
  { task: 'Menetapkan standar teknis nasional', dpd: false, dpw: false, dpp: true },
  { task: 'Membentuk kepengurusan di bawahnya', dpd: false, dpw: true, dpp: true },
];

function ChartNode({
  title,
  subtitle,
  initials,
  variant = 'default',
  className = '',
}: {
  title: string;
  subtitle: string;
  initials?: string;
  variant?: 'default' | 'primary' | 'navy' | 'muted';
  className?: string;
}) {
  const styles = {
    default: 'border-navy-100 bg-white text-navy-950',
    primary: 'border-brand-200 bg-gradient-to-br from-brand-600 to-brand-800 text-white',
    navy: 'border-navy-800 bg-gradient-to-br from-navy-800 to-navy-950 text-white',
    muted: 'border-navy-100 bg-navy-50 text-navy-800',
  }[variant];
  const sub = variant === 'primary' || variant === 'navy' ? 'text-white/65' : 'text-navy-500';

  return (
    <div
      className={`rounded-xl border px-4 py-3.5 text-center shadow-card transition-transform duration-300 hover:-translate-y-0.5 ${styles} ${className}`}
    >
      {initials && (
        <span
          className={`mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg font-display text-[11px] font-extrabold ${
            variant === 'primary' || variant === 'navy'
              ? 'bg-white/15 text-white'
              : 'bg-navy-900 text-white'
          }`}
        >
          {initials}
        </span>
      )}
      <div className="text-[13.5px] font-bold leading-tight">{title}</div>
      <div className={`mt-1 text-[11.5px] leading-tight ${sub}`}>{subtitle}</div>
    </div>
  );
}

const VLine = ({ className = '' }: { className?: string }) => (
  <div className={`mx-auto w-px bg-navy-200 ${className}`} />
);

export default function StrukturPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: '/', label: 'Beranda' }, { label: 'Struktur Organisasi' }]}
        eyebrow="Tata Kelola"
        title={
          <>
            Struktur Organisasi <span className="text-gold-400">GPN 08</span>
          </>
        }
        description="Organisasi disusun berjenjang dengan pembagian kewenangan yang tegas, sehingga setiap keputusan — terutama persetujuan titik CPSS — memiliki jalur pertanggungjawaban yang jelas."
      />

      {/* Bagan DPP */}
      <section className="container-page py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Bagan Kepengurusan"
            title="Dewan Pimpinan Pusat (DPP)"
            description="Struktur kepengurusan tingkat nasional periode 2026–2031."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-14 overflow-x-auto pb-4">
            <div className="mx-auto min-w-[720px] max-w-4xl">
              {/* Munas */}
              <div className="mx-auto max-w-xs">
                <ChartNode
                  variant="navy"
                  initials={ORG_CHART.top.initials}
                  title={ORG_CHART.top.name}
                  subtitle={ORG_CHART.top.position}
                />
              </div>
              <VLine className="h-8" />

              {/* Dewan-dewan */}
              <div className="relative">
                <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4">
                  {ORG_CHART.advisory.map((a) => (
                    <ChartNode
                      key={a.name}
                      variant="muted"
                      initials={a.initials}
                      title={a.name}
                      subtitle={a.position}
                    />
                  ))}
                </div>
              </div>
              <VLine className="h-8" />

              {/* Ketua Umum */}
              <div className="mx-auto max-w-sm">
                <ChartNode
                  variant="primary"
                  initials={ORG_CHART.chair.initials}
                  title={ORG_CHART.chair.name}
                  subtitle={ORG_CHART.chair.position}
                />
              </div>
              <VLine className="h-8" />

              {/* Sekjen & Bendahara */}
              <div className="relative mx-auto max-w-2xl">
                <div className="absolute left-1/4 right-1/4 top-0 h-px bg-navy-200" />
                <div className="grid grid-cols-2 gap-8 pt-0">
                  {ORG_CHART.secondLine.map((p) => (
                    <div key={p.name}>
                      <VLine className="h-8" />
                      <ChartNode initials={p.initials} title={p.name} subtitle={p.position} />
                    </div>
                  ))}
                </div>
              </div>
              <VLine className="h-8" />

              {/* Bidang */}
              <div className="rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 p-5">
                <div className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-navy-400">
                  Bidang-Bidang DPP
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {ORG_CHART.bureaus.map((b) => (
                    <div
                      key={b}
                      className="rounded-xl border border-navy-100 bg-white px-3.5 py-3 text-center text-[12.5px] font-semibold text-navy-800 shadow-sm transition hover:border-brand-200 hover:text-brand-700"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-3 text-center text-[12px] text-navy-400 lg:hidden">
          Geser ke samping untuk melihat bagan secara utuh
        </p>
      </section>

      {/* Hierarki tiga tingkat */}
      <section className="border-y border-navy-100 bg-navy-50/50 py-20 lg:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Jenjang Kepengurusan"
              title="Pusat, Wilayah, dan Daerah"
              description="Ketiganya terhubung dalam satu rantai komando organisasi sekaligus satu alur kerja digital."
            />
          </Reveal>

          <div className="mt-14 space-y-4">
            {ORG_LEVELS.map((lvl, i) => {
              const Icon = [IconShield, IconGlobe, IconMapPin][i];
              const tone = ['brand', 'sky', 'emerald'] as const;
              return (
                <Reveal key={lvl.key} delay={i * 110}>
                  <article className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
                    <div
                      className={`absolute left-0 top-0 h-full w-1.5 ${
                        ['bg-brand-600', 'bg-sky-600', 'bg-emerald-600'][i]
                      }`}
                    />
                    <div className="grid gap-6 p-7 pl-9 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                            <Icon width={20} height={20} />
                          </span>
                          <div>
                            <Badge tone={tone[i]}>{lvl.code}</Badge>
                            <h3 className="mt-1 text-lg font-extrabold text-navy-950">
                              {lvl.title}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-4 text-[13.5px] leading-relaxed text-navy-600">
                          {lvl.subtitle} · {lvl.scope}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {lvl.departments.slice(0, 4).map((d) => (
                          <div key={d.name} className="rounded-xl bg-navy-50/70 px-4 py-3">
                            <div className="text-[12.5px] font-bold text-navy-900">{d.name}</div>
                            <div className="mt-0.5 text-[11.5px] text-navy-500">{d.lead}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Matriks kewenangan */}
      <section className="container-page py-20 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Pembagian Kewenangan"
            title="Siapa melakukan apa dalam alur CPSS"
            description="Matriks berikut menjadi acuan hak akses pada sistem informasi GPN 08. Setiap akun hanya dapat melakukan tindakan sesuai jenjangnya."
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-navy-100 bg-navy-50/70">
                    <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wide text-navy-500">
                      Tindakan
                    </th>
                    {[
                      { c: 'DPD', d: 'Kota/Kabupaten' },
                      { c: 'DPW', d: 'Provinsi' },
                      { c: 'DPP', d: 'Pusat' },
                    ].map((h) => (
                      <th key={h.c} className="px-6 py-4 text-center">
                        <div className="font-display text-[13px] font-extrabold text-navy-950">
                          {h.c}
                        </div>
                        <div className="mt-0.5 text-[10.5px] font-medium text-navy-400">{h.d}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {MATRIX.map((row) => (
                    <tr key={row.task} className="transition hover:bg-navy-50/40">
                      <td className="px-6 py-3.5 text-[13.5px] font-medium text-navy-800">
                        {row.task}
                      </td>
                      {[row.dpd, row.dpw, row.dpp].map((v, i) => (
                        <td key={i} className="px-6 py-3.5 text-center">
                          {v ? (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                              <IconCheck width={16} height={16} />
                            </span>
                          ) : (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-navy-50 text-navy-300">
                              <IconX width={14} height={14} />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-8 flex flex-col items-center gap-5 rounded-2xl bg-navy-950 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Lihat matriks ini bekerja secara nyata
              </h3>
              <p className="mt-1.5 text-[13.5px] text-white/60">
                Masuk dengan akun demo DPD, DPW, atau DPP untuk mencoba alur persetujuan berjenjang.
              </p>
            </div>
            <Link href="/login" className="btn-primary shrink-0">
              Masuk Akun Demo
              <IconArrowRight width={16} height={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
