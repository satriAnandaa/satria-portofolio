# Hasil verifikasi migrasi lokal

## Perbaikan Pustaka media dan foto proyek 18 November 2026

- Mereproduksi halaman daftar media kosong di produksi. Log Vercel menunjukkan query gagal karena kolom portfolio.media._objectkey belum ada; halaman unggah tetap dapat terbuka.
- Menambahkan migrasi 20261118_032500_media_storage_key yang hanya menambah kolom nullable _objectkey. Menyatakan field tersembunyi _objectKey pada koleksi media agar bentuk skema konsisten pada penyimpanan lokal dan S3.
- Migrasi produksi berhasil. Halaman daftar media kembali menampilkan judul, pencarian, tombol membuat berkas, unggah massal, dan keadaan kosong yang benar.
- Uji satu PNG privat melalui Payload berhasil mengunggah ke S3, membaca metadata, memverifikasi objek S3, dan memastikan pengunjung anonim tidak dapat menemukan media privat. Objek dan record uji dihapus; jumlah media kembali seperti semula.
- Kolom Foto / gambar proyek dipindah tepat setelah judul dengan petunjuk unggah baru atau memilih berkas yang ada. Nama field cover dipertahankan sehingga referensi foto proyek tidak berubah.
- TypeScript dan build produksi berhasil.
- Verifikasi dialog Buat Baru menemukan kegagalan autentikasi pada server action. URL server, allowlist CSRF, dan tautan pratinjau kini menggunakan domain produksi yang disediakan Vercel saat berjalan di produksi; tidak menggunakan Origin dari request dan tidak melonggarkan allowlist.
- Pengujian regresi memastikan domain produksi mengungguli URL impor yang lama, serta konfigurasi lokal/self-hosted tetap memakai origin eksplisit.

## Perapian admin 18 November 2026

- Meninjau rekaman 20261118-0247-54.6329795.mp4: beranda, menu samping, dan formulir media.
- Beranda diganti dengan dashboard khusus agar tidak mengulang daftar kartu koleksi bawaan. Ringkasan tetap membaca data melalui akses pengguna yang login.
- Memeriksa dashboard dengan akun sementara pada database lokal: tautan utama, kelompok menu, dan buka/tutup bagian tambahan berfungsi.
- Memeriksa tema terang dan gelap, desktop 1280 px, serta ponsel 390 px. Dashboard dan formulir media tidak memiliki overflow horizontal pada lebar yang diperiksa.
- Formulir proyek menampilkan Simpan draf dan Terbitkan perubahan dalam bahasa Indonesia; unggahan menampilkan batas berkas dan penjelasan visibilitas.
- Memperbaiki ikon SA yang terpotong pada breadcrumb admin.
- TypeScript, tiga pengujian unit, git diff --check, dan build produksi berhasil. Pemeriksaan visual memakai server pengembangan lokal; perubahan belum di-push atau di-deploy.
- Akun uji lokal dan berkas kredensial sementara telah dihapus. Konten portofolio tidak diubah selama pemeriksaan.
- Tangkapan layar lokal tersimpan di .data/admin-redesign-desktop.jpg, .data/admin-redesign-light.jpg, dan .data/admin-redesign-mobile.jpg (diabaikan Git).

## Persiapan Supabase 18 November 2026

- Koneksi Session pooler berhasil memakai sslmode=verify-full dan sertifikat supabase-ca.crt.
- Bucket portfolio terverifikasi privat melalui metadata Storage. Akses S3 untuk membaca bucket serta mengunggah, membaca, dan menghapus satu objek sementara berhasil. Objek uji telah dihapus.
- Schema portfolio belum tersedia sebelum migrasi. Dua migrasi yang terdaftar diterapkan tanpa DROP, TRUNCATE, atau DELETE pada perintah UP.
- Seed berhasil mengisi profil dan pengaturan, tiga proyek, empat kelompok keahlian, empat langkah proses, tiga pengalaman, dan satu pendidikan.
- Lima koleksi opsional dan media masih kosong. Belum ada akun admin di database ini.
- Role anon dan authenticated tidak mempunyai akses USAGE langsung ke schema portfolio.
- Deployment Vercel, login admin produksi, dan unggahan melalui antarmuka admin produksi menunggu konfigurasi langkah berikutnya.

## Interaksi video dan kontak dengan peta

