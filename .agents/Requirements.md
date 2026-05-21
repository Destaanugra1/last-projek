# LautBersih — Product Requirements Document

**Version:** 1.0  
**Status:** Draft  
**Project:** Final Project MSIB — Platform Pelaporan Sampah Pesisir  
**Scope:** Web App (Mobile-first, Progressive Web App)

---

## 1. Overview

LautBersih adalah platform pelaporan sampah berbasis komunitas yang memungkinkan pengguna melaporkan titik pencemaran di area pesisir dan sungai secara real-time. Laporan diproses oleh AI untuk menghasilkan kategori sampah, tingkat keparahan (severity), dan rekomendasi aksi. Tim admin dapat memvalidasi laporan melalui Payload CMS, sementara pengguna dapat memantau status dan perkembangan laporan mereka.

---

## 2. User Roles

| Role | Deskripsi |
|---|---|
| **Guest** | Dapat melihat peta laporan publik dan halaman detail laporan |
| **Pelapor (User)** | Dapat submit laporan, lihat riwayat, pantau status |
| **Admin** | Dapat validasi/reject laporan, update status, kelola taksonomi via Payload CMS |

---

## 3. Core MVP Features

### F01 — Form Pelaporan Sampah

**Tujuan:** Antarmuka utama bagi pengguna untuk melaporkan temuan sampah di lapangan.

**Kebutuhan Fungsional:**
- Input lokasi via GPS otomatis (Geolocation API) atau manual picker pada peta mini (Leaflet.js)
- Field deskripsi teks bebas untuk mendeskripsikan kondisi lapangan
- Upload foto bukti (min. 1 foto, maks. 5 foto, format JPG/PNG/WEBP, maks 5MB/foto)
- Preview foto sebelum submit
- Validasi form sebelum pengiriman (semua field wajib diisi)
- Tombol submit dengan state loading dan konfirmasi berhasil

**Kebutuhan Non-Fungsional:**
- Form harus responsif dan nyaman digunakan di layar mobile
- Upload foto harus memberikan feedback progress
- Lokasi GPS harus diminta izin dengan penjelasan yang jelas

---

### F02 — AI Analisis Laporan

**Tujuan:** Engine pemrosesan latar belakang yang menganalisis laporan masuk secara otomatis.

**Kebutuhan Fungsional:**
- Ekstraksi kategori sampah dari teks deskripsi dan foto (contoh: Plastik, Organik, B3, Campuran)
- Penentuan nilai severity: `Low`, `Medium`, `Critical`
- Generasi rekomendasi aksi berdasarkan kategori dan severity
- Analisis dijalankan otomatis saat laporan masuk (background job / webhook)
- Hasil analisis ditampilkan di halaman detail laporan dan peta

**Kebutuhan Non-Fungsional:**
- Waktu pemrosesan AI < 30 detik per laporan
- Hasil analisis dapat di-override oleh admin jika tidak akurat

---

### F03 — Peta Laporan Interaktif

**Tujuan:** Visualisasi sebaran spasial seluruh laporan secara real-time.

**Kebutuhan Fungsional:**
- Peta berbasis Leaflet.js dengan tile layer OpenStreetMap
- Pin/marker berwarna dinamis sesuai severity:
  - 🟢 Hijau = Low
  - 🟡 Kuning = Medium
  - 🔴 Merah = Critical
- Klik marker membuka popup singkat (foto thumbnail, kategori, severity, tombol "Lihat Detail")
- Filter peta berdasarkan: kategori sampah, severity, status laporan, wilayah (bounding box)
- Search/cari lokasi pada peta

**Kebutuhan Non-Fungsional:**
- Peta harus dapat dimuat pada koneksi 3G
- Jumlah marker besar (>500) harus menggunakan clustering (Leaflet.markercluster)

---

### F04 — Dashboard Ringkasan

**Tujuan:** Halaman analitik makro untuk melihat gambaran besar kondisi pencemaran.

**Kebutuhan Fungsional:**
- Total laporan masuk (semua waktu dan periode tertentu)
- Breakdown kategori sampah (chart pie/donut)
- Grafik laporan per waktu (chart line/bar — harian/mingguan/bulanan)
- Daftar wilayah paling terdampak (Top 5 lokasi dengan laporan terbanyak)
- Counter laporan berdasarkan status (Menunggu, Tervalidasi, Dalam Penanganan, Selesai)

**Kebutuhan Non-Fungsional:**
- Data dashboard di-refresh setiap 5 menit atau on-demand
- Chart harus readable di layar mobile

---

### F05 — Admin Panel (Payload CMS)

**Tujuan:** Backoffice untuk moderasi dan manajemen data laporan.

**Kebutuhan Fungsional:**
- List semua laporan masuk dengan filter status dan tanggal
- Tombol aksi: Setujui (Tervalidasi), Tolak (Ditolak), Update status ke "Dalam Penanganan" atau "Selesai"
- Override hasil analisis AI (kategori dan severity)
- Manajemen taksonomi kategori sampah (CRUD)
- Manajemen akun pengguna (ban, verifikasi)

---

### F06 — Status Tracking Laporan

**Tujuan:** Memberi pengguna visibilitas penuh atas progres laporan mereka.

