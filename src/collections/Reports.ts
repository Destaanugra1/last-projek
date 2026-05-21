import type { Access, CollectionConfig } from 'payload'

const statusOptions = [
  {
    label: 'Menunggu Review',
    value: 'pending_review',
  },
  {
    label: 'Tervalidasi',
    value: 'validated',
  },
  {
    label: 'Ditolak',
    value: 'rejected',
  },
  {
    label: 'Dalam Penanganan',
    value: 'in_progress',
  },
  {
    label: 'Selesai',
    value: 'resolved',
  },
]

const severityOptions = [
  {
    label: 'Low',
    value: 'low',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Critical',
    value: 'critical',
  },
]

const volumeOptions = [
  {
    label: 'Kecil',
    value: 'small',
  },
  {
    label: 'Sedang',
    value: 'medium',
  },
  {
    label: 'Besar',
    value: 'large',
  },
  {
    label: 'Sangat Besar',
    value: 'very_large',
  },
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const isAdmin: Access = ({ req }) => {
  return req.user?.role === 'admin'
}

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    defaultColumns: ['title', 'status', 'severity', 'reporterName', 'updatedAt'],
    useAsTitle: 'title',
  },
  access: {
    create: () => true,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  defaultPopulate: {
    category: true,
    photos: true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data
        }

        if (!data.title && typeof data.locationLabel === 'string' && data.locationLabel.trim()) {
          data.title = `Laporan ${data.locationLabel.trim()}`
        }

        if (!data.title && typeof data.description === 'string' && data.description.trim()) {
          data.title = data.description.trim().slice(0, 72)
        }

        if (!data.slug && typeof data.title === 'string' && data.title.trim()) {
          const stamp = new Date().toISOString().slice(0, 10)
          data.slug = `${slugify(data.title)}-${stamp}`
        }

        if (!data.submittedAt) {
          data.submittedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      required: true,
    },
    {
      name: 'locationLabel',
      type: 'text',
      label: 'Lokasi',
      required: true,
    },
    {
      name: 'latitude',
      type: 'number',
      required: true,
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'photos',
      type: 'relationship',
      hasMany: true,
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'waste-categories',
    },
    {
      name: 'severity',
      type: 'select',
      defaultValue: 'medium',
      options: severityOptions,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending_review',
      options: statusOptions,
      required: true,
    },
    {
      name: 'estimatedVolume',
      type: 'select',
      options: volumeOptions,
    },
    {
      name: 'reporterName',
      type: 'text',
      required: true,
    },
    {
      name: 'reporterEmail',
      type: 'email',
    },
    {
      name: 'reportedBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'aiAnalysis',
      type: 'group',
      fields: [
        {
          name: 'summary',
          type: 'textarea',
        },
        {
          name: 'confidence',
          type: 'number',
          min: 0,
          max: 100,
        },
        {
          name: 'recommendations',
          type: 'array',
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
    },
  ],
}
