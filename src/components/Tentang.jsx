import { useRef } from 'react'
import { tentang } from '../data/konten.js'
import { useReducedMotion, useRevealProgress } from '../hooks.js'
import { JudulBlok } from './Muncul.jsx'

// Kata-kata menyala satu per satu saat bagian ini digulir.
export default function Tentang() {
  const isi = useRef(null)
  const reduced = useReducedMotion()
  const paragraf = tentang.paragraf.map((teks) => teks.split(' '))
  const total = paragraf.reduce((n, kata) => n + kata.length, 0)
  // Dibulatkan per kata: render ulang hanya saat ada kata baru yang menyala.
  const p = useRevealProgress(isi, total)
  const menyala = reduced ? total : Math.round(p * total)
  let urutan = 0

  return (
    <section className="blok tentang" aria-labelledby="judul-tentang">
      <JudulBlok id="judul-tentang" teks={tentang.judul} />
      <div className="tentang__isi" ref={isi}>
        {paragraf.map((kata, i) => (
          <p key={i}>
            {kata.map((k, j) => {
              const nyala = urutan++ < menyala
              return (
                <span key={j} className={nyala ? 'kata kata--nyala' : 'kata'}>
                  {k}{' '}
                </span>
              )
            })}
          </p>
        ))}
      </div>
    </section>
  )
}
