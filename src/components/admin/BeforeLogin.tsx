'use client'

import React from 'react'

export default function BeforeLogin() {
  return (
    <div className="lb-admin-login-hero">
      <div className="lb-admin-login-hero__brand">
        <svg
          className="lb-admin-login-hero__logo"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="20" fill="#0B2540" />
          <path
            d="M10 26c2-4 6-6 10-6s8 2 10 6"
            stroke="#1D9E75"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M8 22c3-6 8-9 12-9s9 3 12 9"
            stroke="#3ECFA5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="14" r="2.5" fill="#1D9E75" />
        </svg>
        <div className="lb-admin-login-hero__text">
          <h1>LautBersih</h1>
          <p>Admin Panel</p>
        </div>
      </div>
      <p className="lb-admin-login-hero__desc">
        Platform pelaporan sampah pesisir berbasis komunitas.
        Masuk untuk mengelola data, laporan, dan pengaturan situs.
      </p>
    </div>
  )
}
