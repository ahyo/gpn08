import type { Metadata } from 'next';
import { CpssDashboard } from '@/components/cpss/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard CPSS Nasional',
  description:
    'Peta sebaran titik Charging Point Service System (CPSS) GPN 08 di seluruh Indonesia, lengkap dengan koordinat, kapasitas, dan status operasional.',
};

export default function CpssPage() {
  return <CpssDashboard />;
}
