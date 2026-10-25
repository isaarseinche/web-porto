// =====================================================================
// SEMUA TEKS WEBSITE ADA DI FILE INI.
// Ubah tulisan di antara tanda kutip '...' lalu simpan; halaman akan
// langsung ter-update saat `npm run dev` berjalan.
// Jangan hapus tanda koma, kurung kurawal { }, atau kurung siku [ ].
// Sumber fakta: CV, buku TA, laporan KP, proposal Gelas Pintar.
// =====================================================================

import fotoPerangkat from '../assets/img/biogas-perangkat.jpg'
import fotoCasing from '../assets/img/biogas-casing.jpg'
import fotoDashboard from '../assets/img/biogas-dashboard.jpg'
import fotoApi from '../assets/img/biogas-api.jpg'
import fotoLapangan from '../assets/img/kp-lapangan.jpg'
import fotoProfil from '../assets/img/isa-profil.webp'

export const profil = {
  nama: 'Muhammad Isa Arseinche',
  namaPendek: 'Isa Arseinche',
  // Nama besar di bagian atas dipecah per baris:
  namaBaris: ['Muhammad Isa', 'Arseinche'],
  peran: 'IoT hardware & implementation',
  tagline: 'Dari sensor sampai server.',
  ringkas:
    'Saya merakit dan menguji perangkat IoT di lapangan, lalu memastikan datanya sampai ke server dengan stabil.',
  status: 'Terbuka untuk kesempatan kerja',
  lokasi: 'Jakarta Utara',
  mobilitas: 'Siap ditempatkan di luar kota dan dinas lapangan',
  email: 'isaarseinche@gmail.com',
  whatsapp: { tampil: '0811-7533-443', link: 'https://wa.me/628117533443' },
  linkedin: {
    tampil: 'linkedin.com/in/isa-arseinche',
    link: 'https://www.linkedin.com/in/isa-arseinche/',
  },
  // Ganti file di folder public/cv/ jika CV sudah diperbarui (nama file sama).
  cv: '/cv/Muhammad-Isa-Arseinche-CV.pdf',
  // Foto profil tanpa latar (src/assets/img/isa-profil.webp).
  foto: fotoProfil,
  fotoAlt: 'Foto Muhammad Isa Arseinche memakai jas almamater Telkom University',
  fotoKeterangan: 'Lulusan Teknik Komputer, Telkom University 2026',
}

// Intro (layar pembuka) yang muncul sekali saat website pertama dibuka.
export const intro = {
  // Baris "cek perangkat" saat persen loading berjalan.
  boot: [
    '[boot] powering on',
    '[sensor] DHT22 ok',
    '[sensor] BMP180 ok',
    '[sensor] MQ-4 ok',
    '[wifi] connected',
  ],
  // Sapaan pertama berubah menjadi sapaan kedua. Kata awal yang sama ("Hello")
  // tetap di tempat lalu bergeser; hanya bagian setelahnya yang berganti.
  sapaan1: 'Hello everyone',
  sapaan2: 'Hello, world',
  saya: 'I am',
  // Bagian nama yang menyala lalu membesar di akhir intro (harus ada di dalam profil.nama).
  panggilan: 'Isa',
  tombolLewati: 'Skip intro',
}

export const tentang = {
  judul: 'Tentang saya',
  paragraf: [
    'Saya lulusan S1 Teknik Komputer Telkom University yang paling menikmati pekerjaan langsung dengan perangkat keras: merangkai sensor, merakit alat, lalu mengujinya di lapangan sampai datanya bisa dipercaya.',
    'Di Tugas Akhir, saya menangani sisi hardware sistem monitoring biogas berbasis ESP32. Kami mengujinya selama tujuh hari pada digester berisi kotoran ternak. Pada hari kelima, sensor mulai mendeteksi gas metana, dan biogasnya berhasil menyalakan api.',
    'Saat Kerja Praktik sebagai IT Support di Diskominfo Kota Tangerang, saya mengenal sisi lainnya: server Linux, Docker, monitoring jaringan, dan pekerjaan lapangan membongkar perangkat jaringan lama.',
    'Saat ini saya mencari posisi IoT Field / Implementation Engineer atau Junior IoT Hardware Engineer.',
  ],
}

