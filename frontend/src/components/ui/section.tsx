'use client';

import type { ReactNode } from 'react';
import { useInView } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]',
            dark ? 'text-gold-400' : 'text-brand-600',
          )}
        >
          <span className={cn('h-px w-6', dark ? 'bg-gold-400/60' : 'bg-brand-400')} />
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          'text-2xl font-extrabold leading-[1.15] sm:text-3xl lg:text-[2.1rem]',
          dark ? 'text-white' : 'text-navy-950',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-[15px] leading-relaxed',
            dark ? 'text-white/70' : 'text-navy-600',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
