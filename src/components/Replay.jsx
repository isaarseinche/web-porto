import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { replay } from '../data/konten.js'
// Semua angka waktu replay ada di file ini ↓
import { REPLAY } from '../data/waktuReplay.js'
import { useReducedMotion } from '../hooks.js'
import JalurBagian from './JalurBagian.jsx'
import { AngkaNaik, JudulBlok } from './Muncul.jsx'

const format = (v, digit = 1) =>
  v.toLocaleString('id-ID', { minimumFractionDigits: digit, maximumFractionDigits: digit })

// Ukuran grafik (satuan viewBox SVG).
const W = 640
const H = 290
const PAD = { kiri: 48, kanan: 18, atas: 18, bawah: 34 }
const MAKS_PPM = 240
const N = replay.hari.length
const HARI_METANA = replay.hari.findIndex((d) => d.metana > 0)
const xHari = (i) => PAD.kiri + (i * (W - PAD.kiri - PAD.kanan)) / (N - 1)
const yPpm = (v) => PAD.atas + (1 - v / MAKS_PPM) * (H - PAD.atas - PAD.bawah)

// Angka yang berubah halus (menghitung) ke nilai baru.
function Angka({ nilai, digit = 1 }) {
  const reduced = useReducedMotion()
  const [tampil, setTampil] = useState(nilai)
  const sebelum = useRef(nilai)
  useEffect(() => {
    const dari = sebelum.current
    sebelum.current = nilai
    if (reduced || dari === nilai) {
      setTampil(nilai)
      return
    }
    let raf = 0
    let t0 = 0
    const langkah = (t) => {
      if (!t0) t0 = t
      const k = Math.min(1, (t - t0) / REPLAY.lamaAngka)
      setTampil(dari + (nilai - dari) * (1 - (1 - k) ** 3))
      if (k < 1) raf = requestAnimationFrame(langkah)
    }
    raf = requestAnimationFrame(langkah)
    return () => cancelAnimationFrame(raf)
  }, [nilai, reduced])
  return format(tampil, digit)
}

// Grafik statis; bagian yang "terungkap" dan garis kursor digerakkan lewat ref.
function Grafik({ iHari, rectRef, kursorRef }) {
  const titik = replay.hari.map((d, i) => [xHari(i), yPpm(d.metana)])
  const garis = titik.map(([px, py], i) => `${i ? 'L' : 'M'}${px},${py}`).join(' ')
  const area = `${garis} L${xHari(N - 1)},${yPpm(0)} L${xHari(0)},${yPpm(0)} Z`
  const batas = replay.batasWaspada

  return (
    <svg className="grafik" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="grafik-judul">
      <title id="grafik-judul">
        Kadar metana per hari: 0 ppm pada hari 1 sampai 4, lalu 97 ppm pada hari 5 sampai 7
      </title>
      <defs>
        <clipPath id="terungkap">
          <rect ref={rectRef} x="0" y="0" width="0" height={H} />
        </clipPath>
        <linearGradient id="isi-metana" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--flame)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--flame)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 100, 200].map((v) => (
        <g key={v}>
          <line className="grafik__grid" x1={PAD.kiri} x2={W - PAD.kanan} y1={yPpm(v)} y2={yPpm(v)} />
          <text className="grafik__sumbu" x={PAD.kiri - 10} y={yPpm(v) + 4} textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <line className="grafik__batas" x1={PAD.kiri} x2={W - PAD.kanan} y1={yPpm(batas)} y2={yPpm(batas)} />
      <text className="grafik__label-batas" x={W - PAD.kanan} y={yPpm(batas) - 8} textAnchor="end">
        batas waspada {batas} ppm
      </text>
      {replay.hari.map((d, i) => (
        <text key={d.tanggal} className="grafik__sumbu" x={xHari(i)} y={H - 10} textAnchor="middle">
          H{i + 1}
        </text>
      ))}
      <text className="grafik__sumbu" x={PAD.kiri - 10} y={PAD.atas - 4} textAnchor="end">
        ppm
      </text>

      <g clipPath="url(#terungkap)">
        <path d={area} fill="url(#isi-metana)" />
        <path d={garis} className="grafik__garis" />
        {titik.map(([px, py], i) => (
          <circle
            key={i}
            cx={px}
            cy={py}
            r="4.5"
            className={i === iHari ? 'grafik__titik grafik__titik--aktif' : 'grafik__titik'}
          />
        ))}
      </g>
      <line ref={kursorRef} className="grafik__kursor" x1={xHari(0)} x2={xHari(0)} y1={PAD.atas} y2={yPpm(0)} />
    </svg>
  )
}

