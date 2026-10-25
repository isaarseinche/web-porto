import { useEffect, useRef, useState } from 'react'
import { useDekode, useReducedMotion } from '../hooks.js'

// =====================================================================
// ANIMASI MUNCUL SAAT DIGULIR. Semuanya hanya diputar SEKALI per elemen.
// - JudulBlok   : judul bagian "didekode" (huruf acak → judul asli)
// - data-muncul : blok konten terbuka dari atas ke bawah dengan garis pindai
// - AngkaNaik   : angka menghitung naik (mis. 0% → 100%)
// - FotoMuncul  : foto muncul dari piksel besar ke tajam
// Semua mati jika pengunjung memilih "kurangi animasi".
// =====================================================================

// Batas bawah pengamatan: elemen dianggap "masuk" setelah melewati 12% dari bawah layar.
const AMBANG = '0px 0px -12% 0px'

function saatTerlihat(el, panggil) {
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      panggil()
    },
    { rootMargin: AMBANG },
  )
  io.observe(el)
  return () => io.disconnect()
}

// Judul bagian yang didekode saat pertama terlihat.
export function JudulBlok({ id, teks }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [pemicu, setPemicu] = useState(0)
  useEffect(() => {
    if (reduced) return
    return saatTerlihat(ref.current, () => setPemicu(1))
  }, [reduced])
  const hasil = useDekode(teks, pemicu, 700)
  return (
    <h2 className="judul-blok" id={id} ref={ref}>
      <span className="sr-only">{teks}</span>
      <span aria-hidden="true">{hasil}</span>
    </h2>
  )
}

// Semua elemen ber-atribut data-muncul terbuka dengan sapuan pindai saat terlihat.
// Jeda berurutan bisa diatur dengan style={{ '--tunda': '120ms' }}.
export function useMunculBlok() {
  useEffect(() => {
    if (!document.documentElement.classList.contains('js-muncul')) return
    const elemen = document.querySelectorAll('[data-muncul]')
    const io = new IntersectionObserver(
      (entri) => {
        for (const e of entri) {
          if (!e.isIntersecting) continue
          const el = e.target
          io.unobserve(el)
          el.classList.add('muncul')
          // Setelah selesai, lepas mask agar elemen kembali normal sepenuhnya.
          const selesai = (ev) => {
            if (ev.target !== el) return
            el.classList.add('muncul--selesai')
            el.removeEventListener('transitionend', selesai)
          }
          el.addEventListener('transitionend', selesai)
        }
      },
      { rootMargin: AMBANG },
    )
    elemen.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// Angka yang menghitung naik saat terlihat. Teks tanpa angka ditampilkan apa adanya.
export function AngkaNaik({ teks, durasi = 900 }) {
  const cocok = /^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/.exec(teks)
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const target = cocok ? parseFloat(cocok[2].replace(',', '.')) : 0
  const desimal = cocok && /[.,]/.test(cocok[2]) ? cocok[2].split(/[.,]/)[1].length : 0
  const [nilai, setNilai] = useState(reduced || !cocok ? target : 0)

  useEffect(() => {
    if (reduced || !cocok) return
    let raf = 0
    const lepas = saatTerlihat(ref.current, () => {
      let t0 = 0
      const langkah = (t) => {
        if (!t0) t0 = t
        const k = Math.min(1, (t - t0) / durasi)
        setNilai(target * (1 - (1 - k) ** 3))
        if (k < 1) raf = requestAnimationFrame(langkah)
      }
      raf = requestAnimationFrame(langkah)
    })
    return () => {
      lepas()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, target, durasi])

  if (!cocok) return teks
  const angka = nilai.toLocaleString('id-ID', {
    minimumFractionDigits: desimal,
    maximumFractionDigits: desimal,
  })
  return (
    <span ref={ref}>
      {cocok[1]}
      {angka}
      {cocok[3]}
    </span>
  )
}

// Foto yang muncul dari piksel besar ke tajam saat terlihat (seperti foto di intro).
// sampul = true jika gambar memakai object-fit: cover (bagian tengah dipotong).
const BLOK_FOTO = [28, 16, 9, 5, 3]
export function FotoMuncul({ sampul = false, ...props }) {
  const img = useRef(null)
  const kanvas = useRef(null)
  const [selesai, setSelesai] = useState(
    () => typeof document === 'undefined' || !document.documentElement.classList.contains('js-muncul'),
  )

  useEffect(() => {
    if (selesai) return
    let timer = 0
    let batal = false
    const lepas = saatTerlihat(img.current, async () => {
      const el = img.current
      try {
        await el.decode()
      } catch {
        // gambar gagal didekode: tampilkan saja apa adanya
      }
      const c = kanvas.current
      if (batal || !c || !el.naturalWidth) return setSelesai(true)
      const { width: w, height: h } = el.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      let [sx, sy, sw, sh] = [0, 0, el.naturalWidth, el.naturalHeight]
      if (sampul) {
        const rKotak = w / h
        const rGambar = sw / sh
        if (rGambar > rKotak) {
          sw = sh * rKotak
          sx = (el.naturalWidth - sw) / 2
        } else {
          sh = sw / rKotak
          sy = (el.naturalHeight - sh) / 2
        }
      }
      const ctx = c.getContext('2d')
      const kecil = document.createElement('canvas')
      const kctx = kecil.getContext('2d')
      let i = 0
      const langkah = () => {
        if (batal) return
        if (i >= BLOK_FOTO.length) return setSelesai(true)
        const b = BLOK_FOTO[i] * dpr
        kecil.width = Math.max(1, Math.round(c.width / b))
        kecil.height = Math.max(1, Math.round(c.height / b))
        kctx.drawImage(el, sx, sy, sw, sh, 0, 0, kecil.width, kecil.height)
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, c.width, c.height)
        ctx.drawImage(kecil, 0, 0, c.width, c.height)
        i += 1
        timer = setTimeout(langkah, 95)
      }
      langkah()
    })
    return () => {
      batal = true
      lepas()
      clearTimeout(timer)
    }
  }, [selesai, sampul])

  return (
    <span className={selesai ? 'foto-muncul foto-muncul--selesai' : 'foto-muncul'}>
      <img ref={img} {...props} />
      {!selesai && <canvas ref={kanvas} aria-hidden="true" />}
    </span>
  )
}
