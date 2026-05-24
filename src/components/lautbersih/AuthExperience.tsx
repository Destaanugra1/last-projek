'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'

import { loginAction, registerAction } from '@/app/(frontend)/auth/actions'

export const AuthExperience = ({ mode }: { mode: 'login' | 'register' }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, { error: null })
  const [registerState, registerFormAction, registerPending] = useActionState(registerAction, {
    error: null,
  })

  if (mode === 'login') {
    return (
      <div className="lb-auth-page">
        <main className="lb-auth-page__main lb-auth-page__main--centered">
          <div className="lb-auth-split">
            <section className="lb-auth-brand-panel lb-auth-brand-panel--login">
              <div className="lb-auth-brand-panel__overlay" />
              <div className="lb-auth-brand-panel__content">
                <div className="lb-auth-brand-panel__top">
                  <span className="lb-auth-brand-panel__mark">L</span>
                  <h1>LautBersih</h1>
                </div>

                <div>
                  <div className="lb-auth-badge">SDG 14 · Life Below Water</div>
                  <h2>Penjaga Ekosistem Maritim Nusantara.</h2>
                  <p>
                    Sistem terintegrasi untuk pemantauan kualitas air, regulasi lalu lintas laut,
                    dan pelestarian keanekaragaman hayati bawah air.
                  </p>
                </div>

                <div className="lb-auth-brand-panel__footer">
                  <span>OTORITAS MARITIM NASIONAL</span>
                  <i />
                  <span>VERSI 4.2.0</span>
                </div>
              </div>
            </section>

            <section className="lb-auth-form-panel">
              <div className="lb-auth-mobile-brand">
                <span className="lb-auth-brand-panel__mark">L</span>
                <h1>LautBersih</h1>
              </div>

              <div className="lb-auth-form-wrap">
                <header className="lb-auth-form-wrap__header">
                  <h2>Masuk ke Sistem Otoritas</h2>
                  <p>Gunakan kredensial resmi untuk mengakses panel kendali maritim.</p>
                </header>

                <form action={loginFormAction} className="lb-auth-form">
                  {loginState.error && (
                    <div className="lb-auth-error" role="alert">
                      <span>!</span>
                      <p>{loginState.error}</p>
                    </div>
                  )}

                  <div className="lb-auth-field">
                    <label htmlFor="login-email">Email atau ID Petugas</label>
                    <div className="lb-auth-field__input-wrap">
                      <span className="lb-auth-field__icon">ID</span>
                      <input
                        id="login-email"
                        name="email"
                        placeholder="contoh@lautbersih.go.id"
                        required
                        type="email"
                      />
                    </div>
                  </div>

                  <div className="lb-auth-field">
                    <div className="lb-auth-field__header">
                      <label htmlFor="login-password">Kata Sandi</label>
                    </div>
                    <div className="lb-auth-field__input-wrap">
                      <span className="lb-auth-field__icon">•</span>
                      <input
                        id="login-password"
                        name="password"
                        placeholder="••••••••"
                        required
                        type={showPassword ? 'text' : 'password'}
                      />
                      <button
                        className="lb-auth-field__toggle"
                        onClick={() => setShowPassword((v) => !v)}
                        type="button"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <button
                    className="lb-auth-submit lb-auth-submit--secondary"
                    disabled={loginPending}
                    type="submit"
                  >
                    {loginPending ? 'Memproses...' : 'MASUK SEKARANG'}
                    {!loginPending && <span>→</span>}
                  </button>

                  <div className="lb-auth-switch">
                    <p>
                      Belum punya akses? <Link href="/register">Daftar di sini</Link>
                    </p>
                  </div>
                </form>

                <div className="lb-auth-notice lb-auth-notice--dark ">
                  <span>i</span>
                  <p className='text-black'>
                    Akses ini dipantau oleh Otoritas Keamanan Siber Nasional. Pastikan Anda masuk
                    menggunakan perangkat resmi yang telah terdaftar.
                  </p>
                </div>
              </div>

              <div className="lb-auth-mobile-copy">© 2024 LautBersih Maritime Authority</div>
            </section>
          </div>
        </main>

        <footer className="lb-auth-footer">
          <div className="lb-auth-footer__inner">
            <p>© 2024 LautBersih Maritime Authority. All rights reserved.</p>
            <div>
              <Link href="/">Beranda</Link>
              <Link href="/register">Daftar Akun</Link>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="lb-auth-page">
      <header className="lb-auth-topnav">
        <nav className="lb-auth-topnav__inner">
          <Link className="lb-auth-topnav__brand" href="/">
            LautBersih
          </Link>
          <div className="lb-auth-topnav__links">
            <Link href="/">Main Website</Link>
            <Link href="/login">Masuk</Link>
          </div>
        </nav>
      </header>

      <main className="lb-auth-page__main">
        <div className="lb-auth-register-shell">
          <section className="lb-auth-register-brand">
            <div className="lb-auth-register-brand__texture" />
            <div className="lb-auth-register-brand__content">
              <div>
                <div className="lb-auth-badge">SDG 14 · Life Below Water</div>
                <h2>Melindungi Kedaulatan &amp; Ekosistem Maritim Nasional.</h2>
                <p>
                  Bergabunglah dengan jaringan resmi otoritas maritim untuk memantau, melaporkan,
                  dan menjaga kebersihan laut kita.
                </p>
              </div>

              <div className="lb-auth-notice lb-auth-notice--dark-solid">
                <span>✓</span>
                <div>
                  <strong>Status Verifikasi</strong>
                  <p>
                    Setiap pendaftaran diproses melalui protokol enkripsi standar otoritas maritim
                    untuk menjamin integritas data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="lb-auth-register-form-panel">
            <div className="lb-auth-form-wrap__header lb-auth-form-wrap__header--register">
              <h2>Daftar Akun Otoritas</h2>
              <p>Masukkan rincian kredensial dinas Anda di bawah ini.</p>
            </div>

            <form action={registerFormAction} className="lb-auth-form">
              {registerState.error && (
                <div className="lb-auth-error" role="alert">
                  <span>!</span>
                  <p>{registerState.error}</p>
                </div>
              )}

              <div className="lb-auth-field">
                <label htmlFor="register-name">Nama Lengkap</label>
                <input
                  id="register-name"
                  name="fullName"
                  placeholder="Contoh: Adm. Budi Santoso"
                  required
                  type="text"
                />
              </div>

              <div className="lb-auth-field">
                <label htmlFor="register-email">Email Kedinasan</label>
                <input
                  id="register-email"
                  name="email"
                  placeholder="nama@instansi.go.id"
                  required
                  type="email"
                />
              </div>

              <div className="lb-auth-field">
                <label htmlFor="register-role">Role / Jabatan</label>
                <div className="lb-auth-field__input-wrap lb-auth-field__input-wrap--select">
                  <span className="lb-auth-field__icon">◈</span>
                  <select id="register-role" name="role" defaultValue="reporter">
                    <option value="reporter">Reporter Lapangan</option>
                  </select>
                </div>
                <small>Akses admin hanya diberikan oleh administrator sistem.</small>
              </div>

              <div className="lb-auth-field">
                <label htmlFor="register-password">Kata Sandi</label>
                <div className="lb-auth-field__input-wrap lb-auth-field__input-wrap--plain">
                  <input
                    id="register-password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    className="lb-auth-field__toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    type="button"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <small>Minimal 8 karakter dengan kombinasi alfanumerik.</small>
              </div>

              <button
                className="lb-auth-submit"
                disabled={registerPending}
                type="submit"
              >
                {registerPending ? 'Mendaftarkan...' : 'Daftarkan Personel'}
                {!registerPending && <span>→</span>}
              </button>

              <div className="lb-auth-switch">
                <p>
                  Sudah memiliki akses? <Link href="/login">Masuk di sini</Link>
                </p>
              </div>
            </form>

            <div className="lb-auth-notice lb-auth-notice--warning">
              <span>!</span>
              <p>
                Penyalahgunaan akses atau pemberian informasi palsu akan diproses sesuai hukum
                maritim yang berlaku.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="lb-auth-footer">
        <div className="lb-auth-footer__inner">
          <p>© 2024 LautBersih Maritime Authority. All rights reserved.</p>
          <div>
            <Link href="/">Beranda</Link>
            <Link href="/login">Masuk</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
