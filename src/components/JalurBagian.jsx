import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks.js'

// Aksen jalur PCB hijau di ruang kosong atas setiap bagian.
// - Saat bagiannya pertama kali masuk layar, jalur "dirutekan" (tergambar)
//   dari tepi layar ke dalam SEKALI, bergantian per jalur; via muncul saat
//   jalurnya sampai. Setelah itu jalur tetap di tempatnya.
// - Bergerak sedikit lebih lambat dari isi (parallax halus), ditulis langsung
//   sebagai transform agar hanya satu elemen yang dihitung ulang.
// - Setelah tergambar, sesekali sinyal biru mengalir masuk selama terlihat.
// Lama & jeda gambar diatur di styles.css (.jalur-bagian__jejak).

const W = 920
const H = 96
const KAP_X = 640 // posisi footprint kapasitor di jalur ke-3
const GESER_PARALLAX = 56 // px, total geseran parallax dari bagian masuk sampai keluar layar
const LAMA_GAMBAR = 1900 // ms sampai semua jalur & via selesai (lihat CSS)

// Lima jalur sejajar dari tepi kanan (x = W) ke kiri, masing-masing belok 45°
// turun lalu berakhir di via. Makin bawah, makin cepat berakhir (bertangga).
const JALUR = Array.from({ length: 5 }, (_, i) => {
  const y = 14 + 12 * i
  const akhir = 120 + 110 * i
  const ekor = `H${akhir + 56} L${akhir + 42},${y + 14} H${akhir + 6}`
  const segmen =
    i === 2
      ? [
          { d: `M${W},${y} H${KAP_X + 40}`, urut: i },
          { d: `M${KAP_X},${y} ${ekor}`, urut: i + 0.6 },
        ]
      : [{ d: `M${W},${y} ${ekor}`, urut: i }]
  return { i, via: [akhir, y + 14], segmen, penuh: `M${W},${y} ${ekor}` }
})

export default function JalurBagian({ sisi = 'kanan', label = 'C1' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.classList.add('jalur-bagian--tergambar')
      return
    }
    const bagian = el.parentElement
    let frame = 0
    let terlihat = false
    let siapSinyal = false
    let yLama = NaN
    let timer = 0

    const perbarui = () => {
      frame = 0
      const r = bagian.getBoundingClientRect()
      const vh = window.innerHeight
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
      const y = Math.round((0.5 - t) * GESER_PARALLAX * 2) / 2
      if (y !== yLama) {
        el.style.transform = `translate3d(0, ${y}px, 0)`
        yLama = y
      }
      el.classList.toggle('jalur-bagian--hidup', terlihat && siapSinyal)
    }
    const onScroll = () => {
      if (terlihat && !frame) frame = requestAnimationFrame(perbarui)
    }

    // Pengamat 1: kapan bagian terlihat (untuk parallax & sinyal).
    const ioTerlihat = new IntersectionObserver(([e]) => {
      terlihat = e.isIntersecting
      perbarui()
    })
    ioTerlihat.observe(bagian)

    // Pengamat 2: gambar jalur sekali saat bagian melewati 15% dari bawah layar.
    const ioGambar = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        ioGambar.disconnect()
        el.classList.add('jalur-bagian--tergambar')
        timer = setTimeout(() => {
          siapSinyal = true
          perbarui()
        }, LAMA_GAMBAR)
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    ioGambar.observe(bagian)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      ioTerlihat.disconnect()
      ioGambar.disconnect()
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [reduced])

  const cermin = sisi === 'kiri'
  const tx = (x) => (cermin ? W - x : x)

  return (
    <svg
      ref={ref}
      className={`jalur-bagian jalur-bagian--${sisi}`}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
    >
      <g transform={cermin ? `translate(${W} 0) scale(-1 1)` : undefined}>
        {JALUR.flatMap(({ i, segmen }) =>
          segmen.map((s, k) => (
            <path key={`${i}-${k}`} className="jalur-bagian__jejak" d={s.d} pathLength="1" style={{ '--i': s.urut }} />
          )),
        )}

        {/* Pad kapasitor */}
        <g className="jalur-bagian__ujung" style={{ '--i': 2 }}>
          <rect x={KAP_X} y="33" width="12" height="10" rx="1" />
          <rect x={KAP_X + 28} y="33" width="12" height="10" rx="1" />
        </g>
        {/* Via di ujung tiap jalur */}
        {JALUR.map(({ i, via: [x, y] }) => (
          <g key={i} className="jalur-bagian__ujung" style={{ '--i': i === 2 ? 2.6 : i }}>
            <circle cx={x} cy={y} r="5" />
            <circle className="jalur-bagian__lubang" cx={x} cy={y} r="2" />
          </g>
        ))}

        {/* Sinyal biru yang mengalir masuk */}
        <path className="jalur-bagian__sinyal" d={JALUR[0].penuh} pathLength="1" />
        <path className="jalur-bagian__sinyal jalur-bagian__sinyal--2" d={JALUR[3].penuh} pathLength="1" />
      </g>

      {/* Sablon kapasitor (tidak ikut dicerminkan agar tetap terbaca) */}
      <g className="jalur-bagian__ujung jalur-bagian__sablon" style={{ '--i': 2 }}>
        <rect x={Math.min(tx(KAP_X - 5), tx(KAP_X + 45))} y="30" width="50" height="16" rx="2" />
        <text x={tx(KAP_X + 20)} y="25" textAnchor="middle">
          {label}
        </text>
      </g>
    </svg>
  )
}
