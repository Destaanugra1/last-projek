# LautBersih 🌊
**Platform Pelaporan & Analisis Sampah Laut Berbasis Komunitas & AI**

*Proyek Akhir (Final Project) Program Kampus Merdeka MSIB Batch 6 - Studi Independen: AI & Web Development + UI/UX Design*

---

## 📌 Deskripsi Proyek
**LautBersih** adalah platform berbasis web responsif yang dirancang untuk mengatasi krisis pencemaran sampah plastik dan limbah laut di wilayah pesisir Indonesia (dengan studi kasus utama di Teluk Lampung). Platform ini mengadopsi pendekatan *community science* (sains berbasis komunitas) yang memungkinkan nelayan, relawan lingkungan, dan masyarakat pesisir untuk melaporkan temuan akumulasi sampah laut secara real-time dan akurat.

Dengan mengintegrasikan **Artificial Intelligence (Google Gemini 2.5 Flash)** melalui Server Actions Next.js, setiap laporan yang diunggah akan dianalisis secara instan untuk:
1. **Mengklasifikasikan kategori sampah** (misalnya Sampah Plastik sekali pakai, Alat Tangkap/Jaring Rusak, Limbah Industri, Organik, atau Tumpahan Minyak).
2. **Menilai tingkat kedaruratan (*severity level*)** secara objektif (Low, Medium, Critical) berdasarkan analisis visual foto dan deskripsi teks.
3. **Memformulasikan rekomendasi aksi mitigasi** yang aman bagi pelapor maupun komunitas (mis. penanganan langsung oleh komunitas atau eskalasi darurat ke dinas kebersihan terkait jika terindikasi bahan berbahaya B3).

Sistem ini memotong rantai birokrasi pelaporan manual tradisional yang lambat, memberikan validasi visual digital awal untuk menyaring laporan palsu (*spam*), serta mempermudah Dinas Lingkungan Hidup dan NGO lokal melakukan koordinasi pembersihan (*cleanup action*) secara efisien dan tepat sasaran.

---

## 👥 Profil Kelompok
Proyek ini dikembangkan oleh Kelompok yang beranggotakan:
* **Althaf Syafiq Rianto**
* **Desta Anugra Pratama**
* **Adisya Ainun Fatihah**
* **Achmad Suhendar**

---

## 🚀 Fitur Utama (MVP Core & Nice-to-Have)
* 🗺️ **Peta Interaktif Pesisir (Leaflet.js)**: Menyajikan peta sebaran spasial laporan pencemaran dengan penanda pin berwarna dinamis sesuai tingkat keparahan (*Hijau: Low*, *Kuning: Medium*, *Merah: Critical*), lengkap dengan filter kategori sampah dan pencarian lokasi.
* 🧠 **Multimodal AI Analysis (Gemini 2.5 Flash)**: Engine analisis cerdas yang mendeteksi keaslian foto laporan secara instan, mengekstrak ringkasan kondisi, dan mengembalikan data terstruktur (Structured Output JSON) berupa kategori, tingkat keparahan, serta instruksi keselamatan khusus.
* 📋 **Form Pelaporan Cerdas**: Pengguna dapat menentukan lokasi laporan dengan memanfaatkan titik koordinat GPS otomatis atau penunjuk manual peta (*coordinate picker*), mengunggah bukti foto, serta mengisi deskripsi tumpukan sampah.
* 📊 **Dashboard Ringkasan & Metrik Analitik**: Halaman statistika makro yang memvisualisasikan total laporan aktif, jumlah kasus kritis, status penyelesaian laporan, grafik breakdown kategori sampah, serta area yang paling terdampak.
* 🛠️ **Admin Panel & Moderasi (Payload CMS)**: Konsol back-office bagi tim internal atau dinas terkait untuk memoderasi data masuk (persetujuan/penolakan laporan), mengedit rekomendasi aksi, serta melacak progres penanganan sampah (*Status Tracking: Menunggu Review, Tervalidasi, Ditolak, Dalam Penanganan, Selesai*).
* 👤 **Manajemen Akun & Validasi Reporter**: Sistem pendaftaran resmi bagi pelapor/relawan lapangan melalui formulir digital ([Reporter Registration](./src/app/(frontend)/registrasi-reporter/)), riwayat pengiriman laporan pribadi, serta dashboard pelapor.
* 🌐 **Visualisasi Globe 3D**: Antarmuka visual 3D Globe interaktif berbasis Three.js/Three-Globe untuk menunjukkan distribusi laporan maritim secara dinamis dan modern di halaman beranda.

---

## 🛠️ Teknologi & Arsitektur (Tech Stack)
* **Frontend & Server Framework**: Next.js v16.2.6 & React v19.2.6 (App Router, Server Actions, Server-Side Rendering)
* **Styling & UI**: Tailwind CSS v4, Lucide React (ikon), Radix UI (komponen primitif), Framer Motion & GSAP (animasi premium/micro-interactions)
* **Headless CMS**: Payload CMS v3.84.1 (ESM native, fully typed, custom admin views)
* **Database**: PostgreSQL (neon.tech Cloud Database Serverless)
* **Media Storage Cloud**: Cloudinary (diintegrasikan langsung via hook upload/delete media Payload CMS secara server-side)
* **AI Engine**: `@google/generative-ai` dengan model `gemini-2.5-flash` untuk pemrosesan multimodal yang efisien dan cepat
* **Sains Spasial**: Leaflet.js untuk pemetaan 2D responsif tanpa membebani performa browser
* **Testing Suite**: Vitest (Integration tests) & Playwright (End-to-End browser testing)

