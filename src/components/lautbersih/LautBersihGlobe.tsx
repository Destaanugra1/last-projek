'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import type { FrontendReport } from '@/lib/reports'

const World = dynamic(() => import('@/components/globe').then((m) => m.World), {
  ssr: false,
})

// Severity → color mapping for markers/arcs (bright, glowing)
const severityColor: Record<FrontendReport['severity'], string> = {
  low: '#22d3ee', // cyan — pantai bersih / aman
  medium: '#fbbf24', // amber — moderat
  critical: '#f43f5e', // rose — kritis
}

// Hub: Jakarta as the radiating center for arcs
const HUB = { lat: -6.2088, lng: 106.8456 }

export function LautBersihGlobe({ reports }: { reports: FrontendReport[] }) {
  const globeConfig = {
    pointSize: 4,
    globeColor: '#062056',
    showAtmosphere: true,
    atmosphereColor: '#ffffff',
    atmosphereAltitude: 0.1,
    emissive: '#062056',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: 'rgba(255, 255, 255, 0.7)',
    ambientLight: '#38bdf8',
    directionalLeftLight: '#ffffff',
    directionalTopLight: '#ffffff',
    pointLight: '#ffffff',
    arcTime: 1500,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: -2.5489, lng: 118.0149 },
    autoRotate: true,
    autoRotateSpeed: 0.4,
  }

  const arcs = useMemo(() => {
    const valid = reports.filter(
      (r) =>
        Number.isFinite(r.latitude) &&
        Number.isFinite(r.longitude) &&
        Math.abs(r.latitude) > 0.0001 &&
        Math.abs(r.longitude) > 0.0001,
    )

    return valid.map((report, index) => ({
      order: (index % 8) + 1,
      startLat: HUB.lat,
      startLng: HUB.lng,
      endLat: report.latitude,
      endLng: report.longitude,
      arcAlt: 0.18 + (index % 5) * 0.08,
      color: severityColor[report.severity] ?? severityColor.medium,
    }))
  }, [reports])

  // Counts for HUD
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
        <World data={arcs} globeConfig={globeConfig} />
      </div>

      <div className="lb-globe-card__legend">
        <span><i style={{ background: severityColor.low }} /> Aman</span>
        <span><i style={{ background: severityColor.medium }} /> Moderat</span>
        <span><i style={{ background: severityColor.critical }} /> Kritis</span>
      </div>
    </div>
  )
}
