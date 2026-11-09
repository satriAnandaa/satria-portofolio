# Satria Ananda — Data Lab Editorial

Portofolio statis berbahasa Indonesia dengan HTML, CSS, dan JavaScript murni. Tidak membutuhkan build, paket, CDN, font eksternal, maupun library visualisasi.

## Menjalankan

Buka `index.html` di browser atau gunakan Live Server. Server lokal opsional:

```sh
python -m http.server 5500 --bind 127.0.0.1
```

Buka `http://127.0.0.1:5500`. CV berada di `resume.html`; gunakan tombol cetak untuk menyimpan PDF melalui browser.

## Struktur

- `index.html`: halaman editorial, catatan proyek, toolkit, kerangka proses, profil, pengalaman, pendidikan, dan kontak.
- `css/style.css`: token dua tema, layout responsif, komponen bersama, dan gaya cetak CV.
- `js/main.js`: tema tersimpan, menu seluler, navigasi bagian aktif, validasi/draf email, dan tombol cetak CV.
- `resume.html`: CV dengan informasi yang konsisten dengan halaman utama.
- `CONTENT_GUIDE.md`: daftar informasi yang perlu dilengkapi dan lokasi pengeditan.
- `assets/favicon.svg`: monogram lokal.
- `assets/images/about.png`: foto profil kecil; `hero.png`: foto pribadi dalam catatan “Di luar layar”.

## Prinsip konten

Data Analyst dan Backend Developer disajikan sebagai **arah karier**, bukan klaim pengalaman kerja pada kedua posisi tersebut. Teknologi hanya berasal dari profil yang sudah ada. Tidak ada penambahan Python, Excel, BI tools, perusahaan, hasil terukur, ataupun proyek data baru.

Tiga konsep lama tetap dipertahankan: Analytics UI, Brand Launch, dan Creative Portfolio. Kolom yang belum memiliki informasi ditandai “Belum diisi” atau “Perlu dilengkapi”. Bagian studi kasus data/backend merupakan template pengisian, bukan proyek baru. Kerangka proses kerja merupakan pendekatan yang dituju, bukan laporan proyek yang sudah selesai.

Hero berisi query MySQL dan diagram alur **ilustratif**. Query tidak dieksekusi. Tidak ada grafik dengan angka buatan, statistik pencapaian, atau hasil query fiktif. Filter dihilangkan karena arsip hanya berisi tiga konsep; seluruh catatan dapat dibaca dengan elemen HTML `details`.

File `project1.png`, `project2.png`, `project3.png`, dan `assets/resume/CV.pdf` bawaan hanya berisi teks placeholder. File tersebut dipertahankan, tetapi tidak ditautkan sebagai aset valid. Tautan CV menuju `resume.html` yang benar-benar tersedia.

## Menyesuaikan

Ubah konten langsung di HTML pada bagian yang bersangkutan. Tidak ada data proyek duplikat di JavaScript. Perbarui `index.html` dan `resume.html` bersamaan bila profil, pengalaman, atau kontak berubah.

Warna tersedia sebagai custom properties pada awal CSS. Tema mengikuti perangkat sampai pengunjung membuat pilihan; preferensi memakai kunci `satria-theme` di localStorage. Penyimpanan yang diblokir tidak menghentikan pergantian tema.

## Kontak dan aksesibilitas

Formulir membuka draf `mailto:`; pesan harus dikirim sendiri dari aplikasi email. Tidak ada backend atau penyimpanan pesan. Tautan email langsung, WhatsApp, GitHub, LinkedIn, dan Instagram tetap tersedia.

Navigasi, catatan proyek, dan tautan bekerja tanpa JavaScript. Tombol menu mengumumkan status ARIA, mendukung Escape dan keyboard, serta tertutup saat pengunjung berpindah bagian. Tidak ada animasi berulang; efek masuk singkat dimatikan saat `prefers-reduced-motion: reduce`. Fokus keyboard, skip link, heading, alt text, dan tata letak cetak tersedia.

## Verifikasi pada pengerjaan ini

- `node --check js/main.js` dan pemeriksaan whitespace Git.
- Pemeriksaan ID unik, heading utama, label formulir, alt text, path aset, dan anchor lintas halaman menggunakan parser HTML.
- Chrome headless: viewport 320, 375, 600, 768, 820, 1024, dan 1440 piksel pada kedua tema, termasuk saat catatan proyek dibuka.
- Navigasi dengan Enter/Tab/Escape, pembukaan catatan native, navigasi dan catatan tanpa JavaScript, persistensi tema, serta tema saat localStorage diblokir.
- Validasi formulir kosong, email tidak valid, nama hanya spasi, pengodean draf email, dan status yang tidak mengklaim pesan terkirim.
- Pemeriksaan warna terhitung pada teks yang terlihat di kedua tema; ambang 4.5:1 untuk teks biasa dan 3:1 untuk teks besar. Border formulir melewati 3:1 terhadap latarnya. Ini bukan audit aksesibilitas menyeluruh.
- CV dimuat, kontrol cetak disembunyikan pada media print, dan browser berhasil menghasilkan dokumen PDF.

Tidak ada pengiriman email, pemeriksaan langsung profil eksternal, atau pengujian pada perangkat seluler fisik. Pemeriksaan responsif menggunakan emulasi viewport Chrome.
