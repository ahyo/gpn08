import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/shell';

export const metadata: Metadata = {
  title: 'Dashboard Internal',
  description: 'Dashboard internal pengurus GPN 08.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