// Data uji 7 hari dari buku TA (Tabel 5.2, 5.3, 5.4). Satu pembacaan per hari.
export const replay = {
  judul: 'Tujuh hari di dalam digester',
  pengantar:
    'Ini data asli dari uji Tugas Akhir saya. Grafik diputar otomatis saat bagian ini terlihat; pilih nomor hari untuk melihat datanya.',
  // Teks tombol pemutar replay.
  tombol: { putar: 'Putar', jeda: 'Jeda', ulangi: 'Putar ulang' },
  hari: [
    { tanggal: '11 Juni 2026', suhu: 26.9, kelembapan: 66.0, tekanan: 93.68, metana: 0 },
    { tanggal: '12 Juni 2026', suhu: 26.8, kelembapan: 66.3, tekanan: 93.67, metana: 0 },
    { tanggal: '13 Juni 2026', suhu: 26.8, kelembapan: 65.9, tekanan: 93.71, metana: 0 },
    { tanggal: '14 Juni 2026', suhu: 26.7, kelembapan: 65.9, tekanan: 93.71, metana: 0 },
    { tanggal: '15 Juni 2026', suhu: 26.8, kelembapan: 65.9, tekanan: 93.67, metana: 97 },
    { tanggal: '16 Juni 2026', suhu: 26.7, kelembapan: 66.2, tekanan: 93.67, metana: 97 },
    { tanggal: '17 Juni 2026', suhu: 26.8, kelembapan: 66.1, tekanan: 93.71, metana: 97 },
  ],
  // Keterangan yang muncul sesuai hari (indeks 0 = hari 1).
  keteranganHari: [
    'Metana belum terdeteksi. Perangkat tetap mengirim suhu, kelembapan, dan tekanan setiap 2 detik.',
    'Metana belum terdeteksi. Suhu dan kelembapan nyaris tidak berubah.',
    'Metana belum terdeteksi. Fermentasi masih berjalan di dalam tong.',
    'Hari terakhir dengan 0 ppm.',
    'Metana mulai terdeteksi: 97 ppm. Fermentasi mulai menghasilkan gas.',
    'Kadar metana bertahan di 97 ppm, masih dalam kategori aman (di bawah 200 ppm).',
    'Kadar metana tetap 97 ppm sampai hari terakhir pengujian.',
  ],
  batasWaspada: 200,
  penutup: {
    judul: 'Lalu biogasnya menyala.',
    teks: 'Gas dari digester berhasil menyalakan api. Nyala biru tipis di ujung katup kiri adalah ciri khas pembakaran metana.',
    foto: fotoApi,
    alt: 'Nyala api biru tipis di ujung katup gas pada tong composter biru',
    kredit: 'Bingkai dari video uji, buku TA Gambar 4.7',
    // Tulisan di atas foto yang masih buram, sebelum replay mencapai hari ke-7.
    menunggu: 'Menunggu hasil hari ke-7',
  },
  catatan:
    'Satu pembacaan per hari, 11–17 Juni 2026. Sumber: buku Tugas Akhir, Tabel 5.2–5.4. Tekanan yang dibaca BMP180 adalah tekanan absolut, bukan tekanan gas di dalam tong.',
  ringkasan: [
    { nilai: '2 detik', label: 'interval pengiriman data dari ESP32' },
    { nilai: '< 1%', label: 'variasi pembacaan suhu dan kelembapan selama 7 hari' },
    { nilai: '7 dari 7', label: 'uji pengiriman berhasil, tanpa data hilang' },
    { nilai: 'Web + HP', label: 'notifikasi muncul saat nilai keluar batas' },
  ],
}

