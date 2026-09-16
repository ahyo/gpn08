import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { IconMail, IconMapPin, IconPhone } from '@/components/ui/icons';

const COLUMNS = [
  {
    title: 'Organisasi',
    links: [
      { href: '/profil', label: 'Profil GPN 08' },
      { href: '/profil#pusat', label: 'GPN 08 Pusat' },
      { href: '/profil#provinsi', label: 'GPN 08 Provinsi' },
      { href: '/profil#kota', label: 'GPN 08 Kota/Kabupaten' },
      { href: '/struktur', label: 'Struktur Organisasi' },
    ],
  },
  {
    title: 'Layanan CPSS',
    links: [
      { href: '/cpss', label: 'Dashboard Peta Nasional' },
      { href: '/dashboard/pengajuan', label: 'Pengajuan Titik' },
      { href: '/dashboard/verifikasi', label: 'Verifikasi Wilayah' },
      { href: '/dashboard/persetujuan', label: 'Persetujuan Pusat' },
    ],
  },
  {
    title: 'Keanggotaan',
    links: [
      { href: '/pendaftaran', label: 'Pendaftaran Anggota' },
      { href: '/login', label: 'Masuk Anggota' },
      { href: '/berita', label: 'Berita & Kegiatan' },
      { href: '/kontak', label: 'Hubungi Kami' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy-950 text-white/70">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Gerakan Persatuan Nasional 08 adalah organisasi kemasyarakatan yang bergerak
            memperkuat persatuan, kemandirian energi, dan ekonomi kerakyatan melalui jaringan
            Charging Point Service System di seluruh Indonesia.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex items-start gap-3">
              <IconMapPin width={17} height={17} className="mt-0.5 shrink-0 text-gold-400" />
              Gedung Nusantara Lt. 8, Jl. Merdeka Selatan No. 8, Jakarta Pusat 10110
            </p>
            <p className="flex items-center gap-3">
              <IconPhone width={17} height={17} className="shrink-0 text-gold-400" />
              <a href="tel:+622180808008" className="hover:text-white">(021) 8080-8008</a>
            </p>
            <p className="flex items-center gap-3">
              <IconMail width={17} height={17} className="shrink-0 text-gold-400" />
              <a href="mailto:sekretariat@gpn08.id" className="hover:text-white">
                sekretariat@gpn08.id
              </a>
            </p>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.14em] text-white">
              {col.title}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-[13px] sm:flex-row">
          <p>© {new Date().getFullYear()} Gerakan Persatuan Nasional 08. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-2 text-white/45">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
            Versi Demo — Data yang ditampilkan bersifat contoh
          </p>
        </div>
      </div>
    </footer>
  );
}
