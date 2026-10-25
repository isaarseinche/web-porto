import { useState } from 'react'
import Intro from './components/Intro.jsx'
import CahayaJejak from './components/CahayaJejak.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Tentang from './components/Tentang.jsx'
import Replay from './components/Replay.jsx'
import Proyek from './components/Proyek.jsx'
import Pengalaman from './components/Pengalaman.jsx'
import Keahlian from './components/Keahlian.jsx'
import Pendidikan from './components/Pendidikan.jsx'
import Kontak from './components/Kontak.jsx'
import Kaki from './components/Kaki.jsx'
import { useMunculBlok } from './components/Muncul.jsx'

const KUNCI = 'intro-dilihat'

// Intro hanya tampil sekali per kunjungan, dan tidak tampil jika pengunjung
// memilih "kurangi animasi". Tambahkan ?intro=1 di alamat untuk memaksa tampil.
function perluIntro() {
  if (typeof window === 'undefined') return false
  const paksa = new URLSearchParams(window.location.search).get('intro')
  if (paksa === '1') return true
  if (paksa === '0') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !sessionStorage.getItem(KUNCI)
  } catch {
    return true
  }
}

export default function App() {
  const [intro, setIntro] = useState(perluIntro)
  useMunculBlok()
  const selesaiIntro = () => {
    try {
      sessionStorage.setItem(KUNCI, '1')
    } catch {
      // penyimpanan diblokir: intro akan tampil lagi di kunjungan berikutnya
    }
    setIntro(false)
  }

  return (
    <>
      {intro && <Intro onSelesai={selesaiIntro} />}
      <a className="skip" href="#konten">
        Langsung ke konten
      </a>
      <div className="jejak" aria-hidden="true" />
      <div className="jejak jejak--nyala" aria-hidden="true" />
      <CahayaJejak />
      <Nav />
      <main id="konten">
        <Hero />
        <Tentang />
        <Replay />
        <Proyek />
        <Pengalaman />
        <Keahlian />
        <Pendidikan />
        <Kontak />
      </main>
      <Kaki />
    </>
  )
}
