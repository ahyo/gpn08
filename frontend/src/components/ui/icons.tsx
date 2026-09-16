import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const IconBolt = (p: P) => (
  <svg {...base(p)}><path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" /></svg>
);
export const IconMapPin = (p: P) => (
  <svg {...base(p)}><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
);
export const IconUsers = (p: P) => (
  <svg {...base(p)}><path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" /><circle cx="9" cy="7.5" r="3.5" /><path d="M22 20v-1.5a4 4 0 0 0-3-3.87M16.5 4.13a3.5 3.5 0 0 1 0 6.74" /></svg>
);
export const IconShield = (p: P) => (
  <svg {...base(p)}><path d="M12 2.8 20 6v6c0 5-3.4 8.2-8 9.2C7.4 20.2 4 17 4 12V6l8-3.2Z" /><path d="m9 12 2.2 2.2L15.5 10" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}><path d="m4.5 12.5 5 5 10-11" /></svg>
);
export const IconX = (p: P) => (
  <svg {...base(p)}><path d="M6 6 18 18M18 6 6 18" /></svg>
);
export const IconChevronRight = (p: P) => (
  <svg {...base(p)}><path d="m9 5 7 7-7 7" /></svg>
);
export const IconChevronDown = (p: P) => (
  <svg {...base(p)}><path d="m5 9 7 7 7-7" /></svg>
);
export const IconArrowRight = (p: P) => (
  <svg {...base(p)}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
);
export const IconBell = (p: P) => (
  <svg {...base(p)}><path d="M18 8.5a6 6 0 0 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5Z" /><path d="M13.7 20a2 2 0 0 1-3.4 0" /></svg>
);
export const IconMenu = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconSearch = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
);
export const IconLayout = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M3 9h18M9 21V9" /></svg>
);
export const IconFileText = (p: P) => (
  <svg {...base(p)}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
);
export const IconSitemap = (p: P) => (
  <svg {...base(p)}><rect x="9" y="2.5" width="6" height="5" rx="1.5" /><rect x="2.5" y="16.5" width="6" height="5" rx="1.5" /><rect x="15.5" y="16.5" width="6" height="5" rx="1.5" /><path d="M12 7.5v4.5M5.5 16.5V12h13v4.5" /></svg>
);
export const IconBuilding = (p: P) => (
  <svg {...base(p)}><path d="M4 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15" /><path d="M15 11h3a2 2 0 0 1 2 2v8M2.5 21h19M8 8h3M8 12h3M8 16h3" /></svg>
);
export const IconLogout = (p: P) => (
  <svg {...base(p)}><path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
);
export const IconPhone = (p: P) => (
  <svg {...base(p)}><path d="M21 16.9v2.6a1.6 1.6 0 0 1-1.8 1.6A17.8 17.8 0 0 1 3 4.8 1.6 1.6 0 0 1 4.6 3h2.6a1.6 1.6 0 0 1 1.6 1.4c.1 1 .3 1.9.6 2.8a1.6 1.6 0 0 1-.4 1.7L7.8 10a14 14 0 0 0 6.2 6.2l1.1-1.2a1.6 1.6 0 0 1 1.7-.4c.9.3 1.8.5 2.8.6a1.6 1.6 0 0 1 1.4 1.7Z" /></svg>
);
export const IconMail = (p: P) => (
  <svg {...base(p)}><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IconClock = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5.2l3.2 2" /></svg>
);
export const IconPlus = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconCrosshair = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="8" /><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" /></svg>
);
export const IconGlobe = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18A15 15 0 0 1 12 3Z" /></svg>
);
export const IconTrendUp = (p: P) => (
  <svg {...base(p)}><path d="m3 16 5.5-5.5 3.5 3.5L21 5" /><path d="M15 5h6v6" /></svg>
);
export const IconDownload = (p: P) => (
  <svg {...base(p)}><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16" /></svg>
);
export const IconFilter = (p: P) => (
  <svg {...base(p)}><path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" /></svg>
);
export const IconTarget = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></svg>
);
export const IconHandshake = (p: P) => (
  <svg {...base(p)}><path d="m11 6 2-1.5a2.5 2.5 0 0 1 3 0L21 8v6l-2 2-4-3.5" /><path d="M3 8 7.5 4.5a2.5 2.5 0 0 1 3 0L15 8l-3 2.5a2 2 0 0 1-2.5 0L8 9" /><path d="m3 8 2 8 5 3.5a2 2 0 0 0 2.6-.3L15 17" /></svg>
);
export const IconSparkle = (p: P) => (
  <svg {...base(p)}><path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9L4.5 10.8 10.2 9 12 3.5Z" /></svg>
);
export const IconLock = (p: P) => (
  <svg {...base(p)}><rect x="4.5" y="10" width="15" height="10.5" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></svg>
);
export const IconBattery = (p: P) => (
  <svg {...base(p)}><rect x="2.5" y="7" width="16" height="10" rx="2.5" /><path d="M21.5 10.5v3" /><path d="M6.5 10.5h4l-2 3h4" /></svg>
);
export const IconInfo = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.6v.5" /></svg>
);
export const IconWarning = (p: P) => (
  <svg {...base(p)}><path d="M10.3 3.6 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4.5M12 17.2v.5" /></svg>
);