---

## 📂 Struktur Direktori Penting
Berikut adalah gambaran umum berkas-berkas kunci dalam proyek ini:
* `src/app/(frontend)/` : Berisi halaman-halaman rute aplikasi web Next.js seperti `/dashboard`, `/lapor`, `/laporan`, `/petawilayah`, `/komunitas`, `/berita`, dan sistem autentikasi (`/login`, `/register`).
* `src/app/(frontend)/lapor/analyze.ts` : Berisi Server Action yang menangani komunikasi multimodal API ke Gemini 2.5 Flash untuk analisis foto/deskripsi laporan secara real-time.
* `src/collections/` : Konfigurasi skema database & model CMS Payload:
  * [`Reports.ts`](./src/collections/Reports.ts) : Skema data laporan sampah (judul, koordinat, foto, volume, status, dan grup analisis AI).
  * [`ReporterApplications.ts`](./src/collections/ReporterApplications.ts) : Skema formulir pendaftaran akun reporter/relawan terverifikasi.
  * [`Users.ts`](./src/collections/Users.ts) : Skema data pengguna dan sistem hak akses (*roles*).
  * [`Media.ts`](./src/collections/Media.ts) : Handler file upload yang dikonfigurasi menggunakan hook Cloudinary.
  * [`WasteCategories.ts`](./src/collections/WasteCategories.ts) : Manajemen taksonomi kategori jenis sampah pesisir.
* `src/components/lautbersih/` : Komponen antarmuka kustom LautBersih seperti:
  * `MapMonitoringExperience.tsx` : Halaman monitor peta spasial interaktif.
  * `ReportFormExperience.tsx` : Alur pendaftaran laporan multi-step dengan validasi AI.
  * `LautBersihGlobe.tsx` : Komponen globe 3D modern.
* `tests/` : Kumpulan berkas pengujian sistem (Integration & E2E).

---

## ⚙️ Persiapan & Instalasi Lokal

Ikuti panduan langkah demi langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda:

### 1. Prasyarat (Prerequisites)
Pastikan komputer Anda telah terpasang:
* **Node.js** (rekomendasi versi `^18.20.2` atau `>=20.9.0`)
* Package Manager **pnpm** (versi `^9` atau `^10`)

### 2. Kloning Repositori
```bash
git clone https://github.com/Destaanugra1/last-projek.git
cd last-projek
```

### 3. Konfigurasi Environment Variables (`.env`)
Buat file konfigurasi `.env` dengan menyalin file contoh `.env.example`:
```bash
cp .env.example .env
```
Buka file `.env` yang baru dibuat dan isi variabel-variabel kredensial berikut sesuai dengan akun layanan Anda:
```env
# Koneksi Database PostgreSQL
DATABASE_URL=postgresql://username:password@your-neon-host/dbname?sslmode=require

# Kunci Keamanan Payload CMS
PAYLOAD_SECRET=ganti_dengan_rahasia_payload_acak_anda

# Konfigurasi Akun Cloudinary (Penyimpanan Foto)
CLOUDINARY_CLOUD_NAME=isi_cloud_name_cloudinary_anda
CLOUDINARY_API_KEY=isi_api_key_cloudinary_anda
CLOUDINARY_API_SECRET=isi_api_secret_cloudinary_anda

# Gemini API Key (Dapatkan di https://aistudio.google.com/)
GEMINI_API_KEY=isi_kunci_api_gemini_anda
```

### 4. Instalasi Dependensi Proyek
```bash
pnpm install
```

### 5. Menjalankan Server Pengembangan (Development Server)
Jalankan perintah di bawah ini untuk mengaktifkan server Next.js lokal:
```bash
pnpm dev
# Atau jalankan devsafe jika ingin menghapus cache build .next terlebih dahulu:
pnpm devsafe
```
Buka browser dan akses alamat berikut:
* **Aplikasi LautBersih (Frontend)**: `http://localhost:3000`
* **Admin Panel CMS (Backend)**: `http://localhost:3000/admin` (Sistem akan meminta Anda untuk membuat akun administrator pertama kali)

---

## 🧪 Menjalankan Unit & System Testing
Proyek ini dilengkapi dengan skrip uji otomatis untuk menjamin keandalan sistem sebelum diproduksi:

* **Menjalankan Seluruh Pengujian (Integration + E2E)** secara berurutan:
  ```bash
  pnpm test
  ```
* **Menjalankan Pengujian Integrasi (Vitest + jsdom)**:
  ```bash
  pnpm test:int
  ```
* **Menjalankan Pengujian End-to-End (Playwright)**:
  ```bash
  pnpm test:e2e
  ```

---

## 🌊 Dampak SDGs (Sustainable Development Goals)
Proyek LautBersih berkomitmen secara aktif untuk mendukung **SDG 14: Life Below Water**, khususnya target **14.1**: *mencegah dan secara signifikan mengurangi segala jenis polusi laut, khususnya dari aktivitas daratan, termasuk sampah laut dan polusi nutrisi pada tahun 2025*.

Dengan menyediakan platform berbasis data yang kredibel dan divalidasi oleh kecerdasan buatan, LautBersih tidak hanya mengedukasi masyarakat, melainkan mempercepat penanganan pencemaran laut Indonesia secara kolektif demi masa depan ekosistem pesisir yang bersih dan berkelanjutan.
