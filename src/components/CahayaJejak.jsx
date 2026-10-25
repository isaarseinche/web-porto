import { useEffect } from 'react'
import { useReducedMotion } from '../hooks.js'

// Jalur PCB di latar hero menyala biru di sekitar mouse.
// Variabel --mx/--my ditulis ke lapisan .jejak--nyala saja (bukan ke <html>),
// supaya browser hanya menghitung ulang gaya satu elemen itu, bukan seluruh halaman.
export default function CahayaJejak() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const lapisan = document.querySelector('.jejak--nyala')
    if (!lapisan) return
    let x = 0
    let y = 0
    let ada = false
    let frame = 0
    const tulis = () => {
      frame = 0
      const top = y + window.scrollY
      // Di luar area lapisan (jauh di bawah hero), tidak perlu diperbarui.
      if (top > lapisan.offsetHeight + 200) return
      lapisan.style.setProperty('--mx', `${x}px`)
      lapisan.style.setProperty('--my', `${top}px`)
    }
    const jadwalkan = () => {
      if (ada && !frame) frame = requestAnimationFrame(tulis)
    }
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      ada = true
      jadwalkan()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', jadwalkan, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', jadwalkan)
      cancelAnimationFrame(frame)
    }
  }, [reduced])

  return null
}
