import type { CollectionConfig } from 'payload'

const PAGE_ROUTE_OPTIONS = [
  { label: '🌐 Global (Seluruh Situs)', value: 'global' },
  { label: '🏠 Beranda (/)', value: '/' },
  { label: '🗺️ Peta Wilayah (/petawilayah)', value: '/petawilayah' },
  { label: '📋 Form Laporan (/lapor)', value: '/lapor' },
  { label: '📁 Daftar Laporan (/laporan)', value: '/laporan' },
  { label: '🤝 Komunitas (/komunitas)', value: '/komunitas' },
  { label: '📰 Berita (/berita)', value: '/berita' },
  { label: '🔔 Notifikasi (/notifikasi)', value: '/notifikasi' },
  { label: '👤 Profil (/profil)', value: '/profil' },
  { label: '🔑 Login (/login)', value: '/login' },
  { label: '📝 Daftar (/register)', value: '/register' },
  { label: '📊 Dashboard (/dashboard)', value: '/dashboard' },
  { label: '🔒 Kebijakan Privasi (/kebijakan-privasi)', value: '/kebijakan-privasi' },
  { label: '🚀 Mulai (/mulai)', value: '/mulai' },
]

export const MaintenancePages: CollectionConfig = {
  slug: 'maintenance-pages',
  labels: {
    singular: 'Halaman Pemeliharaan',
    plural: 'Manajemen Pemeliharaan',
  },
  admin: {
    useAsTitle: 'pageRoute',
    defaultColumns: ['pageRoute', 'isActive', 'applyOnDev', 'allowAdmins', 'updatedAt'],
    description:
      'Kelola halaman yang sedang dalam mode pemeliharaan. Tambahkan entri baru untuk setiap halaman yang ingin diblokir sementara.',
    listSearchableFields: ['pageRoute', 'title'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'pageRoute',
      type: 'select',
      label: 'Halaman yang Dipelihara',
      required: true,
      unique: true,
      options: PAGE_ROUTE_OPTIONS,
      admin: {
        description:
          'Pilih rute halaman yang akan diblokir. Memilih "Global" akan memblokir seluruh situs.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Aktifkan Mode Pemeliharaan',
      defaultValue: false,
      admin: {
        description:
          'Centang untuk mengaktifkan mode pemeliharaan. Biarkan tidak tercentang untuk mematikannya tanpa menghapus konfigurasi ini.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'allowAdmins',
          type: 'checkbox',
          label: 'Izinkan Admin Melewati Pemeliharaan',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'Jika aktif, pengguna dengan role Admin dapat mengakses halaman secara normal meskipun sedang dalam mode pemeliharaan.',
          },
        },
        {
          name: 'applyOnDev',
          type: 'checkbox',
          label: 'Berlaku di Lingkungan Development',
          defaultValue: false,
          admin: {
            width: '50%',
            description:
              'Secara default maintenance hanya aktif di Production. Centang ini untuk mengaktifkan maintenance di lingkungan Development/Testing juga (berguna untuk preview tampilan popup).',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Judul Popup Pemeliharaan',
      required: true,
      defaultValue: 'Halaman Sedang Dalam Pemeliharaan',
      admin: {
        description: 'Judul utama yang ditampilkan di popup overlay pemeliharaan.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Pesan & Keterangan Pemeliharaan',
      admin: {
        description:
          'Tulis pesan yang akan ditampilkan kepada pengguna. Bisa mencakup alasan pemeliharaan, estimasi waktu selesai, dsb.',
      },
    },
  ],
  timestamps: true,
}
