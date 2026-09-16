import Link from 'next/link';
import type { ReactNode } from 'react';
import { IconChevronRight } from '@/components/ui/icons';

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumb: { href?: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-14 text-white lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-[0.10]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-sky-500/12 blur-[110px]" />

      <div className="container-page relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/45">
            {breadcrumb.map((b, i) => (
              <li key={b.label} className="flex items-center gap-1.5">
                {i > 0 && <IconChevronRight width={13} height={13} className="text-white/25" />}
                {b.href ? (
                  <Link href={b.href} className="transition-colors hover:text-white">
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-white/80">{b.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11.5px] font-semibold backdrop-blur">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
            {eyebrow}
          </div>
        )}

        <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[2.9rem]">
          {title}
        </h1>

        {description && (
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-white/65">
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
