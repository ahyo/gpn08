'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

const PIN_HTML = `
  <div style="position:relative;width:34px;height:42px">
    <svg viewBox="0 0 34 42" width="34" height="42" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1c8 0 15 6.4 15 14.6C32 26 17 41 17 41S2 26 2 15.6C2 7.4 9 1 17 1Z"
            fill="#e01729" stroke="#fff" stroke-width="2.5"/>
      <circle cx="17" cy="15.5" r="5" fill="#fff"/>
    </svg>
  </div>`;

export interface PickerMapProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function PickerMap({
  lat,
  lng,
  onChange,
  center = [-2.5, 118],
  zoom = 4,
  className,
}: PickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      minZoom: 4,
      maxZoom: 19,
    });

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Esri, HERE, Garmin, OpenStreetMap contributors',
        maxZoom: 19,
      },
    ).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onChangeRef.current(
        Number(e.latlng.lat.toFixed(6)),
        Number(e.latlng.lng.toFixed(6)),
      );
    });

    mapRef.current = map;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sinkronkan marker dengan koordinat terpilih.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const icon = L.divIcon({
      className: 'cpss-marker',
      html: PIN_HTML,
      iconSize: [34, 42],
      iconAnchor: [17, 41],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon, draggable: true })
        .on('dragend', (e) => {
          const p = (e.target as L.Marker).getLatLng();
          onChangeRef.current(Number(p.lat.toFixed(6)), Number(p.lng.toFixed(6)));
        })
        .addTo(map);
    }
  }, [lat, lng]);

  /** Arahkan peta saat pengguna memilih provinsi. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !Number.isFinite(center[0]) || !Number.isFinite(center[1])) return;
    map.setView(center, zoom, { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="application"
      aria-label="Pilih koordinat titik CPSS pada peta"
    />
  );
}
