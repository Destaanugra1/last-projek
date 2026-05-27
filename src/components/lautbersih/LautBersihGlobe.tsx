'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import type { GlobeMarker } from '@/components/ui/3d-globe'
import type { FrontendReport } from '@/lib/reports'

const Globe3D = dynamic(() => import('@/components/ui/3d-globe').then((m) => m.Globe3D), {
  ssr: false,
  loading: () => (
    <div className="lb-globe-card__loading">
      <span>Loading Globe...</span>
    </div>
  ),
})

const FALLBACK_AVATAR = '/api/media/file/default-avatar.png'

// Severity → color mapping
const severityColor: Record<FrontendReport['severity'], string> = {
  low: '#22d3ee',
  medium: '#fbbf24',
  critical: '#f43f5e',
}

export function LautBersihGlobe({ reports }: { reports: FrontendReport[] }) {
  const markers: GlobeMarker[] = useMemo(() => {
    return reports
      .filter(
        (r) =>
          Number.isFinite(r.latitude) &&
          Number.isFinite(r.longitude) &&
          Math.abs(r.latitude) > 0.0001 &&
          Math.abs(r.longitude) > 0.0001,
      )
      .map((report) => ({
        lat: report.latitude,
        lng: report.longitude,
        src: report.photoUrls[0] || FALLBACK_AVATAR,
        label: report.locationLabel || report.title,
      }))
  }, [reports])

  const counts = useMemo(() => {
    const total = reports.length
    const critical = reports.filter((r) => r.severity === 'critical').length
    return { total, critical }
  }, [reports])

  return (
    <div className="lb-globe-card">
      <div className="lb-globe-card__hud lb-globe-card__hud--left">
        <span className="lb-globe-card__hud-dot" />
        <div>
          <strong>3D GLOBAL CORE ACTIVE</strong>
          <small>NODES ONLINE {String(counts.total).padStart(4, '0')}</small>
          <small>CRITICAL EVENTS {String(counts.critical).padStart(2, '0')}</small>
        </div>
      </div>

      <div className="lb-globe-card__hud lb-globe-card__hud--right">
        <strong>Live Maritime Map</strong>
        <small>{counts.total} laporan tervisualisasi</small>
      </div>

      <div className="lb-globe-card__canvas">
        <Globe3D
          markers={markers}
          config={{
            radius: 3.2,
            showAtmosphere: true,
            atmosphereColor: '#38bdf8',
            atmosphereIntensity: 0.7,
            atmosphereBlur: 3,
            bumpScale: 4,
            autoRotateSpeed: 0.3,
            enableZoom: false,
            enablePan: false,
            showWireframe: true,
            wireframeColor: '#38bdf8',
            backgroundColor: null,
            initialRotation: { x: 0.3, y: 2.0 },
            minDistance: 5,
            maxDistance: 14,
          }}
          className="!h-full !w-full"
        />
      </div>

      <div className="lb-globe-card__legend">
        <span><i style={{ background: severityColor.low }} /> Aman</span>
        <span><i style={{ background: severityColor.medium }} /> Moderat</span>
        <span><i style={{ background: severityColor.critical }} /> Kritis</span>
      </div>
    </div>
  )
}
