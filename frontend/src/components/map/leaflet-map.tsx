'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { CATEGORY_SHORT } from '@/lib/data/points';
import { provinceName } from '@/lib/data/provinces';
import type { CpssPoint } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const CATEGORY_COLOR: Record<CpssPoint['category'], string> = {
  SPKLU: '#e01729',
  SPBKLU: '#0e7490',
  MOBILE: '#c88a15',
  KOMUNITAS: '#15803d',
};

const BASEMAPS = {
  terang: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  minimal: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satelit: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics',
  },
} as const;

export type BasemapKey = keyof typeof BASEMAPS;

/** Batas wilayah Indonesia (Sabang–Merauke) untuk tampilan awal. */
const INDONESIA_BOUNDS = L.latLngBounds([-11.2, 94.7], [6.5, 141.2]);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

function markerIcon(point: CpssPoint, active: boolean) {
  const color = CATEGORY_COLOR[point.category];
  const size = active ? 40 : 30;
  return L.divIcon({
    className: 'cpss-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:grid;place-items:center">
        ${active ? `<span style="position:absolute;inset:0;border-radius:999px;background:${color};opacity:.28;animation:pulse-ring 2.4s cubic-bezier(.22,1,.36,1) infinite"></span>` : ''}
        <span style="position:absolute;inset:0;border-radius:999px;background:${color};opacity:.16"></span>
        <span style="position:relative;width:${active ? 18 : 14}px;height:${active ? 18 : 14}px;border-radius:999px;background:${color};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(7,26,54,.45)"></span>
      </div>`,
  });
}

function popupHtml(p: CpssPoint) {
  const color = CATEGORY_COLOR[p.category];
  return `
    <div style="font-family:var(--font-sans)">
      <div style="background:linear-gradient(135deg,#0e2a52,#071a36);padding:14px 16px;color:#fff">
        <div style="display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${color === '#e01729' ? '#ff9da4' : '#f5c451'}">
          <span style="width:6px;height:6px;border-radius:999px;background:${color};box-shadow:0 0 0 3px ${color}33"></span>
          ${escapeHtml(CATEGORY_SHORT[p.category])} · ${escapeHtml(p.code)}
        </div>
        <div style="margin-top:6px;font-size:15px;font-weight:800;line-height:1.3">${escapeHtml(p.name)}</div>
        <div style="margin-top:3px;font-size:11.5px;color:rgba(255,255,255,.62)">${escapeHtml(p.city)}, ${escapeHtml(provinceName(p.provinceCode))}</div>
      </div>
      <div style="padding:12px 16px 14px;background:#fff">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;font-size:11.5px">
          <div><div style="color:#7ca6de;font-weight:600">Kapasitas</div><div style="color:#0e2a52;font-weight:700">${p.capacityKw} kW</div></div>
          <div><div style="color:#7ca6de;font-weight:600">Konektor</div><div style="color:#0e2a52;font-weight:700">${p.connectors} unit</div></div>
          <div><div style="color:#7ca6de;font-weight:600">Operasional</div><div style="color:#0e2a52;font-weight:700">${escapeHtml(p.operatingHours)}</div></div>
          <div><div style="color:#7ca6de;font-weight:600">Aktif sejak</div><div style="color:#0e2a52;font-weight:700">${escapeHtml(formatDate(p.approvedAt ?? p.submittedAt))}</div></div>
        </div>
        <div style="margin-top:11px;padding-top:10px;border-top:1px solid #e2ebf8;font-size:11px;color:#496dc7">
          <strong style="color:#0e2a52">Koordinat:</strong> ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}
        </div>
        <div style="margin-top:4px;font-size:11px;color:#496dc7">
          <strong style="color:#0e2a52">Penanggung jawab:</strong> ${escapeHtml(p.picName)} · ${escapeHtml(p.picPhone)}
        </div>
      </div>
    </div>`;
}

export interface LeafletMapProps {
  points: CpssPoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  basemap?: BasemapKey;
  className?: string;
  interactive?: boolean;
}

export default function LeafletMap({
  points,
  selectedId = null,
  onSelect,
  basemap = 'terang',
  className,
  interactive = true,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Inisialisasi peta sekali.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: interactive,
      dragging: interactive,
      doubleClickZoom: interactive,
      minZoom: 4,
      maxZoom: 18,
      worldCopyJump: false,
    });

    map.fitBounds(INDONESIA_BOUNDS, { padding: [20, 20] });
    if (interactive) {
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    }

    tileRef.current = L.tileLayer(BASEMAPS[basemap].url, {
      attribution: BASEMAPS[basemap].attribution,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Leaflet perlu ukur ulang setelah container mendapat tinggi final.
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      tileRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ganti basemap.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tileRef.current?.remove();
    tileRef.current = L.tileLayer(BASEMAPS[basemap].url, {
      attribution: BASEMAPS[basemap].attribution,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    tileRef.current.bringToBack();
  }, [basemap]);

  // Sinkronkan marker dengan daftar titik.
  useEffect(() => {
    const group = layerRef.current;
    if (!group) return;
    group.clearLayers();
    markersRef.current.clear();

    points.forEach((p) => {
      if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return;
      const marker = L.marker([p.lat, p.lng], {
        icon: markerIcon(p, p.id === selectedId),
        title: p.name,
        riseOnHover: true,
      })
        .bindPopup(popupHtml(p), { closeButton: true, maxWidth: 300 })
        .on('click', () => onSelectRef.current?.(p.id));
      group.addLayer(marker);
      markersRef.current.set(p.id, marker);
    });
  }, [points, selectedId]);

  // Fokus ke titik terpilih.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const target = points.find((p) => p.id === selectedId);
    const marker = markersRef.current.get(selectedId);
    if (!target || !Number.isFinite(target.lat) || !Number.isFinite(target.lng)) return;
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 11), { duration: 0.8 });
    window.setTimeout(() => marker?.openPopup(), 850);
  }, [selectedId, points]);

  return <div ref={containerRef} className={className} role="application" aria-label="Peta titik CPSS Indonesia" />;
}

export { CATEGORY_COLOR, INDONESIA_BOUNDS };