Pembaruan lanjutan memakai video 20261110-0241-43.9867013.mp4. Simbol SA digunakan sebagai identitas website.

- Kursor lingkaran mengikuti mouse dengan gerakan tertunda dan membesar pada kontrol interaktif. Tombol menggunakan sorotan lingkaran dan gerak ringan mengikuti posisi pointer. Kursor bawaan tersedia untuk sentuhan.
- Judul profesi diketik bergantian memakai peran dari profil. Teks berjalan pada batas hero dan footer memakai konten yang tersedia.
- Tombol jeda mengendalikan typing, marquee, gerakan pointer, dan reveal. Preferensinya tersimpan di browser. Reduced motion perangkat diprioritaskan.
- Timer typing dihentikan saat judul keluar dari viewport atau tab tidak terlihat.
- Hire Me membuka /contact, dengan hero, breadcrumb, kontak asli, formulir draf email, dan Google Maps.
- Peta pada beranda dan /contact memakai lokasi umum Bali, Indonesia dari Profil & CV. Tidak ada alamat kantor rinci yang ditambahkan. Peta benar-benar dimuat di Chrome selama pemeriksaan.
- Query ilustratif dipindahkan ke area keahlian, menggunakan data CMS yang sama.
- Header tablet dan mobile memakai menu hamburger sampai lebar 1024 piksel. Tombol Hire Me tersedia di menu tersebut.
- Build produksi dan pemeriksaan TypeScript berhasil. Tiga unit test serta sembilan test integrasi HTTP lulus.
- Percobaan integrasi pada development mencapai batas waktu saat kompilasi. Fixture spesifik dibersihkan, kemudian suite dijalankan ulang terhadap build produksi dan lulus.
- Browser produksi diuji pada lebar beranda 320, 375, 600, 768, 820, 821, 900, 1024, dan 1440 piksel. Kontak diuji pada 320, 375, 600, 768, 820, 1024, dan 1440 piksel. Tidak ditemukan luapan horizontal.
- Gerakan mouse asli, hover, satu tombol Hire Me desktop yang terlihat, klik menuju kontak, jeda/lanjut, persistensi pilihan, mode sentuh, reduced motion, dan navigasi tanpa JavaScript lulus pengujian.
- Tanpa JavaScript, teks berjalan dihentikan dan kontrol animasi disembunyikan.
- Tidak ditemukan runtime exception atau respons HTTP gagal pada skenario browser akhir. Screenshot desktop/hover, peta, dan menu mobile ditinjau.

### Berkas pembaruan

- src/components/ui/PointerEffects.tsx
- src/components/ui/RoleTicker.tsx
- src/components/ui/MotionToggle.tsx
- src/components/ui/motion.ts
- src/components/ui/ScrollEffects.tsx
- src/components/layout/Header.tsx
- src/components/sections/Portfolio.tsx
- src/components/sections/ContactSection.tsx
- src/components/sections/SectionHeading.tsx
- src/components/sections/LabNotebook.tsx
- src/components/sections/Marquee.tsx
- src/components/sections/SiteFooter.tsx
- src/app/(frontend)/contact/page.tsx
- src/app/(frontend)/layout.tsx
- src/app/(frontend)/globals.css
- next.config.mjs
- tests/api.integration.ts
- ADMIN_GUIDE.md dan QA_RESULTS.md

## Respons interaksi dan logo monogram

Pembaruan lanjutan pada 10 November 2026 memakai video referensi yang dilampirkan. Logo diganti menjadi monogram SA pada header, footer, admin, dan favicon.

- Header merapat setelah scroll, navigasi aktif memiliki garis penanda, dan tombol/panah merespons hover.
- Konten di bawah layar muncul dengan transisi singkat saat memasuki viewport. Fokus keyboard membuka konten yang dituju.
- Tombol kembali ke atas menampilkan progres scroll yang dihitung dari posisi halaman.
- Menu mobile memakai tombol hamburger dan layout dua kolom dengan area gulir saat diperlukan.
- Pemeriksaan tipe, tiga unit test, dan build Next.js berhasil.
- Browser diperiksa pada lebar 320, 375, 600, 768, 820, 821, 900, 1024, dan 1440 piksel. Header mobile tetap satu baris dan tidak ditemukan luapan horizontal.
- Tombol kembali ke atas, progres scroll, transisi masuk, menu/Escape, reduced motion, serta fallback navigasi dan konten tanpa JavaScript lulus pemeriksaan browser.
- Screenshot desktop, mobile, menu terbuka, dan keadaan setelah scroll ditinjau. Tidak ditemukan runtime exception pada skenario ini.

