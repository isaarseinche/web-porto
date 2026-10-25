import { keahlian as k } from '../data/konten.js'
import JalurBagian from './JalurBagian.jsx'
import { JudulBlok } from './Muncul.jsx'

export default function Keahlian() {
  return (
    <section className="blok" id="keahlian" aria-labelledby="judul-keahlian">
      <JalurBagian sisi="kiri" label="C4" />
      <JudulBlok id="judul-keahlian" teks={k.judul} />
      <p className="blok__pengantar" data-muncul>
        {k.pengantar}
      </p>
      <dl className="keahlian">
        {k.kelompok.map((g, i) => (
          <div key={g.nama} className="keahlian__baris" data-muncul style={{ '--tunda': `${i * 70}ms` }}>
            <dt>{g.nama}</dt>
            <dd>
              {g.isi}
              <span className="keahlian__dipakai">Dipakai di {g.dipakai}</span>
            </dd>
          </div>
        ))}
        <div
          className="keahlian__baris keahlian__baris--belajar"
          data-muncul
          style={{ '--tunda': `${k.kelompok.length * 70}ms` }}
        >
          <dt>Sedang dipelajari</dt>
          <dd>{k.sedangDipelajari}</dd>
        </div>
      </dl>
    </section>
  )
}
