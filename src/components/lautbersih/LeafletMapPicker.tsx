'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

type Props = {
  latitude?: number
  longitude?: number
  onChange?: (lat: number, lng: number) => void
}

const PIN_ICON = L.divIcon({
  className: '',
  html: `<div class="lb-map-pin"></div>`,
  iconAnchor: [10, 10],
  iconSize: [20, 20],
})

export const LeafletMapPicker = ({ latitude, longitude, onChange }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const initLat = latitude ?? -2.5
    const initLng = longitude ?? 118.0

    const map = L.map(containerRef.current, {
      center: [initLat, initLng],
      zoom: latitude ? 10 : 5,
      zoomControl: false,
      attributionControl: false,
    })

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, attribution: 'Tiles © Esri — GEBCO, NOAA' },
    ).addTo(map)

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, opacity: 0.9 },
    ).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.control.attribution({ position: 'bottomright', prefix: '' }).addTo(map)

    if (latitude && longitude) {
      markerRef.current = L.marker([latitude, longitude], { icon: PIN_ICON }).addTo(map)
    }

    map.on('click', (e) => {
      const { lat, lng } = e.latlng

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng], { icon: PIN_ICON }).addTo(map)
      }

      onChange?.(Number(lat.toFixed(6)), Number(lng.toFixed(6)))
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync marker + view when props change (e.g. user types in coordinate input)
  useEffect(() => {
    const map = mapRef.current
    if (!map || latitude === undefined || longitude === undefined) return
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude])
    } else {
      markerRef.current = L.marker([latitude, longitude], { icon: PIN_ICON }).addTo(map)
    }
    map.setView([latitude, longitude], Math.max(map.getZoom(), 10))
  }, [latitude, longitude])

  return (
    <div ref={containerRef} style={{ borderRadius: '12px', height: '100%', width: '100%' }} />
  )
}
