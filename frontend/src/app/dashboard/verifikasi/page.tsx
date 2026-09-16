'use client';

import { ReviewPage } from '@/components/dashboard/review-page';

export default function VerifikasiPage() {
  return (
    <ReviewPage
      title="Verifikasi Wilayah"
      description="Periksa kelayakan pengajuan titik CPSS dari DPD kota/kabupaten sebelum diteruskan ke DPP."
      pendingStatus="DIAJUKAN"
      allowedRoles={['PROVINSI', 'PUSAT']}
      actionLabel="Perlu verifikasi DPW"
      historyStatuses={['DIVERIFIKASI', 'DISETUJUI', 'DITOLAK']}
    />
  );
}
