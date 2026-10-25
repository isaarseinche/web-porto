import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { intro, profil } from '../data/konten.js'
import { useHalamanDilihat } from '../hooks.js'
// Semua angka waktu ada di file ini ↓ (ubah di sana, bukan di sini).
import { DURASI, JADWAL } from '../data/waktuIntro.js'

// Urutan fase mengikuti urutan baris di JADWAL (tanpa "tutup").
const URUTAN = ['boot', ...Object.keys(JADWAL).filter((k) => k !== 'tutup')]

// Huruf yang muncul satu per satu dengan efek blur.
function Huruf({ teks, jeda = 0, mulai = 0, animasi = true }) {
  return teks.split('').map((c, i) => (
    <span
      key={i}
      className={animasi ? 'huruf' : 'huruf huruf--diam'}
      style={animasi ? { '--d': `${mulai + i * jeda}ms`, '--i': i } : undefined}
    >
      {c === ' ' ? ' ' : c}
    </span>
  ))
}

// "Halo semuanya" → "Halo, dunia". Awalan yang sama ("Halo") tetap di tempat,
// sedangkan lebar akhirannya dianimasikan sehingga "Halo" bergeser mulus.
function Sapaan({ tampil, ganti }) {
  let n = 0
  while (n < intro.sapaan1.length && intro.sapaan1[n] === intro.sapaan2[n]) n += 1
  const awalan = intro.sapaan1.slice(0, n)
  const akhiranA = intro.sapaan1.slice(n)
  const akhiranB = intro.sapaan2.slice(n)

  const ukurA = useRef(null)
  const ukurB = useRef(null)
  const [lebar, setLebar] = useState(null)
  useLayoutEffect(() => {
    const ukur = () => setLebar([ukurA.current.offsetWidth, ukurB.current.offsetWidth])
    ukur()
    document.fonts?.ready.then(ukur)
    window.addEventListener('resize', ukur)
    return () => window.removeEventListener('resize', ukur)
  }, [])

  const jeda = DURASI.jedaHurufSapa
  return (
    <p className={`intro__lapis intro__teks intro__sapa${tampil ? ' intro__lapis--tampil' : ''}`}>
      <Huruf teks={awalan} jeda={jeda} mulai={DURASI.jedaMulaiSapa} />
      <span className="intro__akhiran" style={lebar ? { width: lebar[ganti ? 1 : 0] } : undefined}>
        <span className={ganti ? 'intro__akhiran-isi intro__akhiran-isi--keluar' : 'intro__akhiran-isi'}>
          <Huruf teks={akhiranA} jeda={jeda} mulai={DURASI.jedaMulaiSapa + awalan.length * jeda} />
        </span>
        {ganti && (
          <span className="intro__akhiran-isi">
            <Huruf teks={akhiranB} jeda={jeda} mulai={DURASI.jedaMulaiDunia} />
          </span>
        )}
        {/* Salinan tak terlihat, hanya untuk mengukur lebar kedua akhiran */}
        <span ref={ukurA} className="intro__ukur">
          <Huruf teks={akhiranA} animasi={false} />
        </span>
        <span ref={ukurB} className="intro__ukur">
          <Huruf teks={akhiranB} animasi={false} />
        </span>
      </span>
    </p>
  )
}

// Foto muncul seperti sensor menangkap sinyal: piksel besar mengecil sampai tajam
// (teknik "pixelated image loading" dari Codrops), di dalam jendela yang terbuka dari tengah.
const BLOK = [44, 26, 15, 9, 5, 3]
function FotoPiksel({ aktif }) {
  const kanvas = useRef(null)
  const siap = useRef(null)

  if (!siap.current && typeof window !== 'undefined') {
    const img = new Image()
    img.src = profil.foto
    siap.current = img.decode().then(
      () => img,
      () => img,
    )
  }

  useEffect(() => {
    if (!aktif) return
    let timer = 0
    let batal = false
    siap.current.then((img) => {
      const c = kanvas.current
      if (batal || !c) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const { width, height } = c.getBoundingClientRect()
      c.width = Math.round(width * dpr)
      c.height = Math.round(height * dpr)
      const ctx = c.getContext('2d')
      const kecil = document.createElement('canvas')
      const kctx = kecil.getContext('2d')
      let i = 0
      const langkah = () => {
        ctx.clearRect(0, 0, c.width, c.height)
        if (i >= BLOK.length) {
          ctx.imageSmoothingEnabled = true
          ctx.drawImage(img, 0, 0, c.width, c.height)
          return
        }
        const b = BLOK[i] * dpr
        kecil.width = Math.max(1, Math.round(c.width / b))
        kecil.height = Math.max(1, Math.round(c.height / b))
        kctx.drawImage(img, 0, 0, kecil.width, kecil.height)
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(kecil, 0, 0, c.width, c.height)
        i += 1
        timer = setTimeout(langkah, DURASI.langkahPiksel)
      }
      langkah()
    })
    return () => {
      batal = true
      clearTimeout(timer)
    }
  }, [aktif])

  return (
    <div className={aktif ? 'intro__foto intro__foto--muncul' : 'intro__foto'}>
      <canvas ref={kanvas} />
      <span className="intro__sudut intro__sudut--1" />
      <span className="intro__sudut intro__sudut--2" />
      <span className="intro__sudut intro__sudut--3" />
      <span className="intro__sudut intro__sudut--4" />
    </div>
  )
}

