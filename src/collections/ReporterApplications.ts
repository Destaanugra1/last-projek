import type { CollectionConfig } from 'payload'

type RelationshipId = number | string | { id?: number | string } | null | undefined

const getRelationshipId = (value: RelationshipId) => {
  if (!value) return null
  if (typeof value === 'object') return value.id ?? null
  return value
}

export const ReporterApplications: CollectionConfig = {
  slug: 'reporter-applications',
  labels: {
    singular: 'Pengajuan Reporter',
    plural: 'Pengajuan Reporter',
  },
  admin: {
    description:
      'Kelola pendaftaran reporter. Ubah status menjadi Disetujui untuk mengaktifkan role reporter pada akun user.',
    group: 'Registrasi Reporter',
    useAsTitle: 'nama_lengkap',
    defaultColumns: ['nama_lengkap', 'no_hp', 'status', 'updatedAt'],
    listSearchableFields: ['nama_lengkap', 'no_hp', 'alamat'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Akun User',
      admin: {
        description: 'Akun yang mengirim pengajuan reporter.',
        position: 'sidebar',
      },
    },
    {
      name: 'nama_lengkap',
      type: 'text',
      label: 'Nama Lengkap',
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    {
      name: 'alamat',
      type: 'textarea',
      label: 'Alamat Lengkap',
      required: true,
      minLength: 10,
      maxLength: 500,
    },
    {
      name: 'no_hp',
      type: 'text',
      label: 'Nomor HP / WhatsApp',
      required: true,
      validate: (val: string | null | undefined) => {
        if (!val) return 'Wajib diisi'
        const regex = /^08\d{9,11}$/
        if (!regex.test(val))
          return 'Format tidak valid. Harus diawali 08 dan berjumlah 11-13 digit'
        return true
      },
    },
    {
      name: 'foto_profil',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto Profil Lama',
      admin: {
        hidden: true,
        description:
          'Field lama untuk kompatibilitas data. Form baru tidak lagi meminta foto profil.',
      },
    },
    {
      name: 'foto_cv',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto CV / Resume',
      required: true,
      admin: {
        description: 'Bukti CV/resume dalam format gambar JPG atau PNG.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status Pengajuan',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
      ],
      required: true,
      admin: {
        description: 'Admin dapat menyetujui atau menolak pengajuan dari field ini.',
        position: 'sidebar',
      },
    },
    {
      name: 'alasan_penolakan',
      type: 'textarea',
      label: 'Alasan Penolakan',
      validate: (val, { siblingData }) => {
        const status = (siblingData as { status?: string } | undefined)?.status
        if (status === 'rejected' && !String(val || '').trim()) {
          return 'Alasan penolakan wajib diisi saat status Ditolak'
        }
        return true
      },
      admin: {
        description: 'Wajib diisi jika pengajuan ditolak.',
        position: 'sidebar',
        condition: (data) => data.status === 'rejected',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.status = 'pending'
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const currentDoc = doc as {
          nama_lengkap?: string | null
          no_hp?: string | null
          status?: string
          user?: RelationshipId
        }
        const previousStatus = (previousDoc as { status?: string } | undefined)?.status

        if (currentDoc.status !== 'approved' || previousStatus === 'approved') return doc

        const userId = getRelationshipId(currentDoc.user)
        if (!userId) return doc

        await req.payload.update({
          collection: 'users',
          id: userId,
          data: {
            phone: currentDoc.no_hp || undefined,
            role: 'reporter',
            verifiedVolunteer: true,
          },
          req,
        })

        return doc
      },
    ],
  },
}
