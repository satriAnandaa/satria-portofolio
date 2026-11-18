# Mengelola portofolio

## Menjalankan dan membuat akun pemilik

Ikuti README untuk menyalakan database dan aplikasi. Jalankan `npm run admin:create` dari terminal proyek. Masukkan email dan password minimal 12 karakter; password tidak ditampilkan atau disimpan pada source code. Tidak ada akun/default password bawaan.

Buka `http://localhost:3000/admin` dan login menggunakan akun tersebut. Login ini milik Payload, bukan akun Supabase Auth. Pendaftaran publik melalui API ditolak. Bila belum mempunyai akun, jangan memakai form create-first-user bawaan; gunakan terminal bootstrap di atas.

## Menu utama

- **Profil & CV:** nama, lokasi, arah karier, bio, foto, kontak, tautan sosial, PDF CV opsional.
- **Situs & beranda:** SEO, teks hero, query ilustratif, navigasi, judul bagian, dan bagian yang ditampilkan.
- **Proyek:** konteks, kontribusi, hasil/bukti, keterbatasan, teknologi, gambar, tautan demo/repo, urutan, unggulan, tahap proyek.
- **Kelompok keahlian / Langkah proses / Pengalaman / Pendidikan:** tambah dan ubah isi yang terkait.
- **Media:** unggah PNG/JPG/WebP/PDF, maksimum 4 MiB per file. Gambar memerlukan alt text.
- **Akun pemilik:** informasi akun yang sudah dibuat.

## Draft, publish, dan arsip

1. Tambahkan atau edit entri.
2. Simpan draft jika belum siap tampil.
3. Gunakan Preview pada editor proyek/pengaturan atau tautan “Preview draft” di dashboard. Preview memerlukan sesi admin dan tidak dapat dibuka pengunjung anonim.
4. Periksa tampilan dan penanda informasi kosong.
5. Publikasikan. Halaman publik membaca data terbaru tanpa build ulang.
6. Untuk menarik konten, gunakan Unpublish. Untuk menyimpan entri di admin tetapi tidak menampilkannya, centang **Arsipkan** lalu publikasikan perubahan.

**Konsep** adalah tahap proyek, bukan status publikasi. Proyek konsep boleh dipublikasikan dengan label yang jelas. Menandai selesai tidak otomatis menambah hasil atau angka pencapaian.

Riwayat versi tersedia pada editor. Pemulihan versi mengubah konten; periksa status publikasinya sesudah restore. Retensi maksimum 20 versi per dokumen/global.

## Media dan CV

Media baru default **Privat / draft**. Media privat tidak dapat dibaca melalui endpoint file oleh pengunjung. Ubah visibilitas ke **Publik** hanya jika siap dibagikan, lalu pilih pada profil/proyek. Visibilitas file bersifat terpisah dari status draft entri: file yang sengaja ditandai publik memang dapat dibaca lewat URL-nya.

CV di `/cv` menggunakan profil, pengalaman, pendidikan, dan keahlian yang sama dengan beranda. Tombol cetak membuka dialog browser. Untuk PDF final, unggah PDF yang valid dan pilih di “PDF CV final”; tautan unduh hanya muncul jika berkas tersedia untuk publik.

Foto bawaan tetap tersedia sebagai aset statis lokal dalam repositori. Foto dari admin dapat menggantikannya. Jangan unggah file placeholder bawaan sebagai karya asli.

## Kelengkapan konten

Dashboard menampilkan proyek yang masih kekurangan kontribusi atau hasil. Field kosong dirender sebagai penanda pengisian. Lengkapi hanya dengan informasi yang benar-benar dapat diverifikasi; jangan mengarang perusahaan, keterampilan, atau metrik.

Urutan memakai angka: nilai kecil tampil lebih awal. Toggle bagian dan navigasi diatur melalui Situs & beranda; menu ke bagian tersembunyi otomatis tidak ditampilkan.

## Tampilan studio dan bagian opsional

Dashboard baru menampilkan jumlah konten CMS yang sebenarnya, pintasan pengeditan, serta proyek yang perlu dilengkapi.

Di **Situs & beranda → Tampilan & tombol**, pilih aksen Lime, Mint, atau Amber, tampilkan tautan sosial hero, dan ubah teks tombol atau ajakan footer. Nama dan arah karier pada hero berasal dari **Profil & CV**. Field judul hero lama menjadi pernyataan pada bagian tentang.

Lima menu tambahan tersedia dalam keadaan kosong.

- **Layanan** memuat ringkasan, rincian, ikon, dan cakupan.
- **Penghargaan** memuat penerbit, tanggal, keterangan, dan bukti.
- **Testimoni** memuat nama pemberi, peran, kutipan asli, dan sumber.
- **Paket harga** memuat label harga, satuan, fitur, dan tombol konsultasi.
- **Artikel blog** memuat slug unik, kategori, ringkasan, isi teks biasa, tanggal, dan sampul.

Untuk menampilkan suatu bagian, buat entri yang valid, publikasikan, lalu aktifkan bagiannya di **Situs & beranda → Bagian opsional** dan publikasikan pengaturan. Jika Anda menambahkan entri judulnya di **Bagian halaman**, centang Tampilkan. Bagian tanpa konten publik tetap tersembunyi. Tautan bagian tambahan masuk menu Jelajahi secara otomatis jika belum ada di navigasi.

Blog menggunakan rute /blog dan /blog/slug-artikel. Artikel mendukung paragraf yang dipisahkan baris kosong. Preview artikel dapat dibuka oleh admin sebelum bagian blog diaktifkan.

Ilustrasi konsep proyek bawaan dibuat dengan HTML/CSS/SVG dan diberi label. Unggah sampul karya Anda untuk menggantikannya.

## Pemulihan akun

Jika SMTP sudah dikonfigurasi, gunakan reset password melalui email. Tanpa SMTP, email reset tidak dikirim dan token tidak dicetak ke log. Operator yang mempunyai akses environment/database dapat menjalankan `npm run admin:reset` di terminal lalu memasukkan email dan password baru. Jangan membagikan password melalui chat atau memasukkannya ke argumen command.

## Kontak website

Formulir publik hanya menyiapkan draf email. Pesan harus dikirim sendiri dari aplikasi email pengunjung. Admin tidak menyediakan inbox pesan.

Tombol Hire Me membuka /contact. Peta pada halaman kontak dan beranda memakai field Lokasi dari Profil & CV, dengan keterangan lokasi umum. Ubah field tersebut jika wilayah yang ingin ditampilkan berubah.

Judul profesi bergantian menggunakan Arah karier dari Profil & CV. Pisahkan dua peran dengan tanda /. Teks berjalan memakai peran yang sama dan ajakan footer yang tersedia. Pengunjung dapat menjeda animasi melalui tombol jeda di kiri bawah. Pilihan ini tersimpan pada browser, sementara preferensi reduced motion perangkat selalu dihormati.
