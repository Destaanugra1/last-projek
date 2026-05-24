import Link from 'next/link'

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="lb-global-footer">
      <div className="lb-global-footer__inner">
        <div className="lb-global-footer__brand">
          <div className="lb-global-footer__logo">
            <span className="lb-global-nav__mark">L</span>
            <span>LautBersih</span>
          </div>
          <p>
            Platform pemantauan dan pelaporan pencemaran pesisir berbasis komunitas untuk menjaga
            kelestarian ekosistem maritim Indonesia.
          </p>
          <div className="lb-global-footer__sdg">
            <span className="lb-auth-badge">SDG 14 · Life Below Water</span>
          </div>
        </div>

        <div className="lb-global-footer__col">
          <h4>Navigasi</h4>
          <nav>
            <Link href="/">Beranda</Link>
            <Link href="/petawilayah">Peta Wilayah</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/lapor">Buat Laporan</Link>
            <Link href="/profil">Profil Saya</Link>
          </nav>
        </div>

        <div className="lb-global-footer__col">
          <h4>Tentang</h4>
          <nav>
            <Link href="/">Misi &amp; Visi</Link>
            <Link href="/">Kebijakan Privasi</Link>
            <Link href="/">Syarat Penggunaan</Link>
            <Link href="/">Hubungi Kami</Link>
          </nav>
        </div>

        <div className="lb-global-footer__col">
          <h4>Otoritas</h4>
          <p className="lb-global-footer__authority">
            Sistem ini beroperasi di bawah kerangka Otoritas Maritim Nasional sesuai dengan
            regulasi perlindungan lingkungan laut Indonesia.
          </p>
          <div className="lb-global-footer__badge">
            <span>OTORITAS MARITIM NASIONAL</span>
          </div>
        </div>
      </div>

      <div className="lb-global-footer__bar">
        <p>© {year} LautBersih Maritime Authority. All rights reserved.</p>
        <p>Dibangun dengan komitmen terhadap pelestarian laut Indonesia.</p>
      </div>
    </footer>
  )
}
