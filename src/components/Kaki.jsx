import { useEffect, useRef, useState } from 'react'
import { kaki, profil } from '../data/konten.js'
import { useJamWIB } from '../hooks.js'

// Waktu build diisi oleh vite.config.js, jadi "Diperbarui" selalu mengikuti
// kapan website terakhir di-build.
const dibangun = new Date(__WAKTU_BUILD__)
const bulanBuild = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
}).format(dibangun)
const revisi = `REV ${dibangun.getFullYear()}.${String(dibangun.getMonth() + 1).padStart(2, '0')}`

// Garis pembatas berupa jalur tembaga PCB (viewBox 2560×64, dipotong di tengah
// pada layar sempit): sepasang jalur sejajar dengan belokan 45°, meander,
// resistor R1, test point TP1, via, label sablon, dan via stitching di tepi.
const MEANDER = Array.from({ length: 6 }, () => 'v10 h10 v-10 h10').join(' ')
const STITCH = Array.from({ length: 54 }, (_, i) => 16 + i * 48)

function JalurTembaga({ aktif }) {
  return (
    <svg
      className={aktif ? 'kaki__jalur kaki__jalur--aktif' : 'kaki__jalur'}
      viewBox="0 0 2560 64"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Via stitching di sepanjang tepi papan */}
      {STITCH.map((x) => (
        <g key={x} className="pcb__via-kecil">
          <circle cx={x} cy="7" r="3" />
          <circle cx={x} cy="7" r="1.2" className="pcb__lubang" />
        </g>
      ))}

      <g className="pcb__tembaga">
        {/* Jalur atas */}
        <path d="M0,22 H896 L908,34 H1312" />
        <path d="M1348,34 H1430" />
        <path d="M1642,34 H1720 L1732,22 H2560" />
        {/* Jalur bawah, dengan meander */}
        <path d={`M0,32 H896 L908,44 H1170 ${MEANDER} H1446`} />
        <path d="M1658,44 H1720 L1732,32 H2560" />
        {/* Test point TP1 */}
        <path d="M1110,44 V52" />
      </g>

      {/* Pad resistor R1 */}
      <rect className="pcb__pad" x="1310" y="29" width="12" height="10" rx="1" />
      <rect className="pcb__pad" x="1338" y="29" width="12" height="10" rx="1" />
      {/* Pad test point */}
      <circle className="pcb__pad" cx="1110" cy="56" r="4" />
      {/* Via tempat jalur turun ke lapisan bawah dan naik kembali */}
      {[
        [1436, 34],
        [1452, 44],
        [1636, 34],
        [1652, 44],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle className="pcb__pad" cx={x} cy={y} r="6" />
          <circle className="pcb__lubang" cx={x} cy={y} r="2.4" />
        </g>
      ))}

      {/* Sablon (silkscreen) */}
      <g className="pcb__sablon">
        <rect x="1305" y="26" width="50" height="16" rx="2" />
        <text x="1330" y="21" textAnchor="middle">R1</text>
        <text x="1121" y="59">TP1</text>
        <text x="1544" y="33" textAnchor="middle">{kaki.namaPapan}</text>
        <text x="1544" y="45" textAnchor="middle">{revisi}</text>
      </g>

      {/* Sinyal biru yang sesekali lewat di jalur */}
      <path className="pcb__sinyal" d="M0,22 H896 L908,34 H1312" pathLength="1" />
      <path className="pcb__sinyal pcb__sinyal--2" d={`M0,32 H896 L908,44 H1170 ${MEANDER} H1446`} pathLength="1" />
    </svg>
  )
}

// Footer bergaya "kotak judul" gambar teknik, di pita gelap yang dibuka oleh
// jalur tembaga PCB sebagai garis pembatas.
export default function Kaki() {
  const jam = useJamWIB()
  const ref = useRef(null)
  const [terlihat, setTerlihat] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setTerlihat(e.isIntersecting))
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <footer className="kaki" ref={ref}>
      <JalurTembaga aktif={terlihat} />
      <div className="kaki__isi">
        <dl className="kaki__blok">
          <div className="kaki__sel">
            <dt>{kaki.labelHakCipta}</dt>
            <dd>
              © {dibangun.getFullYear()} {profil.nama}
            </dd>
          </div>
          <div className="kaki__sel">
            <dt>{kaki.labelLokasi}</dt>
            <dd>
              {profil.lokasi}, <time>{jam}</time> WIB
            </dd>
          </div>
          <div className="kaki__sel">
            <dt>{kaki.labelDiperbarui}</dt>
            <dd>
              <time dateTime={dibangun.toISOString()}>{bulanBuild}</time>
            </dd>
          </div>
        </dl>
        <a className="kaki__naik" href="#atas">
          {kaki.kembaliKeAtas}
        </a>
      </div>
    </footer>
  )
}
