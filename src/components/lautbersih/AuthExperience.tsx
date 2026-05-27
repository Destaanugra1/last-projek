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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f3f7fc] font-sans">
      {/* Left Branding Panel */}
      <section className="w-full md:w-5/12 lg:w-1/2 bg-[#081b2e] relative overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-16 text-white min-h-[40vh] md:min-h-screen">
        {/* Background Gradient/Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#081b2e]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#183b63]/40 via-[#081b2e]/80 to-[#081b2e]" />
          <div className="absolute bottom-0 right-0 w-[120%] h-[120%] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#1d9e75]/15 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d9e75] to-[#51c3ff] text-white font-serif text-xl font-bold shadow-lg shadow-[#1d9e75]/20 group-hover:shadow-[#1d9e75]/40 transition-shadow">
              L
            </span>
            <span className="font-serif text-xl font-medium tracking-tight text-white">LautBersih</span>
          </Link>
          <Link href="/login" className="hidden md:inline-flex text-sm font-bold text-slate-300 hover:text-white transition-colors">
            Masuk →
          </Link>
        </div>

        <div className="relative z-10 mt-12 md:mt-0 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#83f5c6]/30 bg-[#83f5c6]/10 text-[#83f5c6] text-xs font-bold tracking-wider uppercase mb-6">
            SDG 14 · Life Below Water
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] mb-6 text-white">
            Melindungi Kedaulatan &amp; Ekosistem Maritim Nasional.
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
            Bergabunglah dengan jaringan resmi otoritas maritim untuk memantau, melaporkan,
            dan menjaga kebersihan laut kita.
          </p>

          <div className="bg-[#0b2540]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#1d9e75]/20 text-[#83f5c6]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Status Verifikasi</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Setiap pendaftaran diproses melalui protokol enkripsi standar otoritas maritim
                untuk menjamin integritas data.
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-12 md:mt-0 text-xs text-slate-500 font-medium tracking-wider">
          © {new Date().getFullYear()} LAUTBERSIH MARITIME AUTHORITY
        </div>
      </section>

      {/* Right Form Panel */}
      <section className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 lg:p-24 relative bg-[#f3f7fc]">
        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-serif text-[#0b2540] mb-3">Daftar Akun Otoritas</h2>
            <p className="text-slate-500 text-sm">Masukkan rincian kredensial dinas Anda di bawah ini.</p>
          </div>

          <form action={registerFormAction} className="flex flex-col gap-5">
            {registerState.error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600">
                <div className="flex-shrink-0 mt-0.5 font-bold">!</div>
                <p className="text-sm font-medium">{registerState.error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="register-name" className="text-sm font-bold text-[#0b2540]">Nama Lengkap</label>
              <input
                id="register-name"
                name="fullName"
                placeholder="Contoh: Adm. Budi Santoso"
                required
                type="text"
                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75] transition-colors shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="register-email" className="text-sm font-bold text-[#0b2540]">Email Kedinasan</label>
              <input
                id="register-email"
                name="email"
                placeholder="nama@instansi.go.id"
                required
                type="email"
                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75] transition-colors shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="register-password" className="text-sm font-bold text-[#0b2540]">Kata Sandi</label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-12 px-4 pr-16 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75] transition-colors shadow-sm"
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-[#1d9e75] uppercase tracking-wider px-2"
                  onClick={() => setShowPassword((v) => !v)}
                  type="button"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <small className="text-xs text-slate-500 mt-1">Minimal 8 karakter dengan kombinasi alfanumerik.</small>
            </div>

            <div className="mt-2">
              <button
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0b2540] to-[#183b63] hover:from-[#183b63] hover:to-[#0b2540] text-white font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={registerPending}
                type="submit"
              >
                {registerPending ? 'Mendaftarkan...' : 'Daftarkan Personel'}
                {!registerPending && <span className="text-lg leading-none">→</span>}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-slate-500">
                Sudah memiliki akses?{' '}
                <Link href="/login" className="font-bold text-[#0b2540] hover:text-[#1d9e75] transition-colors">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </form>

          {/* Warning Notice Box */}
          <div className="mt-10 p-5 rounded-2xl bg-[#081b2e] border border-[#1d9e75]/30 relative overflow-hidden shadow-lg shadow-[#081b2e]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b2540] to-[#04101d] z-0" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1d9e75]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10 flex gap-4 items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#1d9e75]/20 text-[#83f5c6] font-bold text-sm border border-[#1d9e75]/30">
                !
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                Penyalahgunaan akses atau pemberian informasi palsu akan diproses sesuai hukum maritim yang berlaku.
              </p>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  )
}