**Status Laporan (Flow):**
```
Menunggu Review → Tervalidasi / Ditolak → Dalam Penanganan → Selesai
```

**Kebutuhan Fungsional:**
- Status ditampilkan di setiap laporan (badge berwarna)
- Progress indicator visual (stepper/timeline) di halaman detail laporan
- Status dapat diupdate oleh admin via Payload CMS
- Pengguna dapat melihat status terkini di Riwayat Laporan mereka

---

### F07 — Halaman Detail Laporan

**Tujuan:** Tampilan lengkap satu laporan untuk pengguna dan publik.

**Konten yang Ditampilkan:**
- Foto bukti (gallery/carousel)
- Lokasi pada peta mini (non-interaktif atau interaktif terbatas)
- Kategori sampah (hasil AI)
- Tingkat severity (badge)
- Rekomendasi aksi (dari AI)
- Status laporan (progress stepper)
- Tanggal pelaporan dan nama pelapor (atau "Anonim")
- Estimasi volume sampah (jika diisi)

---

### F08 — Filter & Pencarian Peta

**Tujuan:** Memudahkan pengguna dan admin menemukan titik pencemaran yang relevan.

**Kebutuhan Fungsional:**
- Filter berdasarkan: kategori sampah (multi-select), severity (multi-select), status laporan, wilayah/area
- Filter aktif ditampilkan sebagai chip/tag yang dapat dihapus
- Reset semua filter dengan satu tombol
- Filter persisten selama sesi (tidak hilang saat navigasi)

---

### F09 — Validasi Lokasi Sederhana

**Tujuan:** Memastikan laporan relevan dengan isu sampah laut/pesisir/sungai.

**Kebutuhan Fungsional:**
- Sistem mengecek apakah koordinat laporan berada di area pesisir, sungai, atau zona relevan (menggunakan data GeoJSON atau API)
- Jika lokasi di luar area relevan, tampilkan peringatan ke pengguna (bukan hard block)
- Admin dapat override validasi lokasi

---

### F10 — Riwayat Laporan Pengguna

**Tujuan:** Pengguna dapat memantau semua laporan yang pernah mereka kirimkan.

**Kebutuhan Fungsional:**
- Daftar laporan dengan: thumbnail foto, tanggal, status badge, kategori
- Filter berdasarkan status
- Klik laporan menuju halaman detail
- Sorting: terbaru, terlama, severity tertinggi

---

## 4. Nice-to-Have Features

| Kode | Fitur | Deskripsi Singkat |
|---|---|---|
| N01 | Notifikasi Status Laporan | Push/in-app notification saat status laporan berubah |
| N02 | Badge Kontributor | Penghargaan badge untuk pelapor aktif terverifikasi |
| N03 | Share Card Laporan | Kartu publik laporan yang bisa dibagikan ke sosmed |
| N04 | Agenda Cleanup Komunitas | Buat agenda bersih pantai dari titik laporan severity tinggi |
| N05 | Heatmap Area Terdampak | Layer heatmap di atas peta untuk visualisasi konsentrasi |
| N06 | Estimasi Volume Sampah | Input manual kecil/sedang/besar/sangat besar dari pelapor |
| N07 | Leaderboard Komunitas | Papan peringkat kontributor laporan tervalidasi terbanyak |
| N08 | Template Rekomendasi Cleanup | Rekomendasi kebutuhan aksi berdasarkan kategori + severity |

---

## 5. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| CMS / Backend | Payload CMS |
| Database | PostgreSQL / MongoDB (sesuai Payload config) |
| Peta | Leaflet.js + OpenStreetMap |
| AI Engine | Claude API (Anthropic) / Gemini API |
| Storage | Cloudinary / S3-compatible (untuk foto) |
| Auth | Payload built-in auth |

---

## 6. Non-Functional Requirements

| Aspek | Target |
|---|---|
| **Performa** | First Contentful Paint < 2.5 detik (3G mobile) |
| **Responsivitas** | Mobile-first, breakpoint: 375px, 768px, 1280px |
| **Aksesibilitas** | WCAG 2.1 AA — label form, alt text, kontras warna |
| **Keamanan** | Auth JWT, rate limiting pada endpoint submit laporan |
| **Skalabilitas** | Mendukung hingga 10.000 laporan tanpa degradasi performa peta (clustering) |

---

## 7. Alur Pengguna (Happy Path)

```
Buka App
  └─> Lihat Peta Laporan Interaktif (Guest/User)
        └─> [User] Tap "Laporkan Sekarang"
              └─> Form Pelaporan
                    └─> Submit Laporan
                          └─> AI Analisis (background)
                                └─> Halaman Detail Laporan (status: Menunggu Review)
                                      └─> [Admin] Validasi via Payload
                                            └─> Status update → User notified
```

---

## 8. Definisi Severity

| Level | Kriteria |
|---|---|
| **Low** | Sampah sedikit, tidak menghalangi ekosistem, tidak berbahaya |
| **Medium** | Sampah cukup banyak, potensi dampak ekosistem jangka menengah |
| **Critical** | Sampah masif / B3 / berbahaya, butuh penanganan segera |

---

*Dokumen ini digunakan sebagai acuan desain UI/UX dan pengembangan fitur LautBersih MVP.*