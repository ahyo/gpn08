import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { Badge } from '@/components/ui/badge';
import { Reveal, SectionHeading } from '@/components/ui/section';
import {
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconGlobe,
  IconMapPin,
  IconShield,
  IconTarget,
  IconUsers,
} from '@/components/ui/icons';
import { ORG_LEVELS } from '@/lib/data/org';
import { ISLANDS, PROVINCES } from '@/lib/data/provinces';

export const metadata: Metadata = {
  title: 'Profil Organisasi',
  description:
    'Profil lengkap Gerakan Persatuan Nasional 08: sejarah, visi misi, serta kepengurusan tingkat pusat (DPP), provinsi (DPW), dan kota/kabupaten (DPD).',
};

const MILESTONES = [
  { year: '2021', title: 'Deklarasi Nasional', text: 'GPN 08 dideklarasikan pada 8 Agustus 2021 oleh 80 tokoh masyarakat dari 20 provinsi.' },
  { year: '2022', title: 'Pembentukan DPW', text: 'Seluruh Dewan Pimpinan Wilayah tingkat provinsi terbentuk dan dilantik secara bertahap.' },
  { year: '2023', title: 'Peluncuran CPSS', text: 'Program Charging Point Service System diluncurkan sebagai program unggulan organisasi.' },
  { year: '2024', title: 'Digitalisasi Organisasi', text: 'Platform terpadu keanggotaan dan persetujuan berjenjang mulai dioperasikan nasional.' },
  { year: '2026', title: 'Ekspansi 1.000 Titik', text: 'Target seribu titik CPSS aktif dengan cakupan seluruh 38 provinsi Indonesia.' },
];

const LEVEL_ICON = { pusat: IconShield, provinsi: IconGlobe, kota: IconMapPin } as const;

