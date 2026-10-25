import { useEffect, useState } from 'react'

// true jika pengunjung mengaktifkan "kurangi animasi" di perangkatnya.
export function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

const sedangDilihat = () => !document.prerendering && document.visibilityState === 'visible'

// true setelah halaman benar-benar dilihat pengunjung. Chrome bisa memuat halaman
// diam-diam lebih dulu (pra-render saat URL masih di address bar, atau tab dibuka
// di latar belakang); animasi sekali jalan seperti intro harus menunggu ini.
export function useHalamanDilihat() {
  const [dilihat, setDilihat] = useState(() => typeof document !== 'undefined' && sedangDilihat())
  useEffect(() => {
    if (dilihat) return
    const cek = () => sedangDilihat() && setDilihat(true)
    document.addEventListener('prerenderingchange', cek)
    document.addEventListener('visibilitychange', cek)
    cek()
    return () => {
      document.removeEventListener('prerenderingchange', cek)
      document.removeEventListener('visibilitychange', cek)
    }
  }, [dilihat])
  return dilihat
}

// Memanggil `hitung(rect)` setiap kali halaman digulir atau diubah ukurannya.
// `langkah` membulatkan hasil (mis. 100 → kelipatan 0,01) sehingga komponen
// hanya di-render ulang saat nilainya benar-benar berubah.
function useGulir(ref, hitung, langkah = 1000) {
  const [nilai, setNilai] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const v = Math.min(1, Math.max(0, hitung(el.getBoundingClientRect())))
      setNilai(Math.round(v * langkah) / langkah)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
    // `hitung` adalah fungsi murni yang didefinisikan di modul ini.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, langkah])
  return nilai
}

// Progres 0..1 saat elemen masuk dari bawah layar sampai melewati tengah (teks menyala).
// `langkah` = jumlah tahap (mis. jumlah kata), agar render ulang hanya saat ada kata baru menyala.
export function useRevealProgress(ref, langkah) {
  return useGulir(
    ref,
    (rect) => {
      const vh = window.innerHeight
      return (vh * 0.85 - rect.top) / (rect.height + vh * 0.25)
    },
    langkah,
  )
}

const ACAK = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&<>/'

// Efek "sinyal didekode": huruf acak berubah satu per satu menjadi teks asli.
// Berjalan setiap kali `pemicu` berubah dan bernilai > 0.
export function useDekode(teks, pemicu, durasi = 900) {
  const [hasil, setHasil] = useState(teks)
  useEffect(() => {
    if (!pemicu) {
      setHasil(teks)
      return
    }
    let raf = 0
    let t0 = 0
    const langkah = (t) => {
      if (!t0) t0 = t
      const p = Math.min(1, (t - t0) / durasi)
      const selesai = Math.floor(p * teks.length)
      setHasil(
        teks
          .split('')
          .map((c, i) => (i < selesai || c === ' ' ? c : ACAK[(Math.random() * ACAK.length) | 0]))
          .join(''),
      )
      if (p < 1) raf = requestAnimationFrame(langkah)
    }
    raf = requestAnimationFrame(langkah)
    return () => cancelAnimationFrame(raf)
  }, [teks, pemicu, durasi])
  return hasil
}

// Jam Jakarta (WIB), diperbarui tiap 30 detik.
export function useJamWIB() {
  const format = () =>
    new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(new Date())
  const [jam, setJam] = useState(format)
  useEffect(() => {
    const id = setInterval(() => setJam(format()), 30_000)
    return () => clearInterval(id)
  }, [])
  return jam
}
