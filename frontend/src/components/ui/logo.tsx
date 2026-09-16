import { cn } from '@/lib/utils';

export function Logo({
  className,
  variant = 'dark',
  showText = true,
}: {
  className?: string;
  variant?: 'dark' | 'light';
  showText?: boolean;
}) {
  const text = variant === 'light' ? 'text-white' : 'text-navy-950';
  const sub = variant === 'light' ? 'text-white/60' : 'text-navy-400';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center">
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
          <defs>
            <linearGradient id="gpnShield" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e01729" />
              <stop offset="100%" stopColor="#81141f" />
            </linearGradient>
          </defs>
          <path
            d="M24 3 42 9.6v12.9C42 33.6 34.6 41.7 24 45 13.4 41.7 6 33.6 6 22.5V9.6L24 3Z"
            fill="url(#gpnShield)"
          />
          <path
            d="M24 6.6 38.6 11.9v10.6c0 9.1-6 15.9-14.6 18.8-8.6-2.9-14.6-9.7-14.6-18.8V11.9L24 6.6Z"
            fill="#fff"
            fillOpacity="0.14"
          />
          <path
            d="M25.9 12.5 17 26.2h5.9l-1.2 9.3 9.1-14.2h-6.2l1.3-8.8Z"
            fill="#f5c451"
          />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn('font-display text-[17px] font-extrabold tracking-tight', text)}>
            GPN <span className="text-brand-600">08</span>
          </span>
          <span className={cn('mt-1 text-[10px] font-semibold uppercase tracking-[0.14em]', sub)}>
            Gerakan Persatuan Nasional
          </span>
        </span>
      )}
    </span>
  );
}
