import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { RegistrationForm } from '@/components/forms/registration-form';

export const metadata: Metadata = {
  title: 'Pendaftaran Anggota',
  description:
    'Formulir pendaftaran anggota Gerakan Persatuan Nasional 08. Terbuka untuk seluruh warga negara Indonesia, tanpa dipungut biaya.',
};

export default function PendaftaranPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ href: '/', label: 'Beranda' }, { label: 'Pendaftaran Anggota' }]}
        eyebrow="Keanggotaan Terbuka"
        title={
          <>
            Daftar Menjadi Anggota <span className="text-gold-400">GPN 08</span>
          </>
        }
        description="Isi formulir berikut dengan data yang sesuai kartu identitas Anda. Pendaftaran akan diverifikasi oleh DPW provinsi domisili dalam 3 hari kerja."
      />
      <section className="container-page py-14 lg:py-20">
        <RegistrationForm />
      </section>
    </>
  );
}
