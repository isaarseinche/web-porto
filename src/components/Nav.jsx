import { profil } from '../data/konten.js'

const tautan = [
  { href: '#uji', label: 'Uji 7 hari' },
  { href: '#proyek', label: 'Proyek' },
  { href: '#pengalaman', label: 'Pengalaman' },
  { href: '#keahlian', label: 'Keahlian' },
]

export default function Nav() {
  return (
    <header className="nav">
      <nav className="nav__pill" aria-label="Navigasi utama">
        <a href="#atas" className="nav__nama">
          {profil.namaPendek}
        </a>
        <ul className="nav__tautan">
          {tautan.map((t) => (
            <li key={t.href}>
              <a href={t.href}>{t.label}</a>
            </li>
          ))}
        </ul>
        <a href="#kontak" className="tombol tombol--kecil">
          Hubungi saya
        </a>
      </nav>
    </header>
  )
}
