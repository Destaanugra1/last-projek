export const statusMeta = {
  pending_review: {
    label: 'Menunggu Review',
    tone: 'muted',
  },
  validated: {
    label: 'Tervalidasi',
    tone: 'success',
  },
  rejected: {
    label: 'Ditolak',
    tone: 'danger',
  },
  in_progress: {
    label: 'Dalam Penanganan',
    tone: 'info',
  },
  resolved: {
    label: 'Selesai',
    tone: 'success-strong',
  },
} as const

export const severityMeta = {
  low: {
    label: 'Low',
    tone: 'low',
  },
  medium: {
    label: 'Medium',
    tone: 'medium',
  },
  critical: {
    label: 'Critical',
    tone: 'critical',
  },
} as const

export const volumeLabels = {
  small: 'Kecil',
  medium: 'Sedang',
  large: 'Besar',
  very_large: 'Sangat Besar',
} as const

export const reportStatusFlow = [
  'pending_review',
  'validated',
  'in_progress',
  'resolved',
] as const

export const fallbackRecommendations = [
  'Koordinasikan pembersihan awal dengan relawan terdekat.',
  'Pisahkan sampah berbahaya sebelum proses pengangkutan.',
  'Dokumentasikan perubahan kondisi lokasi setelah penanganan.',
]