export default function Intro({ onSelesai }) {
  const [fase, setFase] = useState('boot')
  const [keluar, setKeluar] = useState(false)
  const [persen, setPersen] = useState(0)
  const [baris, setBaris] = useState(0)
  const selesai = useRef(false)
  const tombol = useRef(null)
  const dilihat = useHalamanDilihat()

  // Layar intro "dihapus" ke atas, lalu website ditampilkan.
  const tutup = useCallback(() => {
    if (selesai.current) return
    selesai.current = true
    setKeluar(true)
    setTimeout(onSelesai, DURASI.tutup)
  }, [onSelesai])

  useEffect(() => {
    // Tunggu sampai halaman benar-benar tampil di layar, agar intro tidak
    // "habis diputar" saat Chrome memuatnya diam-diam lebih dulu.
    if (!dilihat) return
    const timer = Object.entries(JADWAL).map(([f, t]) =>
      setTimeout(() => (f === 'tutup' ? tutup() : !selesai.current && setFase(f)), t),
    )
    const jedaBaris = DURASI.persen / intro.boot.length
    intro.boot.forEach((_, i) => timer.push(setTimeout(() => setBaris(i + 1), 120 + i * jedaBaris)))
    let raf = 0
    let t0 = 0
    const naik = (t) => {
      if (!t0) t0 = t
      const p = Math.min(1, (t - t0) / DURASI.persen)
      setPersen(Math.round((1 - (1 - p) ** 3) * 100))
      if (p < 1) raf = requestAnimationFrame(naik)
    }
    raf = requestAnimationFrame(naik)
    return () => {
      timer.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [tutup, dilihat])

  // Kunci gulir selama intro; tombol keyboard apa pun melewati intro.
  useEffect(() => {
    const html = document.documentElement
    html.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    tombol.current?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key !== 'Tab') tutup()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [tutup])

  const sudah = (f) => URUTAN.indexOf(fase) >= URUTAN.indexOf(f)
  const antara = (masuk, keluarDi) => sudah(masuk) && !sudah(keluarDi)
  const lapis = (tampil) => (tampil ? ' intro__lapis--tampil' : '')

  const mulai = profil.nama.toLowerCase().indexOf(intro.panggilan.toLowerCase())
  const akhir = mulai + intro.panggilan.length

  // Durasi dari waktuIntro.js diteruskan ke CSS sebagai variabel.
  const gaya = {
    '--lama-huruf-masuk': `${DURASI.hurufMasuk}ms`,
    '--lama-huruf-keluar': `${DURASI.hurufKeluar}ms`,
    '--lama-huruf-lain': `${DURASI.hurufLainHilang}ms`,
    '--geser-halo': `${DURASI.geserHalo}ms`,
    '--lama-lapisan': `${DURASI.lapisanHilang}ms`,
    '--lama-buka-foto': `${DURASI.bukaFoto}ms`,
    '--lama-tutup': `${DURASI.tutup}ms`,
  }

  return (
    <div className={`intro${keluar ? ' intro--keluar' : ''}`} style={gaya} lang="en">
      <div className="intro__panggung" aria-hidden="true">
        <div className={`intro__lapis intro__boot${lapis(fase === 'boot')}`}>
          <p className="intro__persen">{persen}%</p>
          <div className="intro__bar">
            <span style={{ transform: `scaleX(${persen / 100})` }} />
          </div>
          <pre className="intro__log">
            {intro.boot.slice(0, baris).map((b) => (
              <span key={b}>
                {b}
                {'\n'}
              </span>
            ))}
          </pre>
        </div>

        {sudah('sapaMasuk') && (
          <Sapaan tampil={antara('sapaMasuk', 'sapaKeluar')} ganti={sudah('sapaGanti')} />
        )}

        {sudah('sayaMasuk') && (
          <p className={`intro__lapis intro__teks intro__saya${lapis(antara('sayaMasuk', 'sayaKeluar'))}`}>
            <Huruf teks={intro.saya} jeda={DURASI.jedaHurufSaya} />
          </p>
        )}

        {sudah('namaMasuk') && (
          <p
            className={[
              'intro__lapis intro__nama',
              lapis(antara('namaMasuk', 'besar')),
              sudah('namaSorot') ? ' intro__nama--sorot' : '',
              sudah('namaKumpul') ? ' intro__nama--kumpul' : '',
              sudah('besar') ? ' intro__nama--besar' : '',
            ].join('')}
          >
            {profil.nama.split('').map((c, i) => {
              const panggil = i >= mulai && i < akhir
              return (
                <span key={i} className={panggil ? 'intro__ch intro__ch--panggil' : 'intro__ch intro__ch--lain'}>
                  <span className="huruf" style={{ '--d': `${i * DURASI.jedaHurufNama}ms` }}>
                    {c === ' ' ? ' ' : c}
                  </span>
                </span>
              )
            })}
          </p>
        )}

        <div
          className={`intro__akhir${sudah('besar') ? ' intro__akhir--besar' : ''}${sudah('foto') ? ' intro__akhir--foto' : ''}`}
        >
          <p className="intro__raksasa">{intro.panggilan}</p>
          <FotoPiksel aktif={sudah('foto')} />
          <div className="intro__identitas">
            <span className="intro__garis" />
            <p className="intro__nama-kecil">{profil.nama}</p>
            <p className="intro__peran">{profil.peran}</p>
          </div>
        </div>
      </div>

      <button ref={tombol} type="button" className="intro__lewati" onClick={tutup}>
        {intro.tombolLewati}
      </button>
    </div>
  )
}
