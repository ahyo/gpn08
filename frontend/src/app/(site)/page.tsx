import Link from 'next/link';
import { HeroMapPreview } from '@/components/cpss/hero-map';
import { Badge } from '@/components/ui/badge';
import { Reveal, SectionHeading } from '@/components/ui/section';
import { StatCard } from '@/components/ui/stat';
import {
  IconArrowRight,
  IconBolt,
  IconBuilding,
  IconCheck,
  IconGlobe,
  IconHandshake,
  IconMapPin,
  IconShield,
  IconSitemap,
  IconSparkle,
  IconTarget,
  IconUsers,
} from '@/components/ui/icons';
import { ORG_LEVELS } from '@/lib/data/org';
import { NEWS } from '@/lib/data/news';
import { formatDate } from '@/lib/utils';

const PILLARS = [
  {
    icon: IconHandshake,
    title: 'Persatuan & Kebangsaan',
    text: 'Merawat kebinekaan melalui program kemasyarakatan yang menyatukan seluruh elemen bangsa dari Sabang sampai Merauke.',
  },
  {
    icon: IconBolt,
    title: 'Kemandirian Energi',
    text: 'Membangun jaringan Charging Point Service System sebagai infrastruktur energi bersih yang dikelola bersama masyarakat.',
  },
  {
    icon: IconUsers,
    title: 'Ekonomi Kerakyatan',
    text: 'Menjadikan setiap titik layanan sebagai simpul usaha mikro binaan yang menghidupkan ekonomi warga sekitar.',
  },
  {
    icon: IconShield,
    title: 'Kaderisasi & Integritas',
    text: 'Melatih kader dan tim lapangan tersertifikasi dengan standar kerja, keselamatan, dan akuntabilitas data yang jelas.',
  },
];

const FLOW = [
  {
    step: '01',
    actor: 'DPD Kota/Kabupaten',
    title: 'Pengajuan Titik',
    text: 'Tim lapangan melakukan survei, mengambil titik koordinat GPS, melengkapi data teknis lokasi, lalu mengirim pengajuan melalui platform.',
    tone: 'brand',
  },
  {
    step: '02',
    actor: 'DPW Provinsi',
    title: 'Verifikasi Wilayah',
    text: 'DPW menerima notifikasi otomatis, memeriksa kelayakan administratif dan teknis, lalu meneruskan pengajuan ke pusat.',
    tone: 'sky',
  },
  {
    step: '03',
    actor: 'DPP Pusat',
    title: 'Persetujuan Akhir',
    text: 'DPP memeriksa hasil verifikasi wilayah dan memberikan persetujuan akhir sesuai standar nasional CPSS.',
    tone: 'emerald',
  },
  {
    step: '04',
    actor: 'Publik',
    title: 'Tayang di Peta Nasional',
    text: 'Titik yang disetujui langsung muncul di Dashboard CPSS dan dapat diakses seluruh masyarakat Indonesia.',
    tone: 'gold',
  },
] as const;

const TONE_CLASS: Record<string, string> = {
  brand: 'bg-brand-600',
  sky: 'bg-sky-600',
  emerald: 'bg-emerald-600',
  gold: 'bg-gold-500',
};

const PARTNERS = [
  'Kementerian ESDM',
  'Kementerian Dalam Negeri',
  'PT PLN (Persero)',
  'Pemerintah Provinsi',
  'Asosiasi UMKM Nasional',
  'Komunitas Kendaraan Listrik',
];

