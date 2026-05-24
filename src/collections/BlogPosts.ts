import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    defaultColumns: ['title', 'publishedAt', 'sourceReport', 'updatedAt'],
    description: 'Artikel berita yang di-generate otomatis dari laporan pencemaran. Bisa diedit dan dipublikasi oleh admin.',
    useAsTitle: 'title',
  },
  access: {
    create: () => true,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul Artikel',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      label: 'Slug URL',
      unique: true,
      required: true,
      admin: {
        description: 'Di-generate otomatis dari judul dan tanggal.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Ringkasan',
      admin: {
        description: 'Tampil di halaman daftar berita.',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Isi Artikel (HTML)',
      required: true,
      admin: {
        description: 'Di-generate otomatis sebagai HTML. Admin bisa mengedit langsung.',
      },
    },
    {
      name: 'coverImage',
      type: 'relationship',
      label: 'Foto Utama',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Kategori Sampah',
      relationTo: 'waste-categories',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sourceReport',
      type: 'relationship',
      label: 'Laporan Asal',
      relationTo: 'reports',
      admin: {
        position: 'sidebar',
        description: 'Laporan yang men-trigger pembuatan artikel ini.',
      },
    },
    {
      name: 'locationLabel',
      type: 'text',
      label: 'Lokasi',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'severity',
      type: 'select',
      label: 'Tingkat Keparahan',
      options: [
        { label: 'Rendah', value: 'low' },
        { label: 'Moderat', value: 'medium' },
        { label: 'Kritis', value: 'critical' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Tanggal Publikasi',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isAiGenerated',
      type: 'checkbox',
      label: 'Di-generate oleh AI',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Tandai jika artikel ini dibuat otomatis oleh AI.',
      },
    },
  ],
}