Berkas terkait meliputi src/components/ui/Design.tsx, src/components/ui/ScrollEffects.tsx, src/components/layout/Header.tsx, src/components/sections/Portfolio.tsx, src/app/(frontend)/globals.css, src/app/(payload)/studio.css, dan public/assets/favicon.svg.

## Verifikasi pembaruan desain 10 November 2026

- Build produksi Next.js dan pemeriksaan TypeScript berhasil.
- Tiga unit test dan sembilan test integrasi HTTP, termasuk test induk, lulus.
- Migrasi tambahan reference_design diterapkan pada database lokal. Perintah UP hanya menambahkan tabel, kolom, enum, indeks, dan relasi.
- Lima koleksi opsional dimulai kosong. Pengujian membuktikan draft privat, konten terpublikasi tetap tersembunyi sebelum aktivasi, dan bagian tanpa konten publik tidak ditampilkan.
- Rute blog, artikel, dan preview artikel tersedia. Unpublish artikel mengembalikan halaman publik ke 404.
- Screenshot beranda, karya, kontak, pengalaman, dua tema, login, dashboard, editor artikel, dan pengaturan admin ditinjau.
- Halaman utama diperiksa pada lebar 320, 375, 600, 768, 820, 1024, dan 1440 piksel. Bagian opsional berisi fixture diuji tambahan pada lebar 821 dan 900 piksel. Tidak ditemukan luapan horizontal pada skenario tersebut.
- Menu mobile membuka dan menutup dengan Escape. Menu Jelajahi untuk bagian opsional juga menutup dengan Escape.
- Tema tersimpan setelah reload. Reduced motion menonaktifkan animasi dan smooth scrolling.
- Semua anchor bagian yang tampil terhubung ke elemen tujuan. Gambar lokal berhasil dimuat.
- Formulir menghasilkan tautan draf email dan menyatakan pesan belum terkirim.
- Navigasi mobile tetap terlihat saat JavaScript dimatikan.
- CV menghasilkan PDF melalui Chrome dan menyembunyikan navigasi saat dicetak.
- Pemeriksaan otomatis kontras teks terlihat pada halaman utama melewati ambang 4.5 untuk teks biasa dan 3 untuk teks besar pada dua tema. Pemeriksaan ini memperhitungkan komposit warna latar, tetapi bukan audit aksesibilitas menyeluruh.
- Dashboard admin menampilkan jumlah konten sebenarnya, pintasan lima koleksi kosong, dan penanda kelengkapan proyek. Login, pengaturan tampilan, field artikel, dan layout mobile diperiksa.
- Tidak ditemukan runtime exception pada skenario browser yang diuji.

Data fixture dan pengaturan sementara dipulihkan setelah pemeriksaan. Pengujian produksi Vercel/Supabase, SMTP nyata, perangkat fisik, dan ketersediaan akun sosial eksternal belum dilakukan.

### Berkas implementasi pembaruan desain

- src/components/sections/Portfolio.tsx
- src/components/sections/ProjectVisual.tsx
- src/components/layout/Header.tsx
- src/components/ui/Design.tsx
- src/components/ui/ThemeToggle.tsx
- src/components/admin/Brand.tsx
- src/components/admin/Welcome.tsx
- src/app/(frontend)/globals.css
- src/app/(frontend)/layout.tsx
- src/app/(frontend)/projects/[slug]/page.tsx
- src/app/(frontend)/blog/page.tsx
- src/app/(frontend)/blog/[slug]/page.tsx
- src/app/(frontend)/preview/route.ts
- src/app/(payload)/layout.tsx
- src/app/(payload)/studio.css
- src/app/(payload)/admin/importMap.js
- src/collections/content.ts
- src/collections/optional.ts
- src/globals/content.ts
- src/lib/content.ts
- src/payload.config.ts
- src/payload-types.ts
- src/migrations/20261110_012749_reference_design.ts dan snapshot JSON serta index.ts
- public/assets/design/contours.svg
- public/assets/favicon.svg
- public/fonts/Oswald.ttf dan Oswald-OFL.txt
- tests/api.integration.ts
- .gitignore, README.md, ADMIN_GUIDE.md, CONTENT_GUIDE.md, QA_RESULTS.md

