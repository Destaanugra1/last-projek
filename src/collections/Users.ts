import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    defaultColumns: ['fullName', 'email', 'role', 'verifiedVolunteer'],
    useAsTitle: 'fullName',
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
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Reporter',
          value: 'reporter',
        },
      ],
      required: true,
      saveToJWT: true,
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
