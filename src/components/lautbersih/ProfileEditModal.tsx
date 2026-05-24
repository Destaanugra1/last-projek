'use client'

import Image from 'next/image'
import { useActionState, useEffect, useRef, useState } from 'react'

import { updateProfileAction } from '@/app/(frontend)/profil/actions'

type Props = {
  user: {
    fullName?: string | null
    email: string
    phone?: string | null
    organization?: string | null
    avatarUrl?: string | null
  }
}

export const ProfileEditModal = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl ?? null)
  const [state, formAction, isPending] = useActionState(updateProfileAction, { error: null })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.success) setIsOpen(false)
  }, [state.success])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatarPreview(URL.createObjectURL(file))
  }

  const initials = (user.fullName ?? user.email ?? 'U').slice(0, 2).toUpperCase()

  return (
    <>
      <button
        className="lb-profile-btn lb-profile-btn--primary"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Edit Profil
      </button>

      {isOpen && (
        <div className="lb-profile-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="lb-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lb-profile-modal__head">
              <h2>Edit Profil</h2>
              <button
                aria-label="Tutup"
                className="lb-profile-modal__close"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="lb-profile-modal__form">
              {state.error && (
                <div className="lb-auth-error" role="alert">
                  <span>!</span>
                  <p>{state.error}</p>
                </div>
              )}

              <div className="lb-profile-modal__avatar-wrap">
                <div className="lb-profile-modal__avatar">
                  {avatarPreview ? (
                    <Image alt="Foto profil" fill sizes="80px" src={avatarPreview} style={{ objectFit: 'cover' }} />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="lb-profile-modal__avatar-actions">
                  <button
                    className="lb-profile-modal__avatar-btn"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    Ganti Foto
                  </button>
                  {avatarPreview && (
                    <button
                      className="lb-profile-modal__avatar-btn lb-profile-modal__avatar-btn--remove"
                      onClick={() => {
                        setAvatarPreview(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      type="button"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <input
                  accept="image/*"
                  name="avatar"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  type="file"
                />
              </div>

              <div className="lb-auth-field">
                <label htmlFor="edit-fullName">Nama Lengkap</label>
                <input
                  defaultValue={user.fullName ?? ''}
                  id="edit-fullName"
                  name="fullName"
                  placeholder="Nama lengkap Anda"
                  required
                  type="text"
                />
              </div>

              <div className="lb-auth-field">
                <label htmlFor="edit-phone">Nomor Telepon</label>
                <input
                  defaultValue={user.phone ?? ''}
                  id="edit-phone"
                  name="phone"
                  placeholder="+62 21-555-0192"
                  type="tel"
                />
              </div>

              <div className="lb-auth-field">
                <label htmlFor="edit-organization">Organisasi / Departemen</label>
                <input
                  defaultValue={user.organization ?? ''}
                  id="edit-organization"
                  name="organization"
                  placeholder="Contoh: Dirjen Perhubungan Laut"
                  type="text"
                />
              </div>

              <div className="lb-profile-modal__actions">
                <button
                  className="lb-profile-btn lb-profile-btn--ghost"
                  disabled={isPending}
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Batal
                </button>
                <button
                  className="lb-profile-btn lb-profile-btn--primary"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