## Catatan verifikasi migrasi sebelumnya

Pemeriksaan akhir pada 9 November 2026. Lingkup sesuai keputusan pemilik: versi lokal siap deploy; produksi Vercel/Supabase belum dihubungkan.

## Build dan database

- npm run typecheck: lolos.
- npm test: 3 unit test lolos.
- npm run build: build produksi Next.js berhasil.
- Migrasi PostgreSQL dari schema kosong berhasil. CMS memakai schema portfolio yang terpisah dari public.
- Seed berhasil dan dijalankan ulang tanpa menggandakan atau menimpa konten.
- Setelah PostgreSQL dihentikan dan dinyalakan ulang, tiga proyek asli serta metadata/file unggahan privat sementara masih tersedia.
- Unggahan, akun, dan revisi draft QA sementara dibersihkan. Tidak ada default admin/password tersisa.

## Integrasi HTTP terhadap build produksi

npm run test:integration: 8 test (termasuk suite induk) lolos.

- Pengunjung anonim ditolak saat menulis proyek, membaca akun, membuka preview, atau mendaftarkan akun pertama melalui API.
- Draft baru tidak terlihat melalui daftar, ID, halaman proyek, maupun query draft anonim.
- Publish/edit muncul tanpa build ulang. Revisi draft dari proyek terpublikasi tetap privat.
- Riwayat versi dapat dibaca oleh admin dan versi sebelumnya berhasil dipulihkan.
- Arsip dan unpublish menarik proyek dari halaman publik.
- Draft global beranda tidak bocor melalui halaman atau API publik.
- File palsu ditolak; file privat ditolak tanpa sesi, lalu dapat dibaca setelah visibilitasnya diubah menjadi publik.
- /index.html dan /resume.html mengarah ke rute baru; /cv memakai profil yang sama.

Test runner menggunakan test-force-exit setelah cleanup yang sudah di-await, karena modul Payload/Next dapat mempertahankan handle CLI. Data uji tidak dipertahankan oleh test normal.

## Browser Chrome

- Tampilan Next.js diperiksa pada lebar 320, 375, 600, 768, 820, 1024, dan 1440 piksel; tidak ada luapan horizontal pada halaman yang diperiksa.
- Screenshot desktop, mobile, dua tema, login admin, dashboard, serta editor proyek ditinjau.
- Login admin dan dashboard dengan laporan kelengkapan bekerja.
- Proyek dibuat melalui editor sebenarnya, disimpan draft, dipublikasikan, dan terlihat pada halaman publik. Data tersebut dihapus setelah pengujian.
- Preview browser hanya berhasil setelah autentikasi.
- Menu React mendukung Enter, Tab, dan Escape. Catatan proyek memakai details/summary native.
- Navigasi seluler tetap tersedia ketika JavaScript dimatikan.
- Tema tersimpan setelah reload dan tetap bisa diganti saat localStorage diblokir.
- Preferensi reduced motion menonaktifkan animasi masuk.
- Formulir menolak isian kosong, membuat draf mailto, dan secara eksplisit menyatakan pesan belum terkirim.
- Foto lokal bekerja melalui next/image.
- CV dapat dimuat, kontrol disembunyikan untuk print, dan browser berhasil menghasilkan PDF.
- Kontras teks yang terlihat lolos ambang 4.5:1 untuk teks biasa / 3:1 untuk teks besar pada kedua tema. Ini bukan audit aksesibilitas menyeluruh.
- Tidak ada runtime exception atau respons server 5xx pada skenario browser akhir yang diuji.

## Dependensi dan batas verifikasi

Audit awal menemukan DOMPurify dan esbuild transitif yang memerlukan patch. Override versi dipasang, kemudian generator, build, dan pengujian dijalankan kembali. Hasil instalasi/audit terakhir tidak melaporkan temuan moderate/high/critical; masih ada 10 temuan low yang berasal dari deepmerge melalui dependensi Payload dan belum mempunyai patch upstream.

Belum diuji:

- Koneksi database atau bucket Supabase aktual dan persistensi setelah redeploy Vercel.
- Pengiriman email/reset password melalui SMTP nyata.
- Perangkat seluler fisik atau semua kombinasi browser.
- Status aktif akun/tautan sosial eksternal.

Tidak ada email yang dikirim selama pengujian. Tidak ada akun provider, layanan berbayar, atau deployment produksi yang dibuat.
