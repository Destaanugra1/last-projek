import type { CollectionConfig } from 'payload'

import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/cloudinary'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['alt', 'cloudinaryUrl', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'cloudinaryUrl',
      type: 'text',
      label: 'Cloudinary URL',
      admin: {
        readOnly: true,
        description: 'URL gambar yang tersimpan di Cloudinary.',
      },
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      label: 'Cloudinary Public ID',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'cloudinaryResourceType',
      type: 'select',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Raw', value: 'raw' },
      ],
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation: _operation }) => {
        // Only handle uploads when there's a new file
        const file = req.file
        if (!file || !file.data) return data

        try {
          const buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data)
          const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image'
          const result = await uploadToCloudinary(buffer, {
            folder: 'lautbersih/media',
            resourceType,
          })
          return {
            ...data,
            cloudinaryResourceType: result.resourceType,
            cloudinaryUrl: result.url,
            cloudinaryPublicId: result.publicId,
          }
        } catch (error) {
          req.payload.logger.error(`Cloudinary upload failed: ${(error as Error).message}`)
          return data
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const publicId = (doc as { cloudinaryPublicId?: string }).cloudinaryPublicId
        const resourceType =
          (doc as { cloudinaryResourceType?: 'image' | 'raw' }).cloudinaryResourceType || 'image'
        if (!publicId) return
        try {
          await deleteFromCloudinary(publicId, resourceType)
        } catch (error) {
          req.payload.logger.error(`Cloudinary delete failed: ${(error as Error).message}`)
        }
      },
    ],
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    adminThumbnail: ({ doc }) =>
      (doc as { mimeType?: string; cloudinaryUrl?: string }).mimeType === 'application/pdf'
        ? ''
        : String((doc as { cloudinaryUrl?: string }).cloudinaryUrl ?? ''),
  },
}
