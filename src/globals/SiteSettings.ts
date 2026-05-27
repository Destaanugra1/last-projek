import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'LautBersih',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Platform pelaporan sampah pesisir berbasis komunitas',
      required: true,
    },
    {
      name: 'heroTitle',
      type: 'text',
      defaultValue: 'Otoritas Maritim untuk Ekosistem Laut Indonesia yang Berkelanjutan',
      required: true,
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      defaultValue:
        'Memantau, menganalisis, dan menindaklanjuti ancaman maritim secara real-time untuk melindungi kekayaan hayati nusantara.',
      required: true,
    },
    {
      name: 'heroBadge',
      type: 'text',
      defaultValue: 'SDG 14 · Life Below Water',
      required: true,
    },
    {
      name: 'heroPrimaryAction',
      type: 'group',
      label: 'Hero Primary Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Mulai Monitoring',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          defaultValue: '/petawilayah',
          required: true,
        },
      ],
    },
    {
      name: 'heroSecondaryAction',
      type: 'group',
      label: 'Hero Secondary Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Pelajari Protokol',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          defaultValue: '/mulai',
          required: true,
        },
      ],
    },
    {
      name: 'heroBanners',
      type: 'array',
      label: 'Hero Banners',
      admin: {
        description:
          'Unggah gambar hero dari Payload CMS. Jika jumlah gambar lebih dari 1 maka carousel aktif otomatis dengan transisi fade yang halus. Disarankan semua banner memakai rasio yang sama, misalnya 16:9 atau 1920x1080, agar posisi visual tetap konsisten.',
      },
      fields: [
        {
          name: 'image',
          admin: {
            description:
              'Gunakan gambar banner dengan rasio konsisten seperti 16:9 agar hero tidak terlihat bergeser saat carousel berganti.',
          },
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Label kecil',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Judul banner',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Deskripsi banner',
        },
      ],
      maxRows: 6,
    },
    {
      name: 'statsNotice',
      type: 'text',
      defaultValue: 'Data dashboard diperbarui dari laporan yang masuk ke Payload CMS.',
    },
  ],
}
