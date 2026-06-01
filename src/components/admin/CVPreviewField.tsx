'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'

type MediaDoc = {
  id: string | number
  cloudinaryUrl?: string | null
  cloudinaryPublicId?: string | null
  cloudinaryResourceType?: 'image' | 'raw' | null
  filename?: string | null
  mimeType?: string | null
  url?: string | null
  alt?: string | null
}

type PhotoValue = string | number | MediaDoc

const resolveUrl = (photo: PhotoValue): string | null => {
  if (!photo) return null
  if (typeof photo === 'string' || typeof photo === 'number') return null
  if (photo.cloudinaryUrl) return photo.cloudinaryUrl
  if (photo.url) return photo.url
  if (photo.mimeType === 'application/pdf') return null
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

const resolveMediaId = (value: PhotoValue | null): string | number | null => {
  if (!value) return null
  if (typeof value === 'string' || typeof value === 'number') return value
  return value.id
}

export function CVPreviewField() {
  const fotoCv = useFormFields(([fields]) => fields['foto_cv'])
  const namaLengkap = useFormFields(([fields]) => fields['nama_lengkap'])
  const [resolvedDoc, setResolvedDoc] = useState<MediaDoc | null>(null)

  const val = useMemo(
    () => resolveMediaDoc(fotoCv?.value, fotoCv?.initialValue),
    [fotoCv?.initialValue, fotoCv?.value],
  )

  useEffect(() => {
    if (!val) return

    let ignore = false

    const maybeFetchMedia = async () => {
      const current = typeof val === 'object' ? val : null

      if (current && (current.cloudinaryUrl || current.url)) {
        setResolvedDoc(current)
        return
      }

      const id = typeof val === 'object' ? val.id : val

      if (!id) {
        setResolvedDoc(current)
        return
      }

      try {
        const response = await fetch(`/api/media/${id}`)
        if (!response.ok) throw new Error('Failed to fetch media')
        const doc = (await response.json()) as MediaDoc
        if (!ignore) {
          setResolvedDoc(doc)
        }
      } catch {
        if (!ignore) {
          setResolvedDoc(current)
        }
      }
    }

    void maybeFetchMedia()

    return () => {
      ignore = true
    }
  }, [val])

  if (!val) return null

  const activeDoc = typeof val === 'object' ? { ...val, ...resolvedDoc } : resolvedDoc

  const url = activeDoc ? resolveUrl(activeDoc) : null
  if (!url) return null

  const alt = activeDoc?.alt ?? 'Dokumen CV'
  const name = String(namaLengkap?.value ?? '')
  const fileName = activeDoc?.filename || 'cv-reporter.pdf'
  const mimeType = activeDoc?.mimeType || 'application/pdf'
  const mediaId = resolveMediaId(val)
  const previewUrl =
    mimeType === 'application/pdf' && mediaId ? `/api/media-preview/${mediaId}#view=FitH` : url

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
        Dokumen CV / Resume ({name || 'Pendaftar'})
      </p>
      <div
        className="reporter-cv-preview__link"
        style={{
          alignSelf: 'stretch',
          background: 'linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)',
          borderRadius: '16px',
          display: 'block',
          overflow: 'hidden',
          border: '1px solid rgba(11, 37, 64, 0.1)',
          boxShadow: '0 18px 40px rgba(11, 37, 64, 0.08)',
          width: '100%',
          minHeight: '620px',
          padding: '20px',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: '12px',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <strong
              style={{
                color: 'var(--theme-text)',
                display: 'block',
                fontSize: '15px',
                marginBottom: '4px',
              }}
            >
              {alt}
            </strong>
            <span
              style={{
                color: 'var(--theme-text-dim)',
                display: 'block',
                fontSize: '13px',
              }}
            >
              {fileName}
            </span>
            <span
              style={{
                color: 'var(--theme-text-dim)',
                display: 'block',
                fontSize: '12px',
                marginTop: '2px',
              }}
            >
              {mimeType}
            </span>
          </div>
          <a
            href={url}
            rel="noreferrer"
            target="_blank"
            style={{
              background: '#0b2540',
              borderRadius: '999px',
              color: '#fff',
              display: 'inline-flex',
              flexShrink: 0,
              fontSize: '12px',
              fontWeight: 600,
              padding: '8px 14px',
              textDecoration: 'none',
            }}
          >
            Buka Dokumen
          </a>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(11, 37, 64, 0.08)',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <iframe
            src={previewUrl}
            title={alt}
            style={{
              border: 'none',
              display: 'block',
              height: '520px',
              width: '100%',
            }}
          />
        </div>
      </div>
      <p
        style={{ color: 'var(--theme-text-dim)', fontSize: '12px', margin: 0, fontStyle: 'italic' }}
      >
        Jika pratinjau tidak muncul, gunakan tombol Buka Dokumen untuk membuka PDF di tab baru.
      </p>
    </div>
  )
}
