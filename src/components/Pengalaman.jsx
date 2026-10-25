import { pengalaman as p } from '../data/konten.js'
import JalurBagian from './JalurBagian.jsx'
import { AngkaNaik, FotoMuncul, JudulBlok } from './Muncul.jsx'

// Jeda berurutan untuk blok-blok di kolom teks.
const tunda = (i) => ({ '--tunda': `${i * 90}ms` })

export default function Pengalaman() {
  return (
    <section className="blok" id="pengalaman" aria-labelledby="judul-pengalaman">
      <JalurBagian sisi="kanan" label="C3" />
      <JudulBlok id="judul-pengalaman" teks={p.judul} />
      <article className="kp">
        <div className="kp__teks">
          <h3 className="kp__posisi" data-muncul style={tunda(0)}>
            {p.posisi}
          </h3>
          <p className="kp__tempat" data-muncul style={tunda(1)}>
            {p.tempat}
          </p>
          <p className="kp__waktu" data-muncul style={tunda(2)}>
            {p.waktu}. <span className="redup">{p.catatanWaktu}.</span>
          </p>

          <figure className="kp__angka" data-muncul style={tunda(3)}>
            <dl>
              {p.angka.map((a) => (
                <div key={a.label}>
                  <dt>{a.label}</dt>
                  <dd>
                    <AngkaNaik teks={a.nilai} />
                  </dd>
                </div>
              ))}
            </dl>
            <figcaption>{p.angkaKeterangan}</figcaption>
          </figure>

          <ul className="daftar" data-muncul style={tunda(4)}>
            {p.poin.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="kp__penghubung" data-muncul>
            {p.penghubung}
          </p>
        </div>
        <figure className="kp__foto">
          <FotoMuncul sampul src={p.foto.src} alt={p.foto.alt} width="580" height="1040" loading="lazy" />
          <figcaption>{p.foto.caption}</figcaption>
        </figure>
      </article>
    </section>
  )
}
