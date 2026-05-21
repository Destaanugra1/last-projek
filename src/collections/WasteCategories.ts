import type { CollectionConfig } from 'payload'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const WasteCategories: CollectionConfig = {
  slug: 'waste-categories',
  admin: {
    defaultColumns: ['title', 'slug', 'color'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
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
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            const raw = typeof value === 'string' && value ? value : data?.title
            if (typeof raw !== 'string' || !raw.trim()) {
              return value
            }

            return slugify(raw)
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'color',
      type: 'text',
      defaultValue: '#52B788',
      required: true,
    },
  ],
}
