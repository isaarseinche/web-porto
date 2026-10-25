// =====================================================================
// PENGATURAN WAKTU INTRO (layar pembuka)
// Satuan: milidetik (ms). 1000 ms = 1 detik.
//
// JADWAL = KAPAN setiap bagian dimulai, dihitung dari awal intro (0 ms).
//   - Angkanya harus terus naik dari atas ke bawah.
//   - Ingin suatu bagian tampil LEBIH LAMA? Tambahkan angka pada baris
//     berikutnya DAN semua baris di bawahnya dengan jumlah yang sama.
//     Contoh: "I am" ingin tampil 0,5 detik lebih lama → tambah 500 pada
//     sayaKeluar dan semua baris di bawahnya.
//   - Nama baris (sapaMasuk, sayaMasuk, dst.) tetap berbahasa Indonesia;
//     yang berubah hanya teks yang tampil di layar.
//
// DURASI = BERAPA LAMA sebuah gerakan berlangsung.
//
// Tips melihat hasil: buka http://localhost:5173/?intro=1 lalu refresh.
// =====================================================================

export const JADWAL = {
  sapaMasuk: 1500, // "Hello everyone" mulai muncul (angka persen menghilang)
  sapaGanti: 2700, // "everyone" menghilang, "Hello" bergeser, ", world" muncul
  sapaKeluar: 4200, // "Hello, world" memudar keluar
  sayaMasuk: 4550, // "I am" mulai muncul
  sayaKeluar: 5550, // "I am" memudar keluar
  namaMasuk: 6250, // nama lengkap mulai diketik huruf demi huruf
  namaSorot: 7850, // huruf "Isa" menyala biru, huruf lain meredup
  namaKumpul: 8250, // huruf lain memudar di tempat, tinggal "ISA" (posisinya tetap diam)
  besar: 9000, // "ISA" membesar memenuhi layar
  foto: 9950, // foto muncul di tengah
  tutup: 11000, // layar intro digeser ke atas, website tampil
}

export const DURASI = {
  persen: 1300, // angka persen naik dari 0% ke 100%
  hurufMasuk: 500, // satu huruf muncul dengan efek blur
  hurufKeluar: 320, // satu huruf menghilang dengan efek blur
  jedaHurufSapa: 32, // jeda antar huruf pada "Hello everyone" / "Hello, world"
  jedaHurufSaya: 70, // jeda antar huruf pada "I am"
  jedaHurufNama: 38, // jeda antar huruf saat nama diketik
  hurufLainHilang: 500, // huruf selain "ISA" memudar & blur (mulai di namaKumpul)
  jedaMulaiSapa: 200, // jeda setelah angka persen hilang sebelum huruf sapaan muncul
  jedaMulaiDunia: 300, // jeda setelah "everyone" mulai hilang sebelum ", world" muncul
  geserHalo: 850, // "Hello" bergeser ke posisi barunya
  lapisanHilang: 450, // satu bagian (sapaan, "I am", nama) memudar keluar
  bukaFoto: 850, // jendela foto terbuka dari tengah
  langkahPiksel: 115, // jeda tiap langkah efek piksel foto (ada 6 langkah)
  tutup: 700, // layar intro digeser ke atas
}
