# Product Requirements Document
## Manajemen Role Pengguna & Registrasi Reporter

| | |
|---|---|
| **Versi** | 1.0.0 |
| **Tanggal** | 27 Mei 2026 |
| **Status** | Draft — Menunggu Review |
| **Prioritas** | High |
| **Target Sprint** | Sprint Berikutnya |
| **Platform** | Web Application |

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang & Permasalahan](#2-latar-belakang--permasalahan)
3. [Tujuan & Sasaran Produk](#3-tujuan--sasaran-produk)
4. [Definisi Role Pengguna](#4-definisi-role-pengguna)
5. [Matriks Hak Akses per Role](#5-matriks-hak-akses-per-role)
6. [Spesifikasi Perubahan UI/UX](#6-spesifikasi-perubahan-uiux)
7. [Spesifikasi Form Registrasi Reporter](#7-spesifikasi-form-registrasi-reporter)
8. [Alur Persetujuan Admin](#8-alur-persetujuan-admin)
9. [Persyaratan Teknis](#9-persyaratan-teknis)
10. [Skenario Pengujian](#10-skenario-pengujian-test-cases)
11. [Risiko & Mitigasi](#11-risiko--mitigasi)
12. [Di Luar Lingkup (Out of Scope)](#12-di-luar-lingkup-out-of-scope)
13. [Estimasi Timeline](#13-estimasi-timeline)
14. [Catatan & Pertanyaan Terbuka](#14-catatan--pertanyaan-terbuka)

---

## 1. Ringkasan Eksekutif

Dokumen ini mendefinisikan kebutuhan produk untuk pengembangan sistem manajemen role pengguna pada aplikasi web, beserta alur registrasi khusus untuk role Reporter. Update ini bertujuan memperkuat keamanan akses halaman, meningkatkan pengalaman pengguna sesuai perannya, dan menyederhanakan proses onboarding reporter baru.

Secara garis besar, update ini mencakup **empat perubahan utama**:

- Penambahan role baru bernama **User** sebagai role default saat registrasi
- Pembatasan akses halaman berdasarkan role (**Role-Based Access Control**)
- Penyembunyian navigasi/fitur yang tidak dapat diakses (**hide inaccessible features**)
- Penambahan alur dan form registrasi khusus untuk menjadi **Reporter**

---

## 2. Latar Belakang & Permasalahan

### 2.1 Kondisi Saat Ini

Sistem saat ini belum memiliki pembagian role yang granular untuk pengguna umum. Semua pengguna yang terdaftar mendapatkan akses yang sama ke seluruh halaman aplikasi, termasuk halaman **Lapor** dan **Laporan** yang seharusnya hanya dapat digunakan oleh pengguna terverifikasi dengan peran tertentu.

### 2.2 Masalah yang Dihadapi

1. Tidak ada pembatasan akses yang tepat antara pengguna umum dan reporter
2. Pengguna yang tidak berwenang dapat mengakses halaman sensitif seperti Laporan
3. Tidak ada mekanisme verifikasi sebelum seseorang dapat mengajukan laporan
4. Tidak ada jalur resmi untuk mendaftar sebagai reporter dalam sistem

### 2.3 Solusi yang Diusulkan

Memperkenalkan sistem role berbasis akses **(RBAC — Role-Based Access Control)** dengan tiga level role: **Admin**, **Reporter**, dan **User**. Role User menjadi role default untuk semua pengguna baru, dengan fitur terbatas namun tetap dapat mengakses konten publik. Pengguna yang ingin menjadi Reporter harus mengajukan permohonan melalui form registrasi khusus.

---

## 3. Tujuan & Sasaran Produk

### 3.1 Tujuan Bisnis

- Meningkatkan keamanan dan integritas data laporan dalam sistem
- Memastikan hanya pengguna terverifikasi yang dapat mengajukan dan melihat laporan
- Membuat proses menjadi reporter lebih terstruktur dan dapat diaudit
- Meningkatkan kepercayaan pengguna terhadap kualitas konten laporan

### 3.2 Tujuan Teknis

- Implementasi RBAC pada seluruh route aplikasi
- Middleware otorisasi pada setiap halaman yang memerlukan role tertentu
- Sistem notifikasi email untuk pengajuan dan persetujuan pendaftaran reporter
- Penyimpanan aman dokumen CV dalam format gambar (foto)

### 3.3 Kriteria Keberhasilan

- Role User tidak dapat mengakses halaman Lapor maupun Laporan
- Navigasi menu tersembunyi otomatis untuk fitur yang tidak dapat diakses
- Form registrasi reporter dapat diisi dan dikirim dengan validasi yang benar
- Admin dapat melihat, menyetujui, atau menolak permohonan reporter

---

## 4. Definisi Role Pengguna

### 4.1 Struktur Role

Sistem akan memiliki tiga role utama dengan hierarki akses sebagai berikut:

| Role | Diberikan Saat | Cara Mendapatkan | Keterangan |
|---|---|---|---|
| **Admin** | Ditentukan sistem | Ditambahkan manual oleh Super Admin | Akses penuh ke seluruh fitur termasuk manajemen pengguna |
| **Reporter** | Setelah pengajuan disetujui Admin | Registrasi form khusus reporter, verifikasi Admin | Dapat mengakses Lapor dan Laporan setelah diverifikasi |
| **User** *(Default)* | Saat registrasi akun baru | Otomatis saat registrasi pertama kali | Hanya akses halaman publik: Beranda, Berita, Peta Wilayah |

---

## 5. Matriks Hak Akses per Role

| Halaman / Fitur | Admin | Reporter | User (Default) |
|---|:---:|:---:|:---:|
| Beranda / Homepage | ✅ | ✅ | ✅ |
| Berita | ✅ | ✅ | ✅ |
| Peta Wilayah | ✅ | ✅ | ✅ |
| Lapor | ✅ | ✅ | ❌ |
| Laporan | ✅ | ✅ | ❌ |
| Panel Admin | ✅ | ❌ | ❌ |
| Manajemen Pengguna | ✅ | ❌ | ❌ |

### 5.1 Perilaku untuk Role User (Default)

Ketika pengguna dengan role User mencoba mengakses halaman yang dibatasi, sistem harus:

1. **Tidak menampilkan** menu navigasi untuk halaman Lapor dan Laporan sama sekali (hidden)
2. Jika pengguna mencoba akses langsung melalui URL, sistem **redirect ke halaman Beranda**
3. Menampilkan notifikasi: *"Anda tidak memiliki akses ke halaman ini. Daftar sebagai Reporter untuk mendapatkan akses."*
4. Menampilkan tombol CTA **"Daftar Sebagai Reporter"** pada notifikasi tersebut

---

## 6. Spesifikasi Perubahan UI/UX

### 6.1 Navigasi Menu — Penyesuaian Berdasarkan Role

Menu navigasi harus menyesuaikan tampilan secara dinamis berdasarkan role pengguna yang sedang login:

| Item Navigasi | Admin | Reporter | User (Default) |
|---|:---:|:---:|:---:|
| Beranda / Homepage | ✅ Tampil | ✅ Tampil | ✅ Tampil |
| Berita | ✅ Tampil | ✅ Tampil | ✅ Tampil |
| Peta Wilayah | ✅ Tampil | ✅ Tampil | ✅ Tampil |
| Lapor | ✅ Tampil | ✅ Tampil | ❌ Hidden |
| Laporan | ✅ Tampil | ✅ Tampil | ❌ Hidden |
| Panel Admin | ✅ Tampil | ❌ Hidden | ❌ Hidden |

### 6.2 Komponen CTA "Ingin Menjadi Reporter?" di Homepage

Pada halaman Beranda, ditambahkan komponen **Call-to-Action (CTA)** yang hanya ditampilkan kepada pengguna dengan role **User**. Komponen ini tidak ditampilkan kepada Reporter atau Admin.

**Spesifikasi komponen CTA:**

- **Posisi:** Di bawah banner utama atau di bagian atas konten berita
- **Judul:** `"Ingin Menjadi Reporter?"`
- **Deskripsi singkat:** *"Bergabunglah sebagai reporter dan mulai berkontribusi dalam pelaporan berita di wilayah Anda."*
- **Tombol CTA:** `"Daftar Sekarang"` — mengarahkan ke halaman `/registrasi-reporter`
- Tampilkan ikon jurnalis atau kamera sebagai ilustrasi pendukung
- Komponen **disembunyikan** jika pengguna sudah berstatus Reporter atau Admin

---

## 7. Spesifikasi Form Registrasi Reporter

### 7.1 Halaman Registrasi Reporter

**URL:** `/registrasi-reporter`

Halaman ini hanya dapat diakses oleh pengguna yang sudah login dengan role **User**:
- Pengguna yang **belum login** → redirect ke halaman login
- Pengguna yang **sudah berstatus Reporter** atau memiliki pengajuan pending → redirect ke halaman profil

### 7.2 Field Form

| Label Field | Field Name | Tipe Input | Status | Validasi |
|---|---|---|:---:|---|
| Nama Lengkap | `nama_lengkap` | Text | **Wajib** | Min. 3 karakter, maks. 100 karakter |
| Alamat Lengkap | `alamat` | Textarea | **Wajib** | Min. 10 karakter, maks. 500 karakter |
| Nomor HP / WhatsApp | `no_hp` | Text (numeric) | **Wajib** | Format: `08xxxxxxxxxx`, 11–13 digit |
| Foto Profil | `foto_profil` | Upload Gambar | **Wajib** | JPG/PNG, maks. 2MB, min. 300×300px |
| Foto CV | `foto_cv` | Upload Gambar | **Wajib** | JPG/PNG, maks. 5MB (foto scan/foto CV fisik) |

### 7.3 Spesifikasi Upload Foto CV

CV diunggah dalam format **foto (gambar)**, bukan file PDF atau dokumen. Ketentuan:

- Format yang diterima: **JPG, JPEG, PNG**
- Ukuran maksimal file: **5 MB**
- Resolusi minimum: **800×600 piksel** agar teks dalam CV dapat terbaca
- Pengguna dianjurkan untuk memotret CV fisik dengan pencahayaan yang baik, atau screenshot CV digital
- Sistem menampilkan **preview foto CV** setelah upload berhasil
- Jika kualitas foto terlalu gelap atau buram, sistem memberikan peringatan *(non-blocking)*

### 7.4 Alur Pengiriman Form

1. Pengguna mengisi semua field yang wajib diisi
2. Pengguna mengklik tombol **"Kirim Pengajuan"**
3. Sistem melakukan validasi *client-side* terlebih dahulu
4. Jika validasi lolos, sistem mengirim data ke server
5. Server menyimpan data pengajuan dengan status **"Pending"**
6. Sistem menampilkan halaman konfirmasi: *"Pengajuan berhasil dikirim! Admin akan meninjau pengajuan Anda dalam 1–3 hari kerja."*
7. Email notifikasi dikirim ke pengguna sebagai konfirmasi penerimaan pengajuan
8. Email notifikasi dikirim ke Admin untuk memberitahukan adanya pengajuan baru

---

## 8. Alur Persetujuan Admin

### 8.1 Panel Manajemen Pengajuan Reporter

Admin akan memiliki halaman khusus `/admin/pengajuan-reporter` dengan fitur:

- Daftar semua pengajuan reporter beserta status (**Pending**, **Disetujui**, **Ditolak**)
- Filter berdasarkan status dan tanggal pengajuan
- Tombol **Lihat Detail** untuk melihat data lengkap termasuk foto profil dan foto CV
- Tombol **Setujui** untuk mengubah role pengguna menjadi Reporter
- Tombol **Tolak** dengan field alasan penolakan *(wajib diisi)*

### 8.2 Notifikasi ke Pemohon

Setelah Admin mengambil keputusan, sistem mengirimkan notifikasi ke pengguna:

- **Jika Disetujui:** notifikasi pada web berisi ucapan selamat dan informasi bahwa akun kini sudah aktif sebagai Reporter
- **Jika Ditolak:** notifikasi pada web alasan penolakan dan informasi bahwa pengguna dapat mengajukan kembali

---

## 9. Persyaratan Teknis

### 9.1 Backend

- Tambah kolom `role` pada tabel `users` dengan nilai enum: `admin`, `reporter`, `user`
- Nilai default kolom `role`: `user`
- Buat tabel baru `reporter_applications` untuk menyimpan data pengajuan
- Implementasi middleware RBAC untuk setiap endpoint yang memerlukan otorisasi
- `POST /api/reporter-applications` — submit pengajuan reporter
- `GET /api/reporter-applications` — Admin melihat daftar pengajuan
- `PATCH /api/reporter-applications/:id` — approve/reject pengajuan
- Integrasi layanan email (SMTP/SendGrid) untuk notifikasi

### 9.2 Frontend

- Kondisi render navigasi menu berdasarkan role yang tersimpan di state/session
- **Guard route** untuk halaman Lapor dan Laporan — redirect jika role bukan `reporter` atau `admin`
- Komponen CTA *"Ingin Menjadi Reporter?"* dengan conditional rendering berdasarkan role
- Form registrasi reporter dengan validasi lengkap dan preview foto
- Halaman konfirmasi setelah submit form

### 9.3 Penyimpanan File

- Foto profil dan foto CV disimpan di cloud storage (S3/GCS/sejenisnya)
- Nama file di-*hash* untuk keamanan dan menghindari tabrakan nama file
- File CV hanya bisa diakses oleh Admin (private URL dengan signed token)
- Batas retensi file: 1 tahun sejak pengajuan atau sampai pengguna menghapus akun

---

## 10. Skenario Pengujian (Test Cases)

### 10.1 Pengujian Role User

| ID | Skenario | Langkah | Hasil yang Diharapkan |
|---|---|---|---|
| TC-01 | User melihat menu navigasi | Login sebagai User, lihat sidebar/navbar | Menu Lapor dan Laporan tidak muncul sama sekali |
| TC-02 | User akses `/lapor` langsung via URL | Login sebagai User, akses `/lapor` via browser | Redirect ke Beranda + tampil notifikasi tidak punya akses |
| TC-03 | User akses `/laporan` langsung via URL | Login sebagai User, akses `/laporan` via browser | Redirect ke Beranda + tampil notifikasi tidak punya akses |
| TC-04 | User lihat CTA di homepage | Login sebagai User, buka Beranda | Komponen CTA "Ingin Menjadi Reporter?" tampil |
| TC-05 | User klik tombol CTA reporter | Klik tombol "Daftar Sekarang" di CTA | Diarahkan ke halaman `/registrasi-reporter` |

### 10.2 Pengujian Form Registrasi Reporter

| ID | Skenario | Hasil yang Diharapkan |
|---|---|---|
| TC-06 | Form kosong dikirim | Semua field wajib menampilkan pesan error |
| TC-07 | Nomor HP invalid (huruf / kurang dari 11 digit) | Muncul pesan validasi format nomor HP |
| TC-08 | Upload foto CV berformat PDF | Sistem menolak: *"Hanya format gambar yang diterima"* |
| TC-09 | Upload foto CV ukuran >5MB | Sistem menolak: *"Ukuran file melebihi batas 5MB"* |
| TC-10 | Form diisi lengkap dan valid, klik kirim | Data tersimpan, muncul halaman konfirmasi, email terkirim |

---

## 11. Risiko & Mitigasi

| Risiko | Level | Mitigasi |
|---|:---:|---|
| Pengguna bypass proteksi route melalui manipulasi token | 🔴 Tinggi | Validasi role dilakukan di **server-side** (middleware API), bukan hanya di frontend |
| Kualitas foto CV buruk sehingga tidak dapat diverifikasi | 🟡 Sedang | Tambahkan panduan foto dan preview sebelum submit; Admin dapat meminta upload ulang |
| Pengguna mendaftar berkali-kali setelah ditolak | 🟢 Rendah | Batasi pengajuan baru jika ada pending; cooldown 7 hari setelah penolakan |
| Penyalahgunaan upload foto (konten tidak senonoh) | 🟡 Sedang | Validasi MIME type di server; foto CV hanya dapat dilihat Admin; moderasi manual |

---

## 12. Di Luar Lingkup (Out of Scope)

Item berikut **tidak termasuk** dalam update ini dan akan dipertimbangkan untuk iterasi berikutnya:

- Role tambahan selain Admin, Reporter, dan User
- Fitur pengguna mengubah sendiri role mereka tanpa persetujuan Admin
- Upload CV dalam format PDF atau dokumen Word
- Verifikasi identitas menggunakan KTP atau dokumen resmi pemerintah
- Fitur peringkat atau reputasi Reporter
- Integrasi dengan sistem Single Sign-On (SSO) eksternal

---
