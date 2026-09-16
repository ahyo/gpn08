'use client';

import { useState } from 'react';
import { Field, SelectInput, TextArea, TextInput } from '@/components/forms/field';
import { IconArrowRight, IconCheck, IconMail } from '@/components/ui/icons';

const TOPICS = [
  'Informasi Keanggotaan',
  'Program CPSS / Pengajuan Titik',
  'Kerja Sama & Kemitraan',
  'Media & Peliputan',
  'Pengaduan / Laporan',
  'Lainnya',
];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card flex h-full flex-col items-center justify-center p-10 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <IconCheck width={30} height={30} />
        </span>
        <h2 className="mt-5 text-xl font-extrabold text-navy-950">Pesan Anda terkirim</h2>
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-navy-600">
          Terima kasih, {form.name.split(' ')[0] || 'Sahabat GPN 08'}. Tim sekretariat akan
          menghubungi Anda melalui {form.email} dalam 2 hari kerja.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ name: '', email: '', phone: '', topic: '', message: '' });
          }}
          className="btn-outline mt-6"
        >
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <IconMail width={20} height={20} />
        </span>
        <div>
          <h2 className="text-lg font-extrabold text-navy-950">Kirim Pesan</h2>
          <p className="text-[13px] text-navy-500">Kami membalas dalam 2 hari kerja.</p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Nama Lengkap" required>
          <TextInput
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama Anda"
            required
          />
        </Field>
        <Field label="Email" required>
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nama@email.com"
            required
          />
        </Field>
        <Field label="Nomor Telepon">
          <TextInput
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="08123456789"
          />
        </Field>
        <Field label="Topik" required>
          <SelectInput
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            required
          >
            <option value="">— Pilih topik —</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Pesan" required className="sm:col-span-2">
          <TextArea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tuliskan pesan Anda secara ringkas dan jelas."
            required
          />
        </Field>
      </div>

      <button type="submit" className="btn-primary mt-7 w-full sm:w-auto">
        Kirim Pesan
        <IconArrowRight width={16} height={16} />
      </button>
      <p className="mt-3 text-[12px] text-navy-400">
        Dengan mengirim pesan, Anda menyetujui data kontak digunakan untuk keperluan korespondensi
        organisasi.
      </p>
    </form>
  );
}