export const proyek = {
  judul: 'Proyek',
  biogas: {
    tahun: '2026',
    nama: 'Smart Biogas',
    subjudul: 'Sistem monitoring biogas berbasis IoT',
    info: [
      { label: 'Konteks', nilai: 'Tugas Akhir Capstone' },
      { label: 'Tim', nilai: '3 orang' },
      { label: 'Peran saya', nilai: 'Hardware' },
      { label: 'Waktu', nilai: 'Maret–Juni 2026' },
    ],
    // ukuran = [lebar, tinggi] foto dalam piksel. Jika foto diganti, ubah juga
    // angkanya supaya tinggi foto di galeri tetap sejajar.
    foto: [
      {
        src: fotoPerangkat,
        ukuran: [441, 773],
        alt: 'Papan ESP32 dan sensor terpasang di sisi tong composter biru',
        caption: 'Perangkat terpasang di tong composter',
      },
      {
        src: fotoCasing,
        ukuran: [523, 497],
        alt: 'Render 3D dua tong composter biru bertumpuk dengan selang dan katup',
        caption: 'Desain tong dan casing',
      },
      {
        src: fotoDashboard,
        ukuran: [1143, 634],
        alt: 'Dashboard web Smart Biogas menampilkan grafik tekanan dan peringatan',
        caption: 'Dashboard web buatan rekan tim, dengan peringatan otomatis',
      },
    ],
    masalah:
      'Pengguna biogas rumah tangga umumnya memantau digester secara manual atau hanya menebak. Mereka tidak tahu kapan gas siap dipakai atau kapan fermentasi terganggu, sehingga produksi gas sering tidak optimal.',
    solusi:
      'Sensor dipasang pada digester dan dihubungkan ke ESP32, yang mengirim data setiap 2 detik ke dashboard web. Pengguna mendapat notifikasi di website dan smartphone jika suhu, kelembapan, tekanan, atau kadar metana keluar dari batas aman.',
    dikerjakan: [
      'Merakit sensor DHT22 (suhu & kelembapan), BMP180 (tekanan, lewat I2C), dan MQ-4 (gas metana, lewat pin analog) ke ESP32',
      'Memasang sensor ke perangkat dan ke tong composter',
      'Mengerjakan casing perangkat',
    ],
    hasil: [
      'Sistem berjalan selama 7 hari pengujian; seluruh uji pengiriman data berhasil',
      'Gas metana mulai terdeteksi pada hari ke-5 (97 ppm), dan biogas berhasil menyalakan api',
      'Pembacaan suhu dan kelembapan stabil, dengan variasi di bawah 1%',
      'Notifikasi peringatan muncul di website dan di smartphone',
    ],
    pelajaran: [
      'BMP180 membaca tekanan absolut (setara tekanan udara sekitar), bukan tekanan gas di dalam digester. Versi berikutnya butuh sensor tekanan diferensial.',
      'Sensor gas MQ-4 perlu dipanaskan dan dikalibrasi di udara bersih sebelum hasilnya bisa dipercaya.',
      'Sistem masih bergantung pada internet. Versi berikutnya perlu penyimpanan data lokal saat koneksi putus.',
    ],
    kredit:
      'Dikerjakan bersama Abid Abdillah Daniel dan Muhammad Ilham Alfarizqi. Pemrograman firmware, server, dan dashboard web dikerjakan rekan tim.',
  },
  gelas: {
    tahun: '2025',
    nama: 'Gelas Pintar',
    subjudul: 'Pendeteksi suhu dan isi gelas',
    info: [
      { label: 'Konteks', nilai: 'Mata kuliah Embedded System' },
      { label: 'Tim', nilai: '2 orang, bersama Muhammad Farhan' },
      { label: 'Status', nilai: 'Prototipe' },
    ],
    lcd: ['Suhu = XX.X °C', 'Volume = XXX ml'],
    lcdKeterangan: 'Format tampilan di LCD 16x2',
    masalah:
      'Kita sering tidak tahu apakah minuman masih terlalu panas, dan sulit mengetahui sisa isi gelas tanpa melihat langsung, misalnya saat gelap atau bagi pengguna dengan keterbatasan penglihatan.',
    caraKerja: [
      'Suhu dibaca tanpa menyentuh air, memakai sensor inframerah MLX90614.',
      'Isi gelas dihitung dari beratnya: load cell menimbang air, dan 1 gram air kira-kira sama dengan 1 ml.',
      'Hasilnya tampil di layar LCD.',
    ],
    dikerjakan: [
      'Merakit Arduino Uno, LCD 16x2, dan sensor berat (load cell + HX711)',
      'Merakit keseluruhan prototipe dan mengembangkan program bersama rekan tim',
    ],
  },
}

