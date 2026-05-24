import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    defaultColumns: ['fullName', 'email', 'role', 'verifiedVolunteer'],
    useAsTitle: 'fullName',
  },
  access: {
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
  },
  auth: true,
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'reporter',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Reporter', value: 'reporter' },
      ],
      required: true,
      saveToJWT: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Nomor Telepon',
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Organisasi / Departemen',
    },
    {
      name: 'avatarUrl',
      type: 'text',
      label: 'Foto Profil (URL)',
      admin: { readOnly: true },
    },
    {
      name: 'avatarPublicId',
      type: 'text',
      admin: { hidden: true, readOnly: true },
    },
    {
      name: 'verifiedVolunteer',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'points',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
  ],
}
