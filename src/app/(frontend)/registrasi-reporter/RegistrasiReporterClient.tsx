'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Stepper, { Step } from '@/components/lautbersih/Stepper'
import type { Media } from '@/payload-types'
import { Image as ImageIcon, X, CheckCircle2 } from 'lucide-react'

export type ReporterRegistrationStep = {
  title: string
  content?: unknown
  image?: Media | string | number | null
  id?: string | null
}

type StepImage = {
  cloudinaryUrl?: string | null
  url?: string | null
}

const getStepImageUrl = (image: ReporterRegistrationStep['image']) => {
  if (!image || typeof image !== 'object') return null

  const stepImage = image as StepImage
  return stepImage.cloudinaryUrl || stepImage.url || null
}

type RegistrasiReporterClientProps = {
  onClose?: () => void
  steps: ReporterRegistrationStep[]
  userId: string | number
}

export default function RegistrasiReporterClient({
  onClose,
  steps,
  userId,
}: RegistrasiReporterClientProps) {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    alamat: '',
    no_hp: '',
    foto_cv: null as File | null,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<'alamat' | 'foto_cv' | 'nama_lengkap' | 'no_hp', string>>
  >({})
  const [success, setSuccess] = useState(false)

  const setTextField = (field: 'alamat' | 'nama_lengkap' | 'no_hp', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, foto_cv: null }))
      setFieldErrors((prev) => ({ ...prev, foto_cv: 'Foto CV wajib diunggah.' }))
      return
    }

    // Validation
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Ukuran gambar maksimal 2MB.')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Hanya gambar JPG/PNG yang diperbolehkan.')
      return
    }

    setFormData((prev) => ({ ...prev, foto_cv: file }))
    setFieldErrors((prev) => ({ ...prev, foto_cv: undefined }))
  }

  const validateForm = () => {
    const trimmedData = {
      alamat: formData.alamat.trim(),
      nama_lengkap: formData.nama_lengkap.trim(),
      no_hp: formData.no_hp.trim(),
    }
    const nextErrors: typeof fieldErrors = {}

    if (!trimmedData.nama_lengkap) {
      nextErrors.nama_lengkap = 'Nama lengkap wajib diisi.'
    } else if (trimmedData.nama_lengkap.length < 3) {
      nextErrors.nama_lengkap = 'Nama lengkap minimal 3 karakter.'
    }

    if (!trimmedData.no_hp) {
      nextErrors.no_hp = 'Nomor HP wajib diisi.'
    } else if (!/^08\d{9,11}$/.test(trimmedData.no_hp)) {
      nextErrors.no_hp = 'Nomor HP harus diawali 08 dan berjumlah 11-13 digit.'
    }

    if (!trimmedData.alamat) {
      nextErrors.alamat = 'Alamat lengkap wajib diisi.'
    } else if (trimmedData.alamat.length < 10) {
      nextErrors.alamat = 'Alamat minimal 10 karakter.'
    }

    if (!formData.foto_cv) {
      nextErrors.foto_cv = 'Foto CV wajib diunggah.'
    }

    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setError('Lengkapi semua data dengan benar sebelum mengirim pengajuan.')
      return null
    }

    return trimmedData
  }

  const handleSubmit = async () => {
    if (loading) return false

    const trimmedData = validateForm()
    if (!trimmedData || !formData.foto_cv) return false

    setLoading(true)
    setError(null)

    try {
      // Upload Foto CV
      const formDataCv = new FormData()
      formDataCv.append('file', formData.foto_cv)
      formDataCv.append('alt', `Foto CV ${trimmedData.nama_lengkap}`)

      const resCv = await fetch('/api/media', {
        method: 'POST',
        body: formDataCv,
      })
      if (!resCv.ok) throw new Error('Gagal mengunggah foto CV')
      const dataCv = await resCv.json()

      // Submit Application
      const applicationData = {
        user: userId,
        nama_lengkap: trimmedData.nama_lengkap,
        alamat: trimmedData.alamat,
        no_hp: trimmedData.no_hp,
        foto_cv: dataCv.doc.id,
        status: 'pending',
      }

      const resApp = await fetch('/api/reporter-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      })

      if (!resApp.ok) {
        const errorData = await resApp.json()
        throw new Error(errorData?.errors?.[0]?.message || 'Gagal mengirim pengajuan')
      }

      setSuccess(true)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      return false
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="lb-registration-success">
        <div className="lb-registration-success__icon">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2>Pengajuan Berhasil!</h2>
        <p>
          Terima kasih telah mendaftar. Tim kami akan meninjau pengajuan Anda dalam 1–3 hari kerja.
          Notifikasi akan dikirimkan melalui email.
        </p>
        {onClose ? (
          <button type="button" className="lb-register-modal__primary" onClick={onClose}>
            Tutup
          </button>
        ) : (
          <Link href="/" className="lb-register-modal__primary">
            Kembali ke Beranda
          </Link>
        )}
      </div>
    )
  }

  return (
    <Stepper
      initialStep={1}
      onFinalStepCompleted={handleSubmit}
      backButtonText="Kembali"
      nextButtonText="Lanjutkan"
      disableStepIndicators={false}
      nextButtonProps={{
        disabled: loading,
      }}
      stepCircleContainerClassName="lb-registration-card"
      stepContainerClassName="lb-registration-steps"
      contentClassName="lb-registration-content"
      footerClassName="lb-registration-footer"
    >
      {/* 1. CMS Steps */}
      {steps.map((step, idx) => {
        const imageUrl = getStepImageUrl(step.image)

        return (
          <Step key={step.id || idx}>
            {imageUrl && (
              <div className="mb-4 rounded-[16px] overflow-hidden max-h-40 relative aspect-[21/9] w-full bg-[#f3f7fc] border border-[#edf3fb] shadow-sm">
                <img
                  src={imageUrl}
                  alt={step.title}
                  className="object-cover absolute inset-0 w-full h-full"
                />
              </div>
            )}

            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#0b2540] tracking-tight">
              {step.title}
            </h2>

            {Boolean(step.content) && (
              <div className="prose prose-sm text-[#516070] max-w-none">
                <p>
                  Mohon baca dan pahami panduan serta tanggung jawab sebagai reporter LautBersih
                  sebelum melanjutkan ke proses pengisian data diri.
                </p>
              </div>
            )}
          </Step>
        )
      })}

      {/* 2. Registration Form Step */}
      <Step>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#0b2540] tracking-tight mb-1">
            Data Diri Reporter
          </h2>
          <p className="text-sm text-[#516070]">Lengkapi data singkat untuk verifikasi profil.</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-[#991b1b] bg-[#fee2e2] border border-[#fca5a5] rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#112032]">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 border border-[#d1d9e2] rounded-lg bg-white text-sm text-[#112032] focus:outline-none focus:border-[#1d9e75] focus:ring-4 focus:ring-[#1d9e75]/10 transition-all"
                value={formData.nama_lengkap}
                onChange={(e) => setTextField('nama_lengkap', e.target.value)}
                placeholder="Masukkan nama lengkap"
                aria-invalid={Boolean(fieldErrors.nama_lengkap)}
              />
              {fieldErrors.nama_lengkap && (
                <p className="mt-1 text-xs font-medium text-[#b42318]">
                  {fieldErrors.nama_lengkap}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-[#112032]">
                Nomor HP / WhatsApp
              </label>
              <input
                type="text"
                required
                pattern="^08[0-9]{9,11}$"
                title="Nomor HP harus diawali dengan 08 dan memiliki panjang 11-13 digit"
                className="w-full p-2.5 border border-[#d1d9e2] rounded-lg bg-white text-sm text-[#112032] focus:outline-none focus:border-[#1d9e75] focus:ring-4 focus:ring-[#1d9e75]/10 transition-all"
                value={formData.no_hp}
                onChange={(e) => setTextField('no_hp', e.target.value)}
                placeholder="cth: 081234567890"
                aria-invalid={Boolean(fieldErrors.no_hp)}
              />
              {fieldErrors.no_hp && (
                <p className="mt-1 text-xs font-medium text-[#b42318]">{fieldErrors.no_hp}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-[#112032]">
              Alamat Lengkap
            </label>
            <textarea
              required
              rows={2}
              className="w-full p-2.5 border border-[#d1d9e2] rounded-lg bg-white text-sm text-[#112032] focus:outline-none focus:border-[#1d9e75] focus:ring-4 focus:ring-[#1d9e75]/10 transition-all resize-none"
              value={formData.alamat}
              onChange={(e) => setTextField('alamat', e.target.value)}
              placeholder="Tuliskan alamat domisili lengkap Anda"
              aria-invalid={Boolean(fieldErrors.alamat)}
            ></textarea>
            {fieldErrors.alamat && (
              <p className="mt-1 text-xs font-medium text-[#b42318]">{fieldErrors.alamat}</p>
            )}
          </div>

          <div className="pt-1">
            <label className="block text-sm font-semibold mb-1.5 text-[#112032]">Foto CV</label>
            <ImageDropzone
              accept="image/jpeg, image/png, image/jpg"
              maxSize="2MB"
              file={formData.foto_cv}
              onChange={handleFileChange}
              emptyText="Foto CV / resume"
            />
            {fieldErrors.foto_cv && (
              <p className="mt-1 text-xs font-medium text-[#b42318]">{fieldErrors.foto_cv}</p>
            )}
          </div>

          {loading && (
            <div className="pt-4 flex items-center justify-center text-[#1d9e75] font-medium text-sm">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1d9e75]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sedang memproses pengajuan...
            </div>
          )}
        </form>
      </Step>
    </Stepper>
  )
}

function ImageDropzone({
  accept,
  maxSize,
  file,
  onChange,
  emptyText,
}: {
  accept: string
  maxSize: string
  file: File | null
  onChange: (f: File | null) => void
  emptyText: string
}) {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true)
    else if (e.type === 'dragleave') setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0])
    }
  }

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-3 transition-colors flex flex-col items-center justify-center text-center cursor-pointer min-h-[118px]
        ${isDragActive ? 'border-[#1d9e75] bg-[#1d9e75]/5' : file ? 'border-[#edf3fb] bg-[#f9fbfe]' : 'border-[#d1d9e2] bg-[#f9fbfe] hover:bg-[#edf3fb]'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
    >
      <input
        type="file"
        className="hidden"
        accept={accept}
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) onChange(e.target.files[0])
        }}
      />

      {file ? (
        <div className="flex flex-col items-center justify-center w-full z-10">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview gambar yang dipilih"
              className="mb-2 h-16 w-16 rounded-xl border border-[#edf3fb] object-cover shadow-sm"
            />
          )}
          <p className="text-sm font-medium text-[#112032] truncate max-w-[180px]">{file.name}</p>
          <p className="text-xs text-[#516070] mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
            }}
            className="mt-2 text-xs font-semibold text-[#e24b4a] hover:text-[#991b1b] flex items-center bg-[#fee2e2] hover:bg-[#fca5a5]/30 px-3 py-1.5 rounded-full transition"
          >
            <X className="w-3 h-3 mr-1" /> Ganti Foto
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center pointer-events-none">
          <div className="w-9 h-9 bg-white shadow-sm rounded-full flex items-center justify-center mb-2 text-[#516070]">
            <ImageIcon className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-[#112032] mb-1">
            <span className="text-[#1d9e75]">Klik</span> pilih gambar
          </p>
          <p className="text-xs text-[#516070]">{emptyText}</p>
          <p className="text-[10px] text-[#516070] mt-1 uppercase font-medium">
            JPG/PNG • MAX {maxSize}
          </p>
        </div>
      )}
    </div>
  )
}
