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
    description: 'Kelola laporan pencemaran pesisir. Ubah Status Penanganan untuk memperbarui progress laporan yang terlihat oleh pelapor.',
    useAsTitle: 'title',
    listSearchableFields: ['title', 'reporterName', 'locationLabel'],
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
    /* ── PHOTO PREVIEW (sidebar) ── */
    {
      name: 'photoPreview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/PhotoPreview#PhotoPreview',
        },
      },
    },

    /* ── REVIEW PANEL (sidebar) ── */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending_review',
      label: 'Status Penanganan',
      options: statusOptions,
      required: true,
      admin: {
        description: '⬆ Ubah status ini untuk memperbarui progress laporan di halaman publik.',
        position: 'sidebar',
      },
    },
    {
      name: 'severity',
      type: 'select',
      defaultValue: 'medium',
      label: 'Tingkat Keparahan',
      options: severityOptions,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Catatan Admin',
      admin: {
        description: 'Catatan internal tim — tidak ditampilkan ke publik.',
        position: 'sidebar',
      },
    },

    /* ── MAIN FIELDS ── */
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
      admin: {
        description: 'URL-friendly identifier, di-generate otomatis.',
      },
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
      name: 'estimatedVolume',
      type: 'select',
      label: 'Estimasi Volume Sampah',
      options: volumeOptions,
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
      label: 'Kategori Sampah',
      relationTo: 'waste-categories',
    },
    {
      name: 'reporterName',
      type: 'text',
      label: 'Nama Pelapor',
      required: true,
    },
    {
      name: 'reporterEmail',
      type: 'email',
      label: 'Email Pelapor',
    },
    {
      name: 'reportedBy',
      type: 'relationship',
      label: 'Akun Pelapor',
      relationTo: 'users',
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Tanggal Laporan',
      required: true,
    },
    {
      name: 'aiAnalysis',
      type: 'group',
      label: 'Analisis AI',
      admin: {
        description: 'Hasil analisis otomatis. Admin dapat mengedit ringkasan dan rekomendasi setelah verifikasi.',
      },
      fields: [
        {
          name: 'summary',
          type: 'textarea',
          label: 'Ringkasan AI',
        },
        {
          name: 'confidence',
          type: 'number',
          label: 'Confidence Score (%)',
          min: 0,
          max: 100,
        },
        {
          name: 'recommendations',
          type: 'array',
          label: 'Rekomendasi Tindakan',
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
  ],
}
