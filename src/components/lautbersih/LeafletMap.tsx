'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCallback, useEffect, useRef } from 'react'

export type MapMarker = {
  category: string
  id: string
  latitude: number
  longitude: number
  recommendations: string[]
  severity: 'critical' | 'low' | 'medium'
  status: string
  summary: string
  title: string
}

type Props = {
  markers?: MapMarker[]
  onSelect?: (marker: MapMarker | null) => void
  selectedId?: string | null
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: '#e24b4a',
  low: '#1d9e75',
  medium: '#ef9f27',
}

const buildIcon = (severity: string, selected: boolean) => {
  const size = selected ? 22 : 14
  const pulse = severity === 'critical'

  return L.divIcon({
    className: '',
    html: `<div
      class="lb-map-dot lb-map-dot--${severity}${selected ? ' lb-map-dot--selected' : ''}${pulse ? ' lb-map-dot--pulse' : ''}"
      style="width:${size}px;height:${size}px;"
    ></div>`,
    iconAnchor: [size / 2, size / 2],
    iconSize: [size, size],
  })
}

export const LeafletMap = ({ markers = [], onSelect, selectedId }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)

  const handleSelect = useCallback(
    (marker: MapMarker) => {
      onSelect?.(marker)
    },
    [onSelect],
  )

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = L.map(containerRef.current, {
      center: [-2.5, 118.0],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    })

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, attribution: 'Tiles © Esri — GEBCO, NOAA, National Geographic' },
    ).addTo(map)

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, opacity: 0.9 },
    ).addTo(map)

    L.control.attribution({ position: 'bottomright', prefix: '' }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    map.on('click', () => onSelect?.(null))

    return () => {
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    layer.clearLayers()

    markers.forEach((marker) => {
      if (!marker.latitude || !marker.longitude) return

      const icon = buildIcon(marker.severity, selectedId === marker.id)

      const m = L.marker([marker.latitude, marker.longitude], { icon })

      m.bindTooltip(
        `<div class="lb-map-tooltip-inner"><strong>${marker.title}</strong><span>${marker.category || marker.severity}</span></div>`,
        { className: 'lb-map-tooltip', direction: 'top', offset: [0, -10] },
      )

      m.on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        handleSelect(marker)
      })

      m.addTo(layer)
    })
  }, [markers, selectedId, handleSelect])

  return (
    <div ref={containerRef} style={{ height: '100%', position: 'relative', width: '100%' }} />
  )
}