export const pengalaman = {
  judul: 'Pengalaman',
  posisi: 'Kerja Praktik, IT Support',
  tempat: 'Unit Layanan TLR, Diskominfo Kota Tangerang',
  waktu: '1 Juli – 9 Agustus 2025',
  catatanWaktu: 'Sekitar 6 minggu, di ruang data server',
  angka: [
    { nilai: '100%', label: 'uptime' },
    { nilai: '2 ms', label: 'latency rata-rata' },
    { nilai: '0%', label: 'packet loss' },
  ],
  angkaKeterangan: 'Jalur pemantauan utama, dari ping report',
  poin: [
    'Memantau jaringan WiFi pemerintahan kota dengan UniFi Network Controller dan ESP Web Tools.',
    'Menemukan beberapa segmen internal yang latency-nya naik hingga 10–15 ms pada jam sibuk, lalu menyusun rekomendasi: cek ulang tiap segmen, tambah sensor PRTG permanen, dan terapkan load balancing.',
    'Menginstal AlmaLinux di server (BIOS/UEFI, partisi, user, firewall, SSH) dan menjalankan Docker Coolify untuk layanan berbasis kontainer.',
    'Kerja lapangan: survei lokasi, mematikan, lalu mencabut antena dan router lama di sekitar Masjid Raya Tangerang yang berpotensi mengganggu jaringan aktif.',
    'Mendokumentasikan pekerjaan teknis sebagai acuan unit.',
  ],
  penghubung:
    'Perangkat IoT hanya berguna jika jaringannya stabil dan servernya siap menerima data. Di sini saya belajar sisi itu, termasuk bekerja langsung di lapangan.',
  foto: {
    src: fotoLapangan,
    alt: 'Bekerja di atas tangga pada tiang perangkat jaringan, dengan kubah Masjid Raya Tangerang di latar',
    caption: 'Kerja lapangan di sekitar Masjid Raya Tangerang',
  },
}

export const keahlian = {
  judul: 'Keahlian',
  pengantar: 'Setiap keahlian saya tulis bersama tempat saya memakainya.',
  kelompok: [
    {
      nama: 'IoT & hardware',
      isi: 'ESP32, Arduino Uno, DHT22, BMP180, MQ-4, MLX90614, load cell + HX711, LCD 16x2, antarmuka I2C, ADC, dan digital',
      dipakai: 'Tugas Akhir, Gelas Pintar',
    },
    {
      nama: 'Perakitan & instalasi',
      isi: 'Merakit sensor ke mikrokontroler, memasang sensor di perangkat dan di lokasi, membuat casing',
      dipakai: 'Tugas Akhir, Gelas Pintar',
    },
    {
      nama: 'Linux & server',
      isi: 'AlmaLinux, Ubuntu, SSH, firewall, Docker (Coolify)',
      dipakai: 'Kerja Praktik',
    },
    {
      nama: 'Jaringan',
      isi: 'UniFi Network Controller, ESP Web Tools, PRTG, analisis ping (latency, packet loss, uptime), pembongkaran perangkat jaringan di lapangan',
      dipakai: 'Kerja Praktik',
    },
    {
      nama: 'Simulasi & dokumentasi',
      isi: 'Tinkercad, Wokwi, diagram blok, flowchart, dokumentasi teknis',
      dipakai: 'Perkuliahan, Kerja Praktik',
    },
    {
      nama: 'Lainnya',
      isi: 'Microsoft Office, Excel, Canva',
      dipakai: 'Sehari-hari',
    },
  ],
  sedangDipelajari: 'Pemrograman Arduino (C/C++) dan MQTT',
}

export const pendidikan = {
  judul: 'Pendidikan',
  jurusan: 'S1 Teknik Komputer',
  kampus: 'Telkom University',
  waktu: '2022 – 2026',
  ta: 'Sistem Monitoring Biogas Berbasis IoT untuk Optimalisasi Pemanfaatan Energi Mandiri di Lingkungan Rumah Tangga',
  ipk: '',
  kursus: 'Study Group SEA, Web Developer (2023)',
}

export const kontak = {
  judul: 'Hubungi saya',
  teks: 'Saya sedang mencari posisi IoT Field / Implementation Engineer atau Junior IoT Hardware Engineer, dan siap ditempatkan di luar kota. Cara tercepat menghubungi saya lewat email atau WhatsApp.',
}

// Footer (kaki halaman) bergaya "kotak judul" gambar teknik di tepi papan PCB.
// Tahun hak cipta dan bulan "Diperbarui" terisi otomatis setiap kali website di-build.
export const kaki = {
  labelHakCipta: 'Hak cipta',
  labelLokasi: 'Lokasi',
  labelDiperbarui: 'Diperbarui',
  kembaliKeAtas: 'Kembali ke atas',
  // Tulisan sablon di jalur tembaga footer (nomor revisi terisi otomatis).
  namaPapan: 'PORTO-ISA',
}