export default function ProfilPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: '/', label: 'Beranda' }, { label: 'Profil' }]}
        eyebrow="Tentang Organisasi"
        title={
          <>
            Profil Gerakan Persatuan
            <br />
            Nasional <span className="text-gold-400">08</span>
          </>
        }
        description="Organisasi kemasyarakatan berbadan hukum yang bergerak di bidang persatuan kebangsaan, kemandirian energi, dan pemberdayaan ekonomi rakyat, dengan kepengurusan berjenjang di 38 provinsi dan 312 kota/kabupaten."
      >
        <div className="mt-10 flex flex-wrap gap-2.5">
          {ORG_LEVELS.map((l) => (
            <a
              key={l.key}
              href={`#${l.key}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-[13px] font-semibold text-white/85 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
            >
              <span className="font-display text-[11px] font-extrabold text-gold-400">{l.code}</span>
              {l.title}
            </a>
          ))}
        </div>
      </PageHero>

      {/* Identitas & Visi Misi */}
      <section className="container-page py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Identitas"
              title="Delapan bukan sekadar angka"
              description="Angka 08 merujuk pada bulan kelahiran bangsa dan semangat kemerdekaan yang tak pernah selesai. GPN 08 menempatkan persatuan sebagai fondasi, dan kerja teknis yang terukur sebagai wujudnya."
            />

            <dl className="mt-8 space-y-5">
              {[
                { t: 'Nama Resmi', d: 'Gerakan Persatuan Nasional 08 (GPN 08)' },
                { t: 'Bentuk', d: 'Organisasi Kemasyarakatan berbadan hukum perkumpulan' },
                { t: 'Tanggal Berdiri', d: '8 Agustus 2021, Jakarta' },
                { t: 'Asas', d: 'Pancasila dan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945' },
                { t: 'Sifat', d: 'Mandiri, terbuka, nirlaba, dan tidak berafiliasi pada partai politik' },
                { t: 'Sekretariat', d: 'Gedung Nusantara Lt. 8, Jl. Merdeka Selatan No. 8, Jakarta Pusat' },
              ].map((r) => (
                <div key={r.t} className="border-l-2 border-brand-200 pl-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600">
                    {r.t}
                  </dt>
                  <dd className="mt-1 text-[14.5px] font-medium text-navy-800">{r.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="space-y-5">
            <Reveal>
              <article className="rounded-2xl border border-navy-100 bg-gradient-to-br from-brand-50/60 to-white p-8 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <IconTarget width={21} height={21} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-navy-950">Visi</h3>
                <p className="mt-3 text-[15px] font-medium italic leading-relaxed text-navy-700">
                  &ldquo;Terwujudnya masyarakat Indonesia yang bersatu, mandiri secara energi, dan
                  berdaya secara ekonomi, melalui gerakan kemasyarakatan yang terorganisir,
                  transparan, dan berbasis data.&rdquo;
                </p>
              </article>
            </Reveal>

            <Reveal delay={100}>
              <article className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <IconCheck width={21} height={21} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-navy-950">Misi</h3>
                <ol className="mt-4 space-y-3.5">
                  {[
                    'Memperkuat persatuan dan kerukunan masyarakat melalui program kemasyarakatan lintas daerah.',
                    'Membangun dan mengelola jaringan Charging Point Service System sebagai infrastruktur energi bersih milik bersama.',
                    'Memberdayakan usaha mikro dan kecil di sekitar titik layanan sebagai penggerak ekonomi kerakyatan.',
                    'Melaksanakan kaderisasi berjenjang yang menghasilkan pengurus dan tim lapangan berintegritas.',
                    'Menyelenggarakan tata kelola organisasi yang transparan dan akuntabel berbasis sistem informasi terpadu.',
                  ].map((m, i) => (
                    <li key={i} className="flex gap-3.5">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-[11px] font-extrabold text-navy-700">
                        {i + 1}
                      </span>
                      <span className="text-[14px] leading-relaxed text-navy-700">{m}</span>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Perjalanan organisasi */}
      <section className="border-y border-navy-100 bg-navy-50/50 py-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Perjalanan"
              title="Lima tahun bergerak, berlanjut ke tahap berikutnya"
            />
          </Reveal>
          <ol className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={i * 90}>
                <li className="relative h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <span className="font-display text-3xl font-extrabold text-brand-600/25">
                    {m.year}
                  </span>
                  <h3 className="mt-2 text-[15px] font-bold text-navy-950">{m.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-navy-600">{m.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Tingkatan organisasi */}
      {ORG_LEVELS.map((level, idx) => {
        const Icon = LEVEL_ICON[level.key];
        return (
          <section
            key={level.key}
            id={level.key}
            className={`scroll-mt-24 py-20 lg:py-24 ${idx % 2 === 1 ? 'border-y border-navy-100 bg-navy-50/50' : ''}`}
          >
            <div className="container-page">
              <Reveal>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white">
                        <Icon width={22} height={22} />
                      </span>
                      <div>
                        <Badge tone={idx === 0 ? 'brand' : idx === 1 ? 'sky' : 'emerald'}>
                          {level.code} · {level.scope}
                        </Badge>
                        <h2 className="mt-1.5 text-2xl font-extrabold text-navy-950 sm:text-3xl">
                          {level.title}
                        </h2>
                      </div>
                    </div>
                    <p className="mt-5 text-[15px] leading-relaxed text-navy-600">
                      {level.description}
                    </p>
                  </div>
                  <dl className="flex gap-8">
                    {level.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="font-display text-3xl font-extrabold text-navy-950">
                          {s.value}
                        </dt>
                        <dd className="mt-1 text-[11.5px] font-medium text-navy-400">{s.label}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <Reveal>
                  <div className="rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                    <h3 className="text-[15px] font-bold text-navy-950">Tugas & Kewenangan</h3>
                    <ul className="mt-4 space-y-3">
                      {level.mandate.map((m) => (
                        <li key={m} className="flex gap-3">
                          <IconCheck
                            width={17}
                            height={17}
                            className="mt-0.5 shrink-0 rounded-full bg-emerald-50 p-0.5 text-emerald-600"
                          />
                          <span className="text-[13.5px] leading-relaxed text-navy-700">{m}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="mt-8 text-[15px] font-bold text-navy-950">Perangkat Organisasi</h3>
                    <ul className="mt-4 space-y-3">
                      {level.departments.map((d) => (
                        <li key={d.name} className="rounded-xl bg-navy-50/70 p-3.5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[13.5px] font-bold text-navy-900">{d.name}</span>
                            <span className="shrink-0 text-[11px] font-semibold text-brand-600">
                              {d.lead}
                            </span>
                          </div>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-navy-500">
                            {d.focus}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={110}>
                  <div className="rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-navy-950">
                        {level.key === 'pusat' ? 'Pengurus Inti' : 'Contoh Kepengurusan'}
                      </h3>
                      <Link
                        href="/struktur"
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand-600 hover:gap-2.5"
                      >
                        Bagan lengkap
                        <IconArrowRight width={14} height={14} />
                      </Link>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {level.leadership.map((p) => (
                        <div
                          key={p.name + p.position}
                          className="flex items-center gap-3.5 rounded-xl border border-navy-100 p-3.5 transition hover:border-brand-200 hover:bg-brand-50/30"
                        >
                          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 font-display text-[13px] font-extrabold text-white">
                            {p.initials}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-[13.5px] font-bold text-navy-950">
                              {p.name}
                            </div>
                            <div className="truncate text-[12px] text-navy-500">
                              {p.position}
                              {p.province ? ` · ${p.province}` : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {level.key === 'provinsi' && (
                      <div className="mt-7 rounded-xl border border-navy-100 bg-navy-50/60 p-5">
                        <h4 className="text-[13px] font-bold text-navy-900">
                          Sebaran DPW di seluruh Indonesia
                        </h4>
                        <div className="mt-3 space-y-2.5">
                          {ISLANDS.map((isl) => {
                            const list = PROVINCES.filter((p) => p.island === isl);
                            return (
                              <div key={isl}>
                                <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-navy-400">
                                  {isl} · {list.length} DPW
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {list.map((p) => (
                                    <span
                                      key={p.code}
                                      className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-navy-600 ring-1 ring-navy-100"
                                    >
                                      {p.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {level.key === 'kota' && (
                      <div className="mt-7 grid gap-3 sm:grid-cols-3">
                        {[
                          { icon: IconUsers, v: '4.180', l: 'Tim lapangan aktif' },
                          { icon: IconBuilding, v: '312', l: 'DPD terbentuk' },
                          { icon: IconMapPin, v: '1.964', l: 'Kecamatan terjangkau' },
                        ].map((s) => (
                          <div key={s.l} className="rounded-xl bg-navy-50/70 p-4 text-center">
                            <s.icon width={20} height={20} className="mx-auto text-brand-600" />
                            <div className="mt-2 font-display text-xl font-extrabold text-navy-950">
                              {s.v}
                            </div>
                            <div className="mt-0.5 text-[11px] text-navy-500">{s.l}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      <section className="container-page py-20">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-navy-100 bg-gradient-to-br from-navy-50 to-white p-10 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h3 className="text-xl font-extrabold text-navy-950">
                Ingin membentuk DPD di daerah Anda?
              </h3>
              <p className="mt-2 max-w-xl text-[14px] text-navy-600">
                Hubungi DPW provinsi setempat atau daftarkan diri sebagai anggota untuk memulai
                proses pembentukan kepengurusan daerah.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link href="/pendaftaran" className="btn-primary">
                Daftar Anggota
              </Link>
              <Link href="/kontak" className="btn-outline">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
