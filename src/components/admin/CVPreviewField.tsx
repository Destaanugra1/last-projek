'use client'

import React from 'react'
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
  if (!photo) return null
  if (typeof photo === 'string' || typeof photo === 'number') return null
  if (photo.cloudinaryUrl) return photo.cloudinaryUrl
  if (photo.url) return photo.url
  if (photo.filename) return `/api/media/file/${photo.filename}`
  return null
}

const resolveMediaDoc = (value: unknown, initialValue: unknown): PhotoValue | null => {
  if (value && typeof value === 'object') return value as PhotoValue
  if (initialValue && typeof initialValue === 'object') return initialValue as PhotoValue
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof initialValue === 'string' || typeof initialValue === 'number') return initialValue
  return null
}

export function CVPreviewField() {
  const fotoCv = useFormFields(([fields]) => fields['foto_cv'])
  const namaLengkap = useFormFields(([fields]) => fields['nama_lengkap'])

  const val = resolveMediaDoc(fotoCv?.value, fotoCv?.initialValue)
  if (!val) return null

  const url = resolveUrl(val)
  if (!url) return null

  const alt = typeof val === 'object' ? (val.alt ?? 'Foto CV') : 'Foto CV'
  const name = String(namaLengkap?.value ?? '')

  return (
    <div
      className="reporter-cv-preview"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '16px',
        marginBottom: '24px',
      }}
    >
      <p
        style={{
          color: 'var(--theme-text)',
          fontSize: '13px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: 0,
        }}
      >
        Pratinjau Dokumen CV / Resume ({name || 'Pendaftar'})
      </p>
      <a
        className="reporter-cv-preview__link"
        href={url}
        rel="noreferrer"
        target="_blank"
        style={{
          alignSelf: 'stretch',
          background: 'linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)',
          borderRadius: '16px',
          display: 'block',
          overflow: 'hidden',
          border: '1px solid rgba(11, 37, 64, 0.1)',
          boxShadow: '0 18px 40px rgba(11, 37, 64, 0.08)',
          width: '100%',
          minHeight: '420px',
          maxHeight: '80vh',
          padding: '16px',
        }}
      >
        <img
          className="reporter-cv-preview__image"
          alt={alt}
          src={url}
          style={{
            borderRadius: '12px',
            display: 'block',
            objectFit: 'contain',
            width: '100%',
            minHeight: '388px',
            maxHeight: 'calc(80vh - 32px)',
            background: '#fff',
          }}
        />
      </a>
      <p
        style={{ color: 'var(--theme-text-dim)', fontSize: '12px', margin: 0, fontStyle: 'italic' }}
      >
        Klik gambar untuk membuka ukuran penuh di tab baru.
      </p>
    </div>
  )
}
