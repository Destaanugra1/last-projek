import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    defaultColumns: ['name', 'website', 'updatedAt'],
    useAsTitle: 'name',
    description: 'Daftar partner/institusi yang dipercayai (untuk ditampilkan di halaman home)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Partner',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
      admin: {
        description: 'Upload logo partner (SVG atau PNG dengan background transparan)',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
      admin: {
        description: 'Link website partner (opsional)',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Urutan',
      admin: {
        description: 'Urutan tampilan (semakin kecil semakin awal)',
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktif',
      admin: {
        description: 'Tampilkan di halaman home',
        position: 'sidebar',
      },
    },
  ],
}
