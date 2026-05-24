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
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Only handle uploads when there's a new file
        const file = req.file
        if (!file || !file.data) return data

        try {
          const buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data)
          const result = await uploadToCloudinary(buffer, {
            folder: 'lautbersih/media',
          })
          return {
            ...data,
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
        if (!publicId) return
        try {
          await deleteFromCloudinary(publicId)
        } catch (error) {
          req.payload.logger.error(`Cloudinary delete failed: ${(error as Error).message}`)
        }
      },
    ],
  },
  upload: {
    disableLocalStorage: true,
    adminThumbnail: ({ doc }) =>
      String((doc as { cloudinaryUrl?: string }).cloudinaryUrl ?? ''),
  },
}
