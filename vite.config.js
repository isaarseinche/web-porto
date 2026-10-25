import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Waktu build, dipakai footer untuk tahun hak cipta dan tulisan "Diperbarui".
  define: {
    __WAKTU_BUILD__: JSON.stringify(new Date().toISOString()),
  },
})
