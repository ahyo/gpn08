import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const TONES = {
  slate: 'bg-navy-50 text-navy-600 ring-navy-200/70',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  navy: 'bg-navy-900 text-white ring-navy-900',
  gold: 'bg-amber-100 text-amber-800 ring-amber-300',
} as const;

export type BadgeTone = keyof typeof TONES;

export function Badge({
  children,
  tone = 'slate',
  className,
  dot = false,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span className={cn('chip ring-1', TONES[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
