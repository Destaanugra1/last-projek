-- ====================================================================
-- DDL SQL: LAUTBERSIH DATABASE ERD SCHEMA (PAYLOAD CMS + POSTGRESQL)
-- ====================================================================
-- Cara Import ke Draw.io (diagrams.net):
-- 1. Buka Draw.io (di browser atau desktop app).
-- 2. Di menu bagian atas, klik: Arrange > Insert > Advanced > SQL...
--    (Atau Bahasa Indonesia: Atur > Sisipkan > Tingkat Lanjut > SQL...)
-- 3. Salin seluruh kode DDL di bawah ini, tempelkan (paste) ke dalam box, lalu klik "Insert".
-- 4. Draw.io akan secara otomatis menggambar seluruh tabel lengkap dengan
--    garis relasi (One-to-Many / Foreign Key) antartabel secara otomatis.
-- ====================================================================

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin' | 'reporter' | 'user'
    phone VARCHAR(50),
    organization VARCHAR(255),
    avatarUrl TEXT,
    avatarPublicId VARCHAR(255),
    verifiedVolunteer BOOLEAN DEFAULT FALSE,
    points INT DEFAULT 0,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);

CREATE TABLE media (
    id VARCHAR(255) PRIMARY KEY,
    alt VARCHAR(255) NOT NULL,
    cloudinaryUrl TEXT,
    cloudinaryPublicId VARCHAR(255),
    cloudinaryResourceType VARCHAR(50), -- 'image' | 'raw'
    filename VARCHAR(255),
    mimeType VARCHAR(255),
    filesize INT,
    width INT,
    height INT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);

CREATE TABLE waste_categories (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(50) DEFAULT '#52B788' NOT NULL,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);

CREATE TABLE reports (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_review' NOT NULL, -- 'pending_review' | 'validated' | 'rejected' | 'in_progress' | 'resolved'
    severity VARCHAR(50) DEFAULT 'medium' NOT NULL, -- 'low' | 'medium' | 'critical'
    locationLabel VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    description TEXT NOT NULL,
    estimatedVolume VARCHAR(50), -- 'small' | 'medium' | 'large' | 'very_large'
    category_id VARCHAR(255),
    reporterName VARCHAR(255) NOT NULL,
    reporterEmail VARCHAR(255),
    reportedBy_id VARCHAR(255),
    submittedAt TIMESTAMP NOT NULL,
    ai_summary TEXT, -- Dari aiAnalysis.summary
    ai_confidence DECIMAL(5, 2), -- Dari aiAnalysis.confidence (skala persen)
    adminNotes TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES waste_categories(id),
    FOREIGN KEY (reportedBy_id) REFERENCES users(id)
);

-- Junction table untuk relasi Many-to-Many antara reports dan media (photos)
CREATE TABLE reports_photos (
    report_id VARCHAR(255),
    media_id VARCHAR(255),
    PRIMARY KEY (report_id, media_id),
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

CREATE TABLE reporter_applications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    no_hp VARCHAR(50) NOT NULL,
    foto_cv_id VARCHAR(255) NOT NULL,
    foto_profil_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending' | 'approved' | 'rejected'
    alasan_penolakan TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (foto_cv_id) REFERENCES media(id),
    FOREIGN KEY (foto_profil_id) REFERENCES media(id)
);

CREATE TABLE blog_posts (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    coverImage_id VARCHAR(255),
    category_id VARCHAR(255),
    sourceReport_id VARCHAR(255),
    locationLabel VARCHAR(255),
    severity VARCHAR(50), -- 'low' | 'medium' | 'critical'
    publishedAt TIMESTAMP NOT NULL,
    isAiGenerated BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    FOREIGN KEY (coverImage_id) REFERENCES media(id),
    FOREIGN KEY (category_id) REFERENCES waste_categories(id),
    FOREIGN KEY (sourceReport_id) REFERENCES reports(id)
);

CREATE TABLE partners (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_id VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    "order" INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    FOREIGN KEY (logo_id) REFERENCES media(id)
);

CREATE TABLE maintenance_pages (
    id VARCHAR(255) PRIMARY KEY,
    pageRoute VARCHAR(255) UNIQUE NOT NULL,
    isActive BOOLEAN DEFAULT FALSE,
    allowAdmins BOOLEAN DEFAULT TRUE,
    applyOnDev BOOLEAN DEFAULT FALSE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);
