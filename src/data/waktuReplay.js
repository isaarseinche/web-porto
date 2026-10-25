// =====================================================================
// PENGATURAN WAKTU REPLAY "TUJUH HARI DI DALAM DIGESTER"
// Satuan: milidetik (ms). 1000 ms = 1 detik.
// Replay diputar otomatis saat bagiannya terlihat di layar, dijeda saat
// digulir menjauh, dan dilanjutkan saat terlihat lagi.
// =====================================================================

export const REPLAY = {
  perHari: 1000, // lama grafik bergerak dari satu hari ke hari berikutnya
  tahanHariMetana: 900, // jeda tambahan saat tiba di hari pertama metana terdeteksi (hari ke-5)
  jedaSebelumApi: 500, // jeda setelah hari ke-7 sebelum foto api menjadi tajam
  lamaAngka: 550, // lama angka berubah halus ke nilai baru
  lamaLompat: 600, // lama garis grafik bergeser saat tombol hari diklik
  ambangMulai: 0.35, // replay mulai saat bagian ini terlihat minimal 35%
}
