import type { GlobalConfig } from 'payload'

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  label: 'Kebijakan Privasi',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Judul Halaman',
      defaultValue: 'Kebijakan Privasi',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Konten Kebijakan Privasi',
      required: true,
    },
  ],
}
