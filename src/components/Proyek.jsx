import { useEffect, useRef, useState } from 'react'
import { proyek } from '../data/konten.js'
import JalurBagian from './JalurBagian.jsx'
import { FotoMuncul, JudulBlok } from './Muncul.jsx'

// true selama elemen terlihat di layar (untuk menjalankan animasi hanya saat perlu).
function useTerlihat(ref) {
  const [terlihat, setTerlihat] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setTerlihat(e.isIntersecting), {
      threshold: 0.3,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return terlihat
}

function Info({ baris }) {
  return (
    <dl className="info">
      {baris.map((b) => (
        <div key={b.label}>
          <dt>{b.label}</dt>
          <dd>{b.nilai}</dd>
        </div>
      ))}
    </dl>
  )
}

// Alur data Smart Biogas. Kotak bertepi tembaga = bagian yang Isa kerjakan.
// Saat terlihat, "paket data" biru berjalan di setiap penghubung tiap 2 detik.
function AlurBiogas() {
  const ref = useRef(null)
  const aktif = useTerlihat(ref)
  return (
    <figure ref={ref} className={aktif ? 'alur alur--aktif' : 'alur'}>
      <ol className="alur__rantai">
        <li className="alur__grup">
          <span className="alur__grup-label">Bagian saya: perakitan, pemasangan, casing</span>
          <ol className="alur__dalam">
            <li className="alur__simpul alur__simpul--saya">
              <b>Sensor</b>
              <span>DHT22, BMP180, MQ-4</span>
            </li>
            <li className="alur__simpul alur__simpul--saya" style={{ '--i': 0 }}>
              <b>ESP32</b>
              <span>membaca sensor</span>
            </li>
          </ol>
        </li>
        <li className="alur__simpul" style={{ '--i': 1 }}>
          <b>Wi-Fi</b>
          <span>tiap 2 detik</span>
        </li>
        <li className="alur__simpul" style={{ '--i': 2 }}>
          <b>Server</b>
          <span>menyimpan data</span>
        </li>
        <li className="alur__simpul" style={{ '--i': 3 }}>
          <b>Dashboard web</b>
          <span>grafik dan notifikasi HP</span>
        </li>
      </ol>
      <figcaption>
        Alur data sistem. Kotak bergaris tembaga adalah bagian yang saya kerjakan; sisanya dikerjakan rekan tim.
      </figcaption>
    </figure>
  )
}

// Diagram blok Gelas Pintar, digambar ulang dari proposal.
function BlokGelas() {
  return (
    <figure className="blokdiag" data-muncul style={{ '--tunda': '120ms' }}>
      <div className="blokdiag__grid">
        <div className="alur__simpul blokdiag__a">
          <b>MLX90614</b>
          <span>suhu inframerah, I2C</span>
        </div>
        <div className="alur__simpul alur__simpul--saya blokdiag__b">
          <b>Load cell + HX711</b>
          <span>berat air</span>
        </div>
        <div className="alur__simpul alur__simpul--saya blokdiag__c">
          <b>Arduino Uno</b>
          <span>hitung suhu dan volume</span>
        </div>
        <div className="alur__simpul alur__simpul--saya blokdiag__d">
          <b>LCD 16x2</b>
          <span>tampilkan hasil</span>
        </div>
      </div>
      <figcaption>
        Diagram blok. Kotak bergaris tembaga adalah komponen yang saya rakit sendiri.
      </figcaption>
    </figure>
  )
}

function Biogas() {
  const b = proyek.biogas
  return (
    <article className="proyek" aria-labelledby="judul-biogas">
      <header className="proyek__kepala" data-muncul>
        <p className="proyek__tahun" aria-hidden="true">
          {b.tahun}
        </p>
        <h3 className="proyek__nama" id="judul-biogas">
          {b.nama}
          <span>{b.subjudul}</span>
        </h3>
        <Info baris={b.info} />
      </header>

      <div className="galeri">
        {b.foto.map(({ src, ukuran: [w, h], alt, caption }, i) => (
          <figure
            key={src}
            className={`galeri__item galeri__item--${i + 1}`}
            style={{ flexGrow: w / h }}
          >
            <FotoMuncul src={src} alt={alt} width={w} height={h} loading="lazy" />
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
      </div>

      <div data-muncul>
        <AlurBiogas />
      </div>

      <div className="tiga-kolom">
        <section data-muncul style={{ '--tunda': '0ms' }}>
          <h4>Masalah</h4>
          <p>{b.masalah}</p>
          <p className="redup">{b.solusi}</p>
        </section>
        <section data-muncul style={{ '--tunda': '110ms' }}>
          <h4>Yang saya kerjakan</h4>
          <ul className="daftar">
            {b.dikerjakan.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section data-muncul style={{ '--tunda': '220ms' }}>
          <h4>Hasil</h4>
          <ul className="daftar">
            {b.hasil.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="pelajaran" data-muncul>
        <h4>Yang saya pelajari</h4>
        <ul className="daftar">
          {b.pelajaran.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <p className="kredit-proyek" data-muncul>
        {b.kredit}
      </p>
    </article>
  )
}

function Gelas() {
  const g = proyek.gelas
  return (
    <article className="proyek proyek--kecil" aria-labelledby="judul-gelas">
      <header className="proyek__kepala" data-muncul>
        <p className="proyek__tahun" aria-hidden="true">
          {g.tahun}
        </p>
        <h3 className="proyek__nama" id="judul-gelas">
          {g.nama}
          <span>{g.subjudul}</span>
        </h3>
        <Info baris={g.info} />
      </header>

      <div className="gelas">
        <figure className="lcd-bingkai" data-muncul>
          <div className="lcd" aria-label={`Contoh tampilan LCD: ${g.lcd.join(', ')}`}>
            {g.lcd.map((baris) => (
              <span key={baris} aria-hidden="true">
                {baris}
              </span>
            ))}
          </div>
          <figcaption>{g.lcdKeterangan}</figcaption>
        </figure>
        <BlokGelas />
      </div>

      <div className="tiga-kolom">
        <section data-muncul style={{ '--tunda': '0ms' }}>
          <h4>Masalah</h4>
          <p>{g.masalah}</p>
        </section>
        <section data-muncul style={{ '--tunda': '110ms' }}>
          <h4>Cara kerja</h4>
          <ul className="daftar">
            {g.caraKerja.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section data-muncul style={{ '--tunda': '220ms' }}>
          <h4>Yang saya kerjakan</h4>
          <ul className="daftar">
            {g.dikerjakan.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}

export default function Proyek() {
  return (
    <section className="blok" id="proyek" aria-labelledby="judul-proyek">
      <JalurBagian sisi="kiri" label="C2" />
      <JudulBlok id="judul-proyek" teks={proyek.judul} />
      <Biogas />
      <Gelas />
    </section>
  )
}
