import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles.css'
import App from './App.jsx'

// Animasi muncul hanya diaktifkan jika browser mendukung dan pengunjung tidak
// memilih "kurangi animasi". Tanpa kelas ini, semua isi langsung tampil.
if (
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  document.documentElement.classList.add('js-muncul')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