export default function Replay() {
  const reduced = useReducedMotion()
  const panel = useRef(null)
  const rectRef = useRef(null)
  const kursorRef = useRef(null)
  const progres = useRef(reduced ? N - 1 : 0) // posisi grafik, 0 = hari 1 … N-1 = hari 7
  const tahanSisa = useRef(0)
  const sudahTahan = useRef(false)

  const [iHari, setIHari] = useState(reduced ? N - 1 : 0)
  const [status, setStatus] = useState(reduced ? 'selesai' : 'menunggu') // menunggu | main | jeda | selesai
  const [terlihat, setTerlihat] = useState(false)
  const [api, setApi] = useState(reduced)

  // Terapkan posisi grafik langsung ke elemen SVG (tanpa render ulang React).
  const terapkan = useCallback((p) => {
    const x = xHari(p)
    rectRef.current?.setAttribute('width', String(x + 6))
    kursorRef.current?.setAttribute('x1', String(x))
    kursorRef.current?.setAttribute('x2', String(x))
    const hari = Math.min(N - 1, Math.floor(p + 1e-6))
    setIHari((lama) => (lama === hari ? lama : hari))
  }, [])

  useLayoutEffect(() => terapkan(progres.current), [terapkan])

  // Mulai saat bagian ini terlihat; jeda saat digulir menjauh.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) setTerlihat(false)
        else if (e.intersectionRatio >= REPLAY.ambangMulai - 0.001) setTerlihat(true)
      },
      { threshold: [0, REPLAY.ambangMulai] },
    )
    io.observe(panel.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (terlihat && status === 'menunggu') setStatus('main')
  }, [terlihat, status])

  // Mesin pemutar: menggerakkan grafik ±1 hari per REPLAY.perHari.
  useEffect(() => {
    if (status !== 'main' || !terlihat) return
    let raf = 0
    let akhir = 0
    const langkah = (t) => {
      const dt = akhir ? Math.min(100, t - akhir) : 16
      akhir = t
      if (tahanSisa.current > 0) {
        tahanSisa.current -= dt
      } else {
        const sebelum = progres.current
        progres.current = Math.min(N - 1, progres.current + dt / REPLAY.perHari)
        // Tahan sebentar saat tiba di hari metana pertama terdeteksi.
        if (!sudahTahan.current && sebelum < HARI_METANA && progres.current >= HARI_METANA) {
          progres.current = HARI_METANA
          sudahTahan.current = true
          tahanSisa.current = REPLAY.tahanHariMetana
        }
      }
      terapkan(progres.current)
      if (progres.current >= N - 1) {
        setStatus('selesai')
        return
      }
      raf = requestAnimationFrame(langkah)
    }
    raf = requestAnimationFrame(langkah)
    return () => cancelAnimationFrame(raf)
  }, [status, terlihat, terapkan])

  // Setelah hari terakhir, foto api menjadi tajam.
  useEffect(() => {
    if (status !== 'selesai' || api) return
    const id = setTimeout(() => setApi(true), reduced ? 0 : REPLAY.jedaSebelumApi)
    return () => clearTimeout(id)
  }, [status, api, reduced])

  // Tombol hari: geser grafik dengan halus ke hari yang dipilih.
  const lompatRaf = useRef(0)
  const lompatKe = (i) => {
    cancelAnimationFrame(lompatRaf.current)
    if (status === 'main' || status === 'menunggu') setStatus('jeda')
    if (reduced) {
      progres.current = i
      terapkan(i)
      return
    }
    const dari = progres.current
    let t0 = 0
    const langkah = (t) => {
      if (!t0) t0 = t
      const k = Math.min(1, (t - t0) / REPLAY.lamaLompat)
      progres.current = dari + (i - dari) * (1 - (1 - k) ** 3)
      terapkan(progres.current)
      if (k < 1) lompatRaf.current = requestAnimationFrame(langkah)
      else if (i === N - 1) setStatus('selesai')
    }
    lompatRaf.current = requestAnimationFrame(langkah)
  }
  useEffect(() => () => cancelAnimationFrame(lompatRaf.current), [])

  const tombolPutar = () => {
    if (status === 'main') return setStatus('jeda')
    if (status === 'selesai' || progres.current >= N - 1) {
      cancelAnimationFrame(lompatRaf.current)
      progres.current = 0
      sudahTahan.current = false
      tahanSisa.current = 0
      terapkan(0)
      setApi(false)
    }
    if (progres.current < HARI_METANA) sudahTahan.current = false
    setStatus('main')
  }
  const labelPutar =
    status === 'main' ? replay.tombol.jeda : status === 'selesai' ? replay.tombol.ulangi : replay.tombol.putar

  const d = replay.hari[iHari]
  const { penutup } = replay

  return (
    <section className="replay" id="uji" aria-labelledby="judul-uji">
      <JalurBagian sisi="kanan" label="C1" />
      <div className="replay__kepala">
        <JudulBlok id="judul-uji" teks={replay.judul} />
        <p className="replay__pengantar" data-muncul>
          {replay.pengantar}
        </p>
      </div>

      <div className="replay__panel" ref={panel}>
        <div className="replay__hari">
          <p className="replay__hari-angka" key={`h${iHari}`}>
            Hari {iHari + 1} dari {N}
          </p>
          <p className="replay__tanggal" key={`t${iHari}`}>
            {d.tanggal}
          </p>
        </div>

        <div className="replay__kiri">
          <div className="replay__grafik">
            <Grafik iHari={iHari} rectRef={rectRef} kursorRef={kursorRef} />
          </div>
          <div className="replay__kontrol">
            <button type="button" className="replay__putar" onClick={tombolPutar}>
              <span className={`replay__ikon replay__ikon--${status === 'main' ? 'jeda' : 'putar'}`} aria-hidden="true" />
              {labelPutar}
            </button>
            <div className="replay__hari-tombol" role="group" aria-label="Pilih hari">
              {replay.hari.map((h, i) => (
                <button
                  key={h.tanggal}
                  type="button"
                  className="replay__tombol"
                  aria-current={i === iHari ? 'step' : undefined}
                  onClick={() => lompatKe(i)}
                >
                  <span className="sr-only">Hari </span>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="replay__sisi">
          <dl className="bacaan">
            <div className="bacaan__sel">
              <dt>Suhu</dt>
              <dd>
                <span className="bacaan__nilai">
                  <Angka nilai={d.suhu} />
                </span>{' '}
                °C
              </dd>
            </div>
            <div className="bacaan__sel">
              <dt>Kelembapan</dt>
              <dd>
                <span className="bacaan__nilai">
                  <Angka nilai={d.kelembapan} />
                </span>{' '}
                %
              </dd>
            </div>
            <div className="bacaan__sel">
              <dt>Tekanan absolut</dt>
              <dd>
                <span className="bacaan__nilai">
                  <Angka nilai={d.tekanan} digit={2} />
                </span>{' '}
                kPa
              </dd>
            </div>
            <div className="bacaan__sel bacaan__sel--utama">
              <dt>Metana</dt>
              <dd>
                <span className="bacaan__nilai">
                  <Angka nilai={d.metana} digit={0} />
                </span>{' '}
                ppm
              </dd>
            </div>
          </dl>
          <p className="replay__ket" key={`k${iHari}`}>
            {replay.keteranganHari[iHari]}
          </p>
        </div>

        <figure className={api ? 'replay__api replay__api--muncul' : 'replay__api'}>
          <div className="replay__api-foto">
            <img src={penutup.foto} alt={penutup.alt} width="520" height="550" loading="lazy" />
            <span className="replay__api-tunggu" aria-hidden="true">
              {penutup.menunggu}
            </span>
            <span className="replay__api-pindai" aria-hidden="true" />
          </div>
          <figcaption>
            <strong>{penutup.judul}</strong>
            <span>{penutup.teks}</span>
            <span className="kredit">{penutup.kredit}</span>
          </figcaption>
        </figure>
      </div>

      <div className="replay__kaki">
        <ul className="ringkasan">
          {replay.ringkasan.map((r, i) => (
            <li key={r.label} data-muncul style={{ '--tunda': `${i * 90}ms` }}>
              <strong>
                <AngkaNaik teks={r.nilai} />
              </strong>{' '}
              {r.label}
            </li>
          ))}
        </ul>
        <p className="catatan" data-muncul>
          {replay.catatan}
        </p>
      </div>

      {/* Tabel untuk pembaca layar. Dibungkus div karena <table> selalu melebar
          mengikuti isinya dan bisa membuat halaman bergeser ke samping. */}
      <div className="sr-only">
      <table>
        <caption>Data uji harian sistem monitoring biogas, 11–17 Juni 2026</caption>
        <thead>
          <tr>
            <th scope="col">Tanggal</th>
            <th scope="col">Suhu (°C)</th>
            <th scope="col">Kelembapan (%)</th>
            <th scope="col">Tekanan absolut (kPa)</th>
            <th scope="col">Metana (ppm)</th>
          </tr>
        </thead>
        <tbody>
          {replay.hari.map((h) => (
            <tr key={h.tanggal}>
              <th scope="row">{h.tanggal}</th>
              <td>{format(h.suhu)}</td>
              <td>{format(h.kelembapan)}</td>
              <td>{format(h.tekanan, 2)}</td>
              <td>{h.metana}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  )
}
