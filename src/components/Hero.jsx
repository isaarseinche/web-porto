import { useEffect, useRef, useState } from 'react'
import { profil } from '../data/konten.js'
import { useDekode, useReducedMotion } from '../hooks.js'

// Satu baris nama besar; saat disentuh mouse, hurufnya "didekode" ulang.
function BarisNama({ teks, pemicu }) {
  const hasil = useDekode(teks, pemicu, 650)
  return (
    <span className="hero__baris" aria-hidden="true">
      {hasil}
    </span>
  )
}

// Efek pemindai di atas foto. Semua bagian bergerak dengan satu siklus yang sama
// (--siklus-pindai di styles.css) agar selalu selaras:
// - sinar: pita cahaya bertekstur yang hanya terlihat di atas siluet (mask = foto itu sendiri)
// - garis: garis pemindai di dalam bingkai, memudar di kedua ujung
// - rangka: 4 sudut jendela bidik yang "bernapas" dan merapat saat mengunci wajah
// - fokus: kotak fokus di wajah yang muncul saat mengunci
const maskSiluet = `url(${profil.foto}), linear-gradient(to bottom, #000 70%, transparent 98%)`
function Pemindai() {
  return (
    <div className="pindai" aria-hidden="true">
      <div
        className="pindai__tubuh"
        style={{
          maskImage: maskSiluet,
          WebkitMaskImage: maskSiluet,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <div className="pindai__jalur">
          <span className="pindai__sinar" />
        </div>
      </div>
      <div className="pindai__jalur">
        <span className="pindai__garis" />
      </div>
      <div className="pindai__rangka">
        <span className="pindai__sudut pindai__sudut--1" />
        <span className="pindai__sudut pindai__sudut--2" />
        <span className="pindai__sudut pindai__sudut--3" />
        <span className="pindai__sudut pindai__sudut--4" />
      </div>
      <span className="pindai__fokus" />
    </div>
  )
}

export default function Hero() {
  const reduced = useReducedMotion()
  const [pemicu, setPemicu] = useState(0)
  const ulang = () => !reduced && setPemicu((n) => n + 1)

  // Garis pindai di foto hanya berjalan saat hero terlihat di layar.
  const bagian = useRef(null)
  const [terlihat, setTerlihat] = useState(true)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setTerlihat(e.isIntersecting))
    io.observe(bagian.current)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={bagian}
      className={terlihat ? 'hero' : 'hero hero--diam'}
      id="atas"
      aria-labelledby="nama"
    >
      <div className="hero__teks">
        <p className="hero__status">
          <span className="titik-hidup" aria-hidden="true" />
          {profil.status}
        </p>
        <h1 className="hero__nama" id="nama" onPointerEnter={ulang}>
          <span className="sr-only">{profil.nama}</span>
          {profil.namaBaris.map((b) => (
            <BarisNama key={b} teks={b} pemicu={pemicu} />
          ))}
        </h1>
        <p className="hero__peran">{profil.peran}</p>
        <p className="hero__tagline">{profil.tagline}</p>
        <p className="hero__ringkas">{profil.ringkas}</p>
        <div className="hero__aksi">
          <a href="#proyek" className="tombol">
            Lihat proyek
          </a>
          <a href={profil.cv} className="tombol tombol--garis" download>
            Unduh CV
          </a>
        </div>
        <p className="hero__lokasi">
          {profil.lokasi}. {profil.mobilitas}.
        </p>
      </div>

      <figure className="hero__foto">
        <div className="hero__bingkai">
          <img src={profil.foto} alt={profil.fotoAlt} width="800" height="1029" fetchPriority="high" />
          <Pemindai />
        </div>
        <figcaption>{profil.fotoKeterangan}</figcaption>
      </figure>
    </section>
  )
}
