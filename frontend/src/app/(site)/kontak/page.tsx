import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ContactForm } from '@/components/forms/contact-form';
import { Reveal, SectionHeading } from '@/components/ui/section';
import {
  IconBuilding,
  IconClock,
  IconGlobe,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShield,
} from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi Sekretariat Nasional GPN 08 atau kantor perwakilan wilayah untuk informasi keanggotaan, kerja sama, dan program CPSS.',
};

const OFFICES = [
  {
    name: 'Sekretariat Nasional (DPP)',
    address: 'Gedung Nusantara Lt. 8, Jl. Merdeka Selatan No. 8, Jakarta Pusat 10110',
    phone: '(021) 8080-8008',
    email: 'sekretariat@gpn08.id',
    hours: 'Senin–Jumat, 08.00–17.00 WIB',
  },
  {
    name: 'Kantor Perwakilan Barat (DPW Jawa Barat)',
    address: 'Jl. Asia Afrika No. 88, Kota Bandung, Jawa Barat 40111',
    phone: '(022) 4208-0808',
    email: 'jabar@gpn08.id',
    hours: 'Senin–Jumat, 08.00–16.00 WIB',
  },
  {
    name: 'Kantor Perwakilan Timur (DPW Jawa Timur)',
    address: 'Jl. Basuki Rahmat No. 108, Kota Surabaya, Jawa Timur 60271',
    phone: '(031) 5320-8008',
    email: 'jatim@gpn08.id',
    hours: 'Senin–Jumat, 08.00–16.00 WIB',
  },
];

const DEPARTMENTS = [
  { icon: IconShield, name: 'Keanggotaan', email: 'anggota@gpn08.id', desc: 'Pendaftaran, verifikasi, dan kartu anggota.' },
  { icon: IconMapPin, name: 'Program CPSS', email: 'cpss@gpn08.id', desc: 'Pengajuan titik, teknis lokasi, dan operasional.' },
  { icon: IconGlobe, name: 'Kemitraan', email: 'kemitraan@gpn08.id', desc: 'Kerja sama pemerintah, BUMN, dan dunia usaha.' },
  { icon: IconBuilding, name: 'Media & Pers', email: 'humas@gpn08.id', desc: 'Permintaan wawancara dan siaran pers.' },
];

const FAQ = [
  {
    q: 'Apakah pendaftaran anggota dipungut biaya?',
    a: 'Tidak. Pendaftaran anggota GPN 08 sepenuhnya gratis. Organisasi tidak pernah memungut biaya dalam bentuk apa pun untuk proses keanggotaan.',
  },
  {
    q: 'Berapa lama proses verifikasi keanggotaan?',
    a: 'DPW provinsi memverifikasi berkas dalam waktu maksimal 3 hari kerja. Hasil verifikasi dikirim ke email yang Anda daftarkan.',
  },
  {
    q: 'Bagaimana cara mengusulkan titik CPSS di daerah saya?',
    a: 'Usulan titik hanya dapat diajukan oleh anggota yang tergabung dalam tim lapangan DPD. Daftar sebagai anggota, pilih bidang Tim Lapangan CPSS, lalu hubungi DPD setempat untuk pembekalan.',
  },
  {
    q: 'Apakah GPN 08 berafiliasi dengan partai politik?',
    a: 'Tidak. GPN 08 adalah organisasi kemasyarakatan yang bersifat mandiri dan tidak berafiliasi dengan partai politik mana pun.',
  },
];

export default function KontakPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: '/', label: 'Beranda' }, { label: 'Kontak' }]}
        eyebrow="Hubungi Kami"
        title={
          <>
            Mari <span className="text-gold-400">bekerja sama</span>
          </>
        }
        description="Sekretariat Nasional GPN 08 terbuka untuk pertanyaan seputar keanggotaan, program CPSS, kerja sama kelembagaan, maupun peliputan media."
      />

      <section className="container-page py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={80}>
              <div className="card overflow-hidden">
                <div className="bg-navy-950 px-6 py-5 text-white">
                  <h3 className="text-[15px] font-bold">Sekretariat Nasional</h3>
                  <p className="mt-1 text-[12.5px] text-white/55">Dewan Pimpinan Pusat GPN 08</p>
                </div>
                <ul className="divide-y divide-navy-50">
                  {[
                    { icon: IconMapPin, label: 'Alamat', value: OFFICES[0].address },
                    { icon: IconPhone, label: 'Telepon', value: OFFICES[0].phone, href: 'tel:+622180808008' },
                    { icon: IconMail, label: 'Email', value: OFFICES[0].email, href: 'mailto:sekretariat@gpn08.id' },
                    { icon: IconClock, label: 'Jam Layanan', value: OFFICES[0].hours },
                  ].map((r) => (
                    <li key={r.label} className="flex gap-3.5 px-6 py-4">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <r.icon width={17} height={17} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10.5px] font-bold uppercase tracking-wide text-navy-400">
                          {r.label}
                        </div>
                        {r.href ? (
                          <a
                            href={r.href}
                            className="text-[13.5px] font-semibold text-navy-900 hover:text-brand-600"
                          >
                            {r.value}
                          </a>
                        ) : (
                          <div className="text-[13.5px] font-medium leading-relaxed text-navy-800">
                            {r.value}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="card p-6">
                <h3 className="text-[15px] font-bold text-navy-950">Kontak per Bidang</h3>
                <ul className="mt-4 space-y-3">
                  {DEPARTMENTS.map((d) => (
                    <li key={d.name} className="flex gap-3.5 rounded-xl bg-navy-50/60 p-3.5">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-navy-700 shadow-sm">
                        <d.icon width={17} height={17} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-navy-900">{d.name}</div>
                        <div className="text-[12px] text-navy-500">{d.desc}</div>
                        <a
                          href={`mailto:${d.email}`}
                          className="mt-0.5 inline-block text-[12px] font-semibold text-brand-600 hover:underline"
                        >
                          {d.email}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Kantor perwakilan */}
      <section className="border-y border-navy-100 bg-navy-50/50 py-16">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Jaringan Kantor"
              title="Kantor sekretariat dan perwakilan"
              description="Selain sekretariat nasional, GPN 08 memiliki kantor perwakilan yang melayani wilayah barat dan timur Indonesia."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {OFFICES.map((o, i) => (
              <Reveal key={o.name} delay={i * 90}>
                <article className="card h-full p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white">
                    <IconBuilding width={19} height={19} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold text-navy-950">{o.name}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-navy-600">{o.address}</p>
                  <dl className="mt-4 space-y-1.5 border-t border-navy-50 pt-4 text-[12.5px]">
                    <div className="flex gap-2">
                      <dt className="text-navy-400">Telepon</dt>
                      <dd className="font-semibold text-navy-800">{o.phone}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-navy-400">Email</dt>
                      <dd className="font-semibold text-navy-800">{o.email}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-navy-400">Layanan</dt>
                      <dd className="font-semibold text-navy-800">{o.hours}</dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-16 lg:py-20">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Pertanyaan Umum"
            title="Hal yang sering ditanyakan"
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 70}>
              <details className="group card overflow-hidden p-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[14.5px] font-bold text-navy-950 transition hover:bg-navy-50/60">
                  {f.q}
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-500 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="border-t border-navy-50 px-6 py-5 text-[13.5px] leading-relaxed text-navy-600">
                  {f.a}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
