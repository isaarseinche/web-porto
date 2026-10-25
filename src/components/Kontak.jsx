import { kontak, profil } from '../data/konten.js'
import { JudulBlok } from './Muncul.jsx'

export default function Kontak() {
  const tautan = [
    { label: 'Email', tampil: profil.email, href: `mailto:${profil.email}` },
    { label: 'WhatsApp', tampil: profil.whatsapp.tampil, href: profil.whatsapp.link },
    { label: 'LinkedIn', tampil: profil.linkedin.tampil, href: profil.linkedin.link },
    { label: 'CV', tampil: 'Unduh PDF', href: profil.cv, download: true },
  ]

  return (
    <section className="kontak" id="kontak" aria-labelledby="judul-kontak">
      <div className="kontak__atas">
        <JudulBlok id="judul-kontak" teks={kontak.judul} />
        <p className="kontak__teks" data-muncul>
          {kontak.teks}
        </p>
        <ul className="kontak__daftar">
          {tautan.map((t, i) => (
            <li key={t.label} data-muncul style={{ '--tunda': `${i * 90}ms` }}>
              <span className="kontak__label">{t.label}</span>
              <a
                href={t.href}
                {...(t.download ? { download: true } : {})}
                {...(t.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {t.tampil}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
