'use client'

import { useFormFields } from '@payloadcms/ui'

type MediaDoc = {
  id: string | number
  cloudinaryUrl?: string | null
  url?: string | null
  filename?: string | null
  alt?: string | null
}

type PhotoValue = string | number | MediaDoc

const resolveUrl = (photo: PhotoValue): string | null => {
  if (typeof photo === 'string' || typeof photo === 'number') return null
  if (photo.cloudinaryUrl) return photo.cloudinaryUrl
  if (photo.url) return photo.url
  if (photo.filename) return `/api/media/file/${photo.filename}`
  return null
}

export function PhotoPreview() {
  const photos = useFormFields(([fields]) => fields['photos'])
  const title = useFormFields(([fields]) => fields['title'])

  const photoValues: PhotoValue[] = Array.isArray(photos?.value)
    ? (photos.value as PhotoValue[])
    : []

  const resolved = photoValues
    .map((p) => ({ url: resolveUrl(p), alt: typeof p === 'object' ? (p.alt ?? String(title?.value ?? 'Foto')) : 'Foto' }))
    .filter((p): p is { url: string; alt: string } => Boolean(p.url))

  if (resolved.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
      <p style={{ color: 'var(--theme-text)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>
        Preview Foto Laporan
      </p>
      <div style={{ display: 'grid', gap: '6px', gridTemplateColumns: resolved.length === 1 ? '1fr' : '1fr 1fr' }}>
        {resolved.map((photo, i) => (
          <a
            href={photo.url}
            key={i}
            rel="noreferrer"
            target="_blank"
            style={{
              borderRadius: '6px',
              display: 'block',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              alt={photo.alt}
              src={photo.url}
              style={{
                aspectRatio: '16 / 9',
                borderRadius: '6px',
                display: 'block',
                objectFit: 'cover',
                width: '100%',
              }}
            />
          </a>
        ))}
      </div>
      <p style={{ color: 'var(--theme-text-dim)', fontSize: '11px', margin: 0 }}>
        {resolved.length} foto · klik untuk buka
      </p>
    </div>
  )
}
