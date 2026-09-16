import type { Metadata } from 'next';
import { LoginForm } from '@/components/forms/login-form';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke dashboard internal GPN 08 untuk pengurus pusat, provinsi, kota/kabupaten, dan tim lapangan.',
};

export default function LoginPage() {
  return <LoginForm />;
}
