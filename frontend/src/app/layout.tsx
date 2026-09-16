import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'GPN 08 — Gerakan Persatuan Nasional 08',
    template: '%s · GPN 08',
  },
  description:
    'Portal resmi Gerakan Persatuan Nasional 08: profil organisasi pusat, provinsi, dan kota/kabupaten, pendaftaran anggota, serta dashboard Charging Point Service System (CPSS) nasional.',
  keywords: [
    'GPN 08',
    'Gerakan Persatuan Nasional',
    'Charging Point Service System',
    'CPSS',
    'SPKLU',
    'organisasi kemasyarakatan',
  ],
  authors: [{ name: 'GPN 08' }],
  openGraph: {
    title: 'GPN 08 — Gerakan Persatuan Nasional 08',
    description:
      'Satu gerakan, satu data, satu peta layanan nasional. Dashboard CPSS dan sistem persetujuan berjenjang GPN 08.',
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  themeColor: '#0e2a52',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
