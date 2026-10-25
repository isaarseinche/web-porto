import { pendidikan as p } from '../data/konten.js'
import { JudulBlok } from './Muncul.jsx'

export default function Pendidikan() {
  return (
    <section className="blok" aria-labelledby="judul-pendidikan">
      <JudulBlok id="judul-pendidikan" teks={p.judul} />
      <div className="pendidikan" data-muncul>
        <h3>
          {p.jurusan}, {p.kampus}
        </h3>
        <p className="redup">{p.waktu}</p>
        <dl className="info info--tumpuk">
          <div>
            <dt>Tugas Akhir</dt>
            <dd>{p.ta}</dd>
          </div>
          {p.ipk && (
            <div>
              <dt>IPK</dt>
              <dd>{p.ipk}</dd>
            </div>
          )}
          <div>
            <dt>Kursus</dt>
            <dd>{p.kursus}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
