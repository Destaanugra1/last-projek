'use client'

import dynamic from 'next/dynamic'

const LeafletMapPicker = dynamic(
  () => import('@/components/lautbersih/LeafletMapPicker').then((m) => ({ default: m.LeafletMapPicker })),
  { ssr: false },
)

interface ReportMapViewProps {
  latitude: number
  longitude: number
}

export function ReportMapView({ latitude, longitude }: ReportMapViewProps) {
  return <LeafletMapPicker latitude={latitude} longitude={longitude} />
}
