import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/getPayloadClient'
import type { Media } from '@/payload-types'

const sanitizeFilename = (value: string) => value.replace(/[^\w.\-]+/g, '-')

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayloadClient()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const media = (await payload.findByID({
    collection: 'media',
    id,
    overrideAccess: true,
  })) as Media

  if (!media?.cloudinaryUrl) {
    return NextResponse.json({ error: 'Media file URL not found' }, { status: 404 })
  }

  const upstream = await fetch(media.cloudinaryUrl, {
    cache: 'no-store',
  })

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Failed to load media file' }, { status: 502 })
  }

  const filename = sanitizeFilename(media.filename || `${media.alt || 'document'}.pdf`)

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Cache-Control': 'private, max-age=300',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Type': media.mimeType || upstream.headers.get('content-type') || 'application/pdf',
    },
  })
}
