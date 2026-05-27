import type { GlobalConfig } from 'payload'

export const ReporterRegistration: GlobalConfig = {
  slug: 'reporter-registration',
  label: 'Registrasi Reporter (Stepper)',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'steps',
      type: 'array',
      label: 'Langkah-Langkah (Steps)',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Judul Langkah',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Konten (Teks, Ketentuan)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Gambar Ilustrasi',
        },
      ],
    },
  ],
}
