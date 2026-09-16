'use client';

import { ReviewPage } from '@/components/dashboard/review-page';

export default function PersetujuanPage() {
  return (
    <ReviewPage
      title="Persetujuan Pusat"
      description="Berikan persetujuan akhir atas titik CPSS yang telah diverifikasi DPW provinsi."
      pendingStatus="DIVERIFIKASI"
      allowedRoles={['PUSAT']}
      actionLabel="Menunggu persetujuan DPP"
      historyStatuses={['DISETUJUI', 'DITOLAK']}
    />
  );
}
