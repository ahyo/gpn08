'use client';

import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="field-label">
        {label}
        {required && <span className="ml-0.5 text-brand-600">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-brand-600">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input {...props} className={cn('field', error && 'border-brand-400 focus:border-brand-500', className)} />;
}

export function SelectInput({
  error,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select {...props} className={cn('field', error && 'border-brand-400', className)}>
      {children}
    </select>
  );
}

export function TextArea({
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea {...props} className={cn('field min-h-[110px] resize-y', error && 'border-brand-400', className)} />
  );
}

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold transition-all',
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                      : 'bg-navy-100 text-navy-400',
                )}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={cn(
                  'hidden text-[12.5px] font-semibold sm:block',
                  active ? 'text-navy-950' : done ? 'text-emerald-600' : 'text-navy-400',
                )}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  'mx-3 h-px w-8 sm:w-12',
                  done ? 'bg-emerald-300' : 'bg-navy-100',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
