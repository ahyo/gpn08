'use client';

import type { ReactNode } from 'react';
import { useCountUp, useInView } from '@/lib/hooks';
import { cn, formatNumber } from '@/lib/utils';

export function StatCard({
  icon,
  label,
  value,
  suffix,
  hint,
  tone = 'light',
  animate = true,
}: {
  icon?: ReactNode;
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
  tone?: 'light' | 'dark';
  animate?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const dark = tone === 'dark';
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border p-5 transition-all duration-500',
        dark
          ? 'border-white/10 bg-white/[0.06] backdrop-blur'
          : 'border-navy-100 bg-white shadow-card hover:shadow-lift',
      )}
    >
      {icon && (
        <div
          className={cn(
            'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl',
            dark ? 'bg-white/10 text-gold-400' : 'bg-brand-50 text-brand-600',
          )}
        >
          {icon}
        </div>
      )}
      <div
        className={cn(
          'font-display text-3xl font-extrabold tabular-nums tracking-tight',
          dark ? 'text-white' : 'text-navy-950',
        )}
      >
        {inView && animate ? <Counter value={value} /> : formatNumber(value)}
        {suffix && (
          <span className={cn('ml-1 text-lg font-bold', dark ? 'text-gold-400' : 'text-brand-500')}>
            {suffix}
          </span>
        )}
      </div>
      <div className={cn('mt-1 text-sm font-semibold', dark ? 'text-white/80' : 'text-navy-700')}>
        {label}
      </div>
      {hint && (
        <div className={cn('mt-1 text-xs', dark ? 'text-white/50' : 'text-navy-400')}>{hint}</div>
      )}
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const n = useCountUp(value);
  return <>{formatNumber(n)}</>;
}

export function MiniStat({
  label,
  value,
  tone = 'navy',
  icon,
}: {
  label: string;
  value: ReactNode;
  tone?: 'navy' | 'brand' | 'emerald' | 'amber' | 'sky';
  icon?: ReactNode;
}) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
  };
  return (
    <div className="card flex items-center gap-4 p-4">
      {icon && (
        <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-xl', tones[tone])}>
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <div className="font-display text-2xl font-extrabold leading-none tabular-nums text-navy-950">
          {value}
        </div>
        <div className="mt-1 truncate text-[13px] font-medium text-navy-500">{label}</div>
      </div>
    </div>
  );
}