export default function HomePage() {
  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:64px_64px] opacity-[0.10]" />
        <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-brand-600/25 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-sky-500/15 blur-[120px]" />

        <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11.5px] font-semibold backdrop-blur">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
              Organisasi Kemasyarakatan Berbadan Hukum
              <span className="text-white/40">·</span>
              <span className="text-white/60">Sejak 2021</span>
            </div>

            <h1 className="mt-6 text-[2.4rem] font-extrabold leading-[1.06] sm:text-5xl lg:text-[3.4rem]">
              Satu Gerakan,
              <br />
              Satu Data,
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-gold-400 bg-clip-text text-transparent">
                Satu Peta Nasional.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/65">
              <strong className="font-bold text-white">Gerakan Persatuan Nasional 08</strong>{' '}
              menghubungkan pengurus pusat, provinsi, dan kota/kabupaten dalam satu sistem
              terpadu — mulai dari keanggotaan hingga pengelolaan{' '}
              <em className="not-italic text-gold-400">Charging Point Service System</em> di
              seluruh Indonesia.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cpss" className="btn-primary">
                <IconMapPin width={17} height={17} />
                Buka Dashboard CPSS
              </Link>
              <Link
                href="/pendaftaran"
                className="btn border border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10"
              >
                Daftar Jadi Anggota
                <IconArrowRight width={16} height={16} />
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { v: '38', l: 'Provinsi (DPW)' },
                { v: '312', l: 'Kota/Kab. (DPD)' },
                { v: '48.750+', l: 'Anggota terdaftar' },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    {s.v}
                  </dt>
                  <dd className="mt-1 text-[12px] font-medium leading-tight text-white/45">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <HeroMapPreview />
            <p className="mt-3 text-center text-[11.5px] text-white/40">
              Pratinjau langsung Dashboard CPSS — klik untuk membuka versi interaktif penuh
            </p>
          </div>
        </div>

        {/* Marquee mitra */}
        <div className="relative border-t border-white/10 py-5">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="flex animate-marquee items-center gap-12 whitespace-nowrap pr-12">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2.5 text-[13px] font-semibold text-white/35"
                >
                  <IconShield width={16} height={16} className="text-white/25" />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= TENTANG / PILAR ========================= */}
      <section className="container-page py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Tentang Kami"
              title={
                <>
                  Gerakan yang tumbuh dari{' '}
                  <span className="text-brand-600">akar rumput</span>, bekerja dengan data.
                </>
              }
              description="GPN 08 lahir dari keyakinan bahwa persatuan nasional harus diwujudkan lewat kerja nyata yang terukur. Kami menyusun organisasi berjenjang dari pusat hingga kota/kabupaten, dan menopangnya dengan satu sistem informasi yang transparan."
            />
            <div className="mt-8 space-y-3">
              {[
                'Struktur berjenjang: DPP → DPW → DPD dengan kewenangan yang jelas.',
                'Seluruh titik layanan melalui verifikasi wilayah dan persetujuan pusat.',
                'Basis data anggota nasional yang terkonsolidasi dan dapat diaudit.',
              ].map((t) => (
                <p key={t} className="flex gap-3 text-[14.5px] text-navy-700">
                  <IconCheck
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 rounded-full bg-emerald-50 p-0.5 text-emerald-600"
                  />
                  {t}
                </p>
              ))}
            </div>
            <Link
              href="/profil"
              className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-brand-600 transition-all hover:gap-3"
            >
              Pelajari profil lengkap organisasi
              <IconArrowRight width={16} height={16} />
            </Link>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <article className="group h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <p.icon width={21} height={21} />
                  </span>
                  <h3 className="mt-4 text-[16px] font-bold text-navy-950">{p.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-navy-600">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TIGA TINGKAT ORGANISASI ===================== */}
      <section className="border-y border-navy-100 bg-navy-50/50 py-20 lg:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Struktur Berjenjang"
              title="Tiga tingkat kepengurusan, satu arah gerakan"
              description="Setiap tingkat memiliki mandat dan kewenangan yang berbeda namun saling terhubung dalam satu alur kerja digital."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {ORG_LEVELS.map((lvl, i) => (
              <Reveal key={lvl.key} delay={i * 110}>
                <article className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 font-display text-[13px] font-extrabold text-white">
                      {lvl.code}
                    </span>
                    <Badge tone={i === 0 ? 'brand' : i === 1 ? 'sky' : 'emerald'}>
                      {lvl.scope}
                    </Badge>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-navy-950">{lvl.title}</h3>
                  <p className="mt-1 text-[13px] font-semibold text-brand-600">{lvl.subtitle}</p>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-navy-600">
                    {lvl.description}
                  </p>
                  <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-navy-100 pt-5">
                    {lvl.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="font-display text-lg font-extrabold text-navy-950">
                          {s.value}
                        </dt>
                        <dd className="mt-0.5 text-[10.5px] font-medium leading-tight text-navy-400">
                          {s.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={`/profil#${lvl.key}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-navy-900 transition-all hover:gap-2.5 hover:text-brand-600"
                  >
                    Selengkapnya
                    <IconArrowRight width={15} height={15} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CPSS ============================ */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:64px_64px] opacity-[0.08]" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-brand-600/20 blur-[130px]" />

        <div className="container-page relative">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <Badge tone="brand" className="bg-brand-600/15 text-brand-200 ring-brand-500/30" dot>
                Program Unggulan
              </Badge>
              <SectionHeading
                tone="dark"
                className="mt-4"
                title={
                  <>
                    Charging Point Service System —{' '}
                    <span className="text-gold-400">infrastruktur milik bersama</span>
                  </>
                }
                description="CPSS adalah jaringan titik layanan pengisian daya kendaraan listrik yang diusulkan, diverifikasi, dan dikelola oleh jajaran GPN 08 di seluruh Indonesia. Setiap titik tercatat dengan koordinat presisi dan status operasional yang dapat dipantau publik."
              />

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <StatCard
                  tone="dark"
                  icon={<IconBolt width={19} height={19} />}
                  label="Titik layanan aktif"
                  value={420}
                  suffix="+"
                  hint="Tersebar di 38 provinsi"
                />
                <StatCard
                  tone="dark"
                  icon={<IconTarget width={19} height={19} />}
                  label="Target nasional 2026"
                  value={1000}
                  suffix=" titik"
                  hint="Tahap dua program CPSS"
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/cpss" className="btn-primary">
                  Lihat Peta Nasional
                  <IconArrowRight width={16} height={16} />
                </Link>
                <Link
                  href="/dashboard/pengajuan/baru"
                  className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Ajukan Titik Baru
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-600/20 to-transparent blur-2xl" />
                <div className="relative">
                  <HeroMapPreview />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ======================= ALUR BERJENJANG ======================= */}
      <section className="container-page py-20 lg:py-28">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Alur Persetujuan"
            title="Dari usulan lapangan sampai tayang di peta nasional"
            description="Mekanisme berjenjang memastikan setiap titik CPSS benar-benar layak, tercatat, dan dapat dipertanggungjawabkan."
          />
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-[38px] hidden h-0.5 bg-gradient-to-r from-brand-200 via-sky-200 to-gold-300 lg:block" />
          <ol className="grid gap-8 lg:grid-cols-4">
            {FLOW.map((f, i) => (
              <Reveal key={f.step} delay={i * 110}>
                <li className="relative">
                  <div className="flex items-center gap-4 lg:block">
                    <span
                      className={`relative z-10 inline-flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl ${TONE_CLASS[f.tone]} font-display text-2xl font-extrabold text-white shadow-lift ring-8 ring-white`}
                    >
                      {f.step}
                    </span>
                    <div className="lg:mt-6">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-400">
                        {f.actor}
                      </span>
                      <h3 className="mt-1 text-[17px] font-extrabold text-navy-950">{f.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-navy-600">{f.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={200}>
          <div className="mt-14 overflow-hidden rounded-2xl border border-navy-100 bg-gradient-to-br from-navy-50 to-white p-8 lg:p-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex gap-5">
                <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card sm:inline-flex">
                  <IconSparkle width={24} height={24} />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-navy-950">
                    Notifikasi otomatis di setiap tahap
                  </h3>
                  <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-navy-600">
                    Ketika DPD mengirim pengajuan, DPW langsung menerima notifikasi. Setelah DPW
                    menyelesaikan verifikasi, giliran DPP yang mendapat notifikasi untuk memberi
                    persetujuan akhir. Tidak ada berkas yang tertahan tanpa penanganan.
                  </p>
                </div>
              </div>
              <Link href="/login" className="btn-navy shrink-0">
                Coba Alur Persetujuan
                <IconArrowRight width={16} height={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============================ BERITA ============================ */}
      <section className="border-t border-navy-100 bg-navy-50/50 py-20 lg:py-24">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Kabar Terbaru"
                title="Berita & kegiatan GPN 08"
                description="Perkembangan program, kerja sama, dan agenda organisasi di seluruh Indonesia."
              />
              <Link href="/berita" className="btn-outline shrink-0">
                Semua berita
                <IconArrowRight width={16} height={16} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {NEWS.slice(0, 3).map((n, i) => (
              <Reveal key={n.id} delay={i * 100}>
                <Link
                  href={`/berita/${n.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-navy-900 to-navy-950">
                    <div className="absolute inset-0 bg-grid-light bg-[size:28px_28px] opacity-20" />
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-600/30 blur-2xl" />
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                      {n.category}
                    </span>
                    <IconBuilding
                      width={40}
                      height={40}
                      className="absolute right-5 top-5 text-white/15"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-[11.5px] text-navy-400">
                      {formatDate(n.date)}
                      <span className="h-1 w-1 rounded-full bg-navy-200" />
                      {n.readMinutes} menit baca
                    </div>
                    <h3 className="mt-2.5 text-[15.5px] font-bold leading-snug text-navy-950 transition-colors group-hover:text-brand-600">
                      {n.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-navy-500">
                      {n.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-600 transition-all group-hover:gap-2.5">
                      Baca selengkapnya
                      <IconArrowRight width={15} height={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="container-page py-20 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-950 px-8 py-14 text-center lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-[0.10]" />
            <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-brand-600/25 blur-[100px]" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gold-500/15 blur-[100px]" />

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold-400 backdrop-blur">
                <IconSitemap width={26} height={26} />
              </span>
              <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Bergabunglah dalam gerakan
                <span className="block text-gold-400">persatuan yang bekerja nyata</span>
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-white/65">
                Pendaftaran anggota terbuka untuk seluruh warga negara Indonesia. Setelah
                terverifikasi, Anda dapat bergabung dengan tim lapangan dan turut mengusulkan
                titik CPSS di daerah Anda.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link href="/pendaftaran" className="btn-primary">
                  <IconUsers width={17} height={17} />
                  Daftar Anggota Sekarang
                </Link>
                <Link
                  href="/kontak"
                  className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <IconGlobe width={16} height={16} />
                  Hubungi Sekretariat
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
