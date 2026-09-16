'use client';

import { useEffect, useState } from 'react';
import { getState, initialState, subscribe, type DemoState } from '@/lib/store';

/** Snapshot statis untuk render server/pra-hidrasi agar markup konsisten. */
let serverSnapshot: DemoState | null = null;
const getServerSnapshot = () => (serverSnapshot ??= initialState());

/**
 * Membaca state demo. `ready` bernilai false pada render pertama sehingga
 * markup server dan klien identik; data localStorage masuk setelah mount.
 */
export function useDemoState() {
  const [snapshot, setSnapshot] = useState<DemoState>(getServerSnapshot);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSnapshot({ ...getState() });
    setReady(true);
    return subscribe(() => setSnapshot({ ...getState() }));
  }, []);

  return { state: snapshot, ready };
}

/** true setelah komponen ter-mount di browser. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Animasi angka naik untuk kartu statistik. */
export function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

/** Observer sederhana untuk animasi masuk saat elemen terlihat. */
export function useInView<T extends HTMLElement>() {
  const [ref, setRef] = useState<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  return { ref: setRef, inView };
}
