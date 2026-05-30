# LautBersih — Design Tasks (Figma MCP Agent)

**Project:** LautBersih — Platform Pelaporan Sampah Pesisir  
**Design Tool:** Figma  
**Target:** Mobile-first Web App (375px primary, 768px tablet, 1280px desktop)  
**Design Style:** Clean, modern, nature-tech — dominan warna Biru Laut (#0077B6) + Hijau Pesisir (#52B788) dengan aksen merah peringatan (#E63946)

---

## Panduan Umum untuk Agent

```

### Severity Badge Spec

```
Low      → Background: #DCFCE7  Text: #166534  Icon: 🟢
Medium   → Background: #FEF9C3  Text: #854D0E  Icon: 🟡
Critical → Background: #FEE2E2  Text: #991B1B  Icon: 🔴
```

### Status Badge Spec

```
Menunggu Review   → Background: #F1F5F9  Text: #475569
Tervalidasi       → Background: #DCFCE7  Text: #166534
Ditolak           → Background: #FEE2E2  Text: #991B1B
Dalam Penanganan  → Background: #DBEAFE  Text: #1E40AF
Selesai           → Background: #F0FDF4  Text: #14532D
```

---

## TASK GROUP 1 — Design System & Components

### TASK-DS-01: Color Styles & Typography Styles
- Buat semua warna di atas sebagai **Figma Color Styles**
- Buat semua typography di atas sebagai **Figma Text Styles**
- Naming convention: `Color/Primary`, `Typography/Heading-1`, dst.

### TASK-DS-02: Icon Set
- Gunakan icon set **Phosphor Icons** atau **Lucide** (gaya outline, stroke 1.5px)
- Icon yang dibutuhkan:
  - `location-pin`, `camera`, `upload`, `check-circle`, `x-circle`
  - `map`, `list`, `chart-bar`, `bell`, `user`, `filter`, `search`
  - `arrow-left`, `arrow-right`, `chevron-down`, `plus`, `trash`
  - `warning-circle`, `clock`, `flag`, `share`, `download`

### TASK-DS-03: Base Components
Buat komponen berikut sebagai **Figma Component** dengan variants:

**Button**
- Variants: `Primary`, `Secondary`, `Danger`, `Ghost`
- States: `Default`, `Hover`, `Disabled`, `Loading`
- Sizes: `SM (32px)`, `MD (40px)`, `LG (48px)`

**Input Field**
- Variants: `Default`, `Error`, `Success`, `Disabled`
- Types: `Text`, `Textarea`, `Search`

**Badge / Chip**
- Variants: Severity (Low/Medium/Critical), Status (5 status), Category (Plastik/Organik/B3/Campuran)

**Card Laporan (Summary)**
- Komponen kartu laporan ringkas untuk list dan peta popup
- Konten: thumbnail foto, kategori badge, severity badge, lokasi, tanggal, status badge

**Modal / Bottom Sheet**
- Variants: `Konfirmasi`, `Error`, `Form`
- Mobile: Bottom Sheet; Desktop: Centered Modal

**Navigation Bar (Mobile)**
- 4 tab: Peta, Laporan (FAB tengah), Dashboard, Profil
- FAB "Laporkan" di tengah dengan warna primary

**Top App Bar**
- Variants: `Default (Back + Title)`, `Main (Logo + Actions)`

**Progress Stepper**
- Horizontal stepper 5 langkah untuk status tracking laporan
- States: `Completed`, `Active`, `Upcoming`

**Empty State**
- Ilustrasi + headline + subtext + CTA button
- Variants: `Belum Ada Laporan`, `Tidak Ada Hasil Filter`, `Koneksi Gagal`

**Skeleton Loader**
- Skeleton untuk: Card Laporan, Halaman Detail, Dashboard Chart

---

## TASK GROUP 2 — Screens (Mobile 375px)

### TASK-SCR-01: Splash Screen & Onboarding

**Splash Screen**
- Logo LautBersih (wave + text mark)
- Background: gradient biru laut (#0077B6 → #023E8A)
- Durasi: 2 detik (animasi fade out)

**Onboarding (3 slides)**
- Slide 1: Ilustrasi peta dengan pin laporan — "Temukan Titik Pencemaran"
- Slide 2: Ilustrasi form + kamera — "Laporkan dengan Mudah"  
- Slide 3: Ilustrasi komunitas aksi — "Bersama Jaga Laut Kita"
- Navigation: dots indicator + tombol "Mulai" di slide terakhir

---

### TASK-SCR-02: Autentikasi

**Halaman Login**
- Logo + tagline
- Input email + password
- Tombol "Masuk" (Primary)
- Link "Lupa Password?"
- Divider "atau"
- Tombol "Daftar Sekarang"

**Halaman Register**
- Input: Nama Lengkap, Email, Password, Konfirmasi Password
- Tombol "Buat Akun"
- Link kembali ke Login

---

### TASK-SCR-03: Beranda — Peta Laporan Interaktif *(F03)*

**Layout:**
- Full-screen map (Leaflet placeholder sebagai rectangle abu-abu dengan grid)
- Top App Bar transparan di atas peta: Logo kiri + icon Bell + icon Search kanan
- Floating Panel Filter di bawah App Bar (horizontal scroll chip filter)
- Bottom FAB "Laporkan" di atas Navigation Bar
- Navigation Bar 4 tab di bawah

**Chip Filter (horizontal scroll):**
`Semua` | `Critical` | `Medium` | `Low` | `Plastik` | `Organik` | `B3` | `Menunggu` | `Tervalidasi`

**Marker Pin (representasi di frame):**
- Gambar contoh 3-5 marker dengan warna berbeda (Low/Medium/Critical) di atas peta placeholder

**Popup Marker (muncul saat tap marker):**
- Card kecil: thumbnail foto, kategori, severity badge, tombol "Lihat Detail"

---

### TASK-SCR-04: Form Pelaporan Sampah *(F01)*

**Layout (scrollable screen):**

Section 1 — Lokasi
- Label: "Lokasi Penemuan"
- Tombol "Gunakan Lokasi Saya" (icon GPS + Primary outline)
- Atau peta mini (160px height, Leaflet placeholder) dengan pin draggable
- Text koordinat terpilih (caption abu-abu)

Section 2 — Foto Bukti
- Label: "Foto Bukti (maks. 5 foto)"
- Grid 2 kolom upload slot (86x86px) — slot kosong dengan icon plus, slot terisi dengan thumbnail + tombol hapus
- Tap slot kosong → native file picker

Section 3 — Deskripsi
- Label: "Deskripsi Kondisi Lapangan"
- Textarea (min 120px height, placeholder: "Jelaskan kondisi sampah yang Anda temukan...")
- Counter karakter (0/500)

Section 4 — Estimasi Volume (Nice-to-Have, tetap desainkan)
- Label: "Estimasi Volume Sampah"
- Radio/Segmented: Kecil | Sedang | Besar | Sangat Besar

CTA:
- Tombol "Kirim Laporan" full-width (Primary, 48px height)

**State: Loading Submit**
- Tombol berubah jadi loading spinner + text "Mengirim..."

**State: Berhasil Submit**
- Bottom sheet konfirmasi: checkmark animasi, "Laporan Terkirim!", subtext, tombol "Lihat Laporan Saya"

---

### TASK-SCR-05: Halaman Detail Laporan *(F07)*

**Layout:**

Header:
- Back button + title "Detail Laporan"
- Share icon kanan

Section 1 — Gallery Foto
- Full-width image carousel (200px height)
- Dot indicator

Section 2 — Metadata
- Severity badge (besar, prominent)
- Kategori chip
- Baris: 📍 nama lokasi — 📅 tanggal laporan — 👤 nama pelapor

Section 3 — Hasil Analisis AI
- Card dengan background #F0FDF4
- Header: "✨ Analisis AI" 
- Teks kategori sampah hasil AI
- Teks rekomendasi aksi (bulleted)

Section 4 — Status Tracking
- Label: "Status Laporan"
- Progress Stepper 5 langkah (horizontal, scrollable jika perlu)
- Status aktif di-highlight

Section 5 — Lokasi di Peta
- Peta mini non-interaktif (140px height) dengan pin lokasi

---

### TASK-SCR-06: Riwayat Laporan *(F10)*

**Layout:**
- Top App Bar: "Laporan Saya"
- Filter tab horizontal: `Semua` | `Menunggu` | `Tervalidasi` | `Dalam Penanganan` | `Selesai`
- List kartu laporan (vertikal scroll)
  - Setiap kartu: thumbnail kiri (64x64), kanan: kategori, lokasi, tanggal, status badge
- Empty state jika belum ada laporan

---

### TASK-SCR-07: Dashboard Ringkasan *(F04)*

**Layout (scrollable):**
- Top App Bar: "Dashboard"
- Period selector: `7 Hari` | `30 Hari` | `3 Bulan` | `Semua`

Row 1 — Stat Cards (2x2 grid atau horizontal scroll):
- Total Laporan (angka besar + ikon document)
- Laporan Critical (angka + ikon warning merah)
- Tervalidasi (angka + ikon check hijau)
- Selesai Ditangani (angka + ikon flag)

Row 2 — Chart Breakdown Kategori:
- Donut chart (warna per kategori) + legend di bawah

Row 3 — Grafik Laporan per Waktu:
- Bar chart (X: tanggal, Y: jumlah laporan)
- Warna bar sesuai severity majority

Row 4 — Top Wilayah Terdampak:
- List 5 lokasi dengan jumlah laporan dan bar progress horizontal

---

### TASK-SCR-08: Profil & Pengaturan

**Layout:**
- Avatar + nama + email
- Stats: Total Laporan | Tervalidasi | Poin (jika ada gamifikasi)
- Menu list:
  - Riwayat Laporan
  - Notifikasi (Nice-to-Have)
  - Badge Saya (Nice-to-Have)
  - Bantuan & FAQ
  - Keluar

---

### TASK-SCR-09: Filter & Pencarian *(F08)*

**Layout (Bottom Sheet atau Full Screen):**
- Handle bar di atas
- Label: "Filter Laporan"
- Section: Kategori Sampah (checkbox multi-select: Plastik, Organik, B3, Campuran)
- Section: Tingkat Severity (checkbox: Low, Medium, Critical)
- Section: Status Laporan (checkbox: Menunggu, Tervalidasi, Dalam Penanganan, Selesai)
- Tombol bawah: "Reset" (Ghost) + "Terapkan Filter" (Primary)

---

### TASK-SCR-10: Notifikasi *(N01 — Nice-to-Have)*

**Layout:**
- Top App Bar: "Notifikasi"
- List notifikasi:
  - Icon kategori | Judul notif | Subtext | Waktu
  - Notif belum dibaca: background sedikit lebih gelap / dot biru
- Empty state: "Belum ada notifikasi"

---

## TASK GROUP 3 — Screens (Desktop 1280px)

### TASK-SCR-D01: Layout Dasar Desktop

- Sidebar navigasi kiri (240px): Logo, menu item (Peta, Dashboard, Laporan Saya, Profil)
- Content area kanan (1040px)
- Tidak ada bottom navigation bar

### TASK-SCR-D02: Beranda Desktop — Peta

- Sidebar kiri tetap
- Peta mengambil 65% lebar content area
- Panel kanan (35%): list laporan terbaru dengan filter
- Filter panel di atas list (inline, bukan bottom sheet)

### TASK-SCR-D03: Dashboard Desktop

- Grid 4 kolom untuk stat cards
- Chart donut dan bar chart side-by-side
- Top wilayah terdampak di bawah

### TASK-SCR-D04: Halaman Detail Laporan Desktop

- 2 kolom: kiri gallery + metadata, kanan AI analisis + status tracking + peta mini

---

## TASK GROUP 4 — Flows & Prototyping

### TASK-FLOW-01: Happy Path Flow
Buat koneksi prototype:
```
Splash → Onboarding → Login → Beranda (Peta)
  → Tap FAB → Form Pelaporan → Submit → Success Sheet → Riwayat Laporan
  → Tap laporan → Detail Laporan
```

### TASK-FLOW-02: Peta Filter Flow
```
Beranda → Tap Filter → Bottom Sheet Filter → Terapkan → Peta ter-filter
```

### TASK-FLOW-03: Status Tracking Flow
```
Riwayat Laporan → Tap laporan → Detail Laporan → Lihat progress stepper
```

---

## TASK GROUP 5 — Aset Visual

### TASK-AST-01: Ilustrasi Onboarding
- 3 ilustrasi flat vector bertema laut/lingkungan
- Gaya: outline illustration, warna pastel biru-hijau
- Ukuran: 280x280px

### TASK-AST-02: Logo & Brand Mark
- Wordmark "LautBersih" (Plus Jakarta Sans Bold)
- Icon mark: wave/ombak + droplet kombinasi
- Versi: horizontal, stacked, icon only
- Warna: Primary (#0077B6) dan White (untuk dark background)

### TASK-AST-03: Empty State Illustrations
- 3 ilustrasi kecil (200x160px) untuk empty states
- "Belum Ada Laporan", "Tidak Ditemukan", "Koneksi Gagal"

### TASK-AST-04: Map Marker Assets
- 3 custom marker pin SVG: Low (hijau), Medium (kuning), Critical (merah)
- Ukuran: 32x40px
- Format: SVG export siap pakai

---

## Catatan Prioritas Pengerjaan

```
PRIORITAS 1 (Selesaikan Duluan):
  ✅ TASK-DS-01 hingga DS-03 (Design System)
  ✅ TASK-SCR-03 (Beranda Peta)
  ✅ TASK-SCR-04 (Form Pelaporan)
  ✅ TASK-SCR-05 (Detail Laporan)

PRIORITAS 2:
  ✅ TASK-SCR-01 (Splash & Onboarding)
  ✅ TASK-SCR-02 (Auth)
  ✅ TASK-SCR-06 (Riwayat)
  ✅ TASK-SCR-07 (Dashboard)

PRIORITAS 3:
  ✅ TASK-SCR-D01 hingga D04 (Desktop)
  ✅ TASK-FLOW (Prototyping)
  ✅ TASK-AST (Aset Visual)
  ✅ Screen Nice-to-Have (Notif, Filter, Profil)
```

---

*File ini digunakan sebagai instruksi untuk Figma MCP Agent dalam menghasilkan frame, komponen, dan prototype LautBersih.*