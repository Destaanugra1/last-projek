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
      defaultValue: 'Laporkan titik pencemaran pesisir dengan cepat dan terstruktur.',
      required: true,
    },
    {
      name: 'heroDescription',
      type: 'textarea',
      defaultValue:
        'LautBersih membantu warga, relawan, dan admin memantau sebaran sampah pesisir secara real-time dengan alur validasi yang jelas.',
      required: true,
    },
    {
      name: 'statsNotice',
      type: 'text',
      defaultValue: 'Data dashboard diperbarui dari laporan yang masuk ke Payload CMS.',
    },
  ],
}
