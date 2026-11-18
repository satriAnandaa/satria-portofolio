# Satria Data Lab — Next.js + Tailwind + Payload

Portofolio Data Lab memakai Next.js App Router, TypeScript, Tailwind CSS, dan Payload CMS. Desain memakai hitam–lime, tipografi condensed, garis kontur, dan kartu proyek visual. Konten disimpan di PostgreSQL. Beranda dan CV memakai sumber data yang sama. Produksi disiapkan untuk Vercel, Supabase PostgreSQL, dan Supabase Storage.

## Pembaruan desain

Halaman publik dan admin Content Studio memakai identitas visual yang selaras. Tema terang/gelap, navigasi mobile, ilustrasi konsep, dan preferensi reduced motion didukung. Font Oswald tersedia lokal dengan lisensi SIL OFL di public/fonts/Oswald-OFL.txt. Kontur dan ilustrasi dibuat sebagai aset kode lokal.

Layanan, penghargaan, testimoni, paket harga, dan blog tersedia sebagai koleksi kosong di admin. Bagian tersebut tampil setelah konten dipublikasikan dan bagiannya diaktifkan. Alur pengisian dijelaskan di ADMIN_GUIDE.md. Migrasi reference_design menambahkan tabel dan pengaturan tanpa menghapus konten lama.

## Pertama kali menjalankan

Runtime yang diperlukan tercantum di .nvmrc dan engine package.json. Proyek juga memasang Node lokal sebagai devDependency; perintah npm run memakai runtime tersebut setelah instalasi. Instalasi Node global tidak diubah.

```sh
npm ci
npm run setup:local
```

Terminal pertama:

```sh
npm run db:local
```

Terminal kedua:

```sh
npm run db:migrate
npm run seed
npm run admin:create
npm run dev
```

Buka http://localhost:3000, admin http://localhost:3000/admin, CV http://localhost:3000/cv.

- setup:local membuat .env dengan rahasia acak bila belum ada; tidak menimpa konfigurasi lama.
- PostgreSQL lokal persisten di .data/postgres, hanya mendengarkan loopback. Tidak membutuhkan Docker.
- Schema dilacak dalam src/migrations; DATABASE_PUSH=false adalah pengaturan normal.
- Seed mengisi entri awal yang belum ada tanpa menimpa edit admin.
- Akun pemilik dibuat melalui terminal dengan input password tersembunyi. Tidak ada default password atau pendaftaran publik.
- Pada sandbox Windows, proses Node/PostgreSQL mungkin memerlukan izin eksekusi di luar sandbox editor.

## Penggunaan rutin

Nyalakan npm run db:local, lalu npm run dev di terminal lain. Untuk server produksi lokal:

```sh
npm run build
npm start
```

Database dan upload tidak masuk Git. Ctrl+C pada terminal database menghentikannya tanpa menghapus data.

## Struktur

- src/app/(frontend): halaman publik, CV, detail proyek, preview, dan gaya frontend.
- src/app/(payload): admin dan API CMS; gaya admin terpisah dari frontend.
- src/components: komponen layout, bagian website, formulir, tema, dan dashboard.
- src/collections dan src/globals: schema, versi/draft, akses, dan validasi.
- src/lib/content.ts: pembacaan konten di server dengan access control.
- src/data/initial-content.json: data seed hasil ekstraksi website lama, bukan fallback runtime.
- src/scripts: seed, pembuatan akun, dan pemulihan akses.
- src/migrations: migrasi PostgreSQL untuk schema portfolio.
- public/assets: aset lokal yang digunakan aplikasi.
- tests: unit test validasi dan integrasi HTTP.
- ADMIN_GUIDE.md: pengelolaan konten.
- DEPLOYMENT.md: environment, Vercel/Supabase, backup, dan rollback.

HTML/CSS/JS lama dipertahankan sebagai referensi; tidak lagi menjadi sumber runtime. Snapshot sebelum migrasi tersedia di .migration-backup (diabaikan Git). /index.html dan /resume.html diarahkan ke rute Next.js baru.

## Admin dan konten

Buka /admin untuk mengubah profil, teks situs, proyek, keahlian, proses, pengalaman, pendidikan, serta media. Draft hanya untuk pemilik. Publish memperbarui halaman tanpa build ulang; halaman membaca database secara dinamis.

Status draft/published berbeda dari tahap concept/in-progress/completed. Ada pengurutan, unggulan, arsip, preview terlindungi, riwayat versi, dan ringkasan proyek yang belum lengkap.

Media baru default privat. Ubah ke publik hanya jika file memang siap dibagikan. Media privat tidak dapat dibaca pengunjung melalui endpoint file. Gambar memerlukan alt text; format PNG/JPG/WebP/PDF maksimal 4 MiB. Foto statis bawaan di public/assets memang publik.

Beranda dan /cv memakai profil, keahlian, pengalaman, dan pendidikan yang sama. PDF final hanya ditautkan jika file telah diunggah dan tersedia publik. CV tetap dapat dicetak dari browser.

## Integritas konten dan kontak

Informasi pribadi, arah karier, teknologi, pengalaman, dan tiga konsep lama dipertahankan. Kontribusi atau hasil yang belum diketahui disimpan kosong dan diberi penanda. Tidak ada perusahaan, pencapaian, atau keahlian tambahan buatan. Lihat CONTENT_GUIDE.md.

File gambar proyek/PDF bawaan yang hanya berisi placeholder tidak dipakai sebagai karya atau CV valid. Formulir publik hanya membuka draf mailto; pesan dikirim sendiri lewat aplikasi email pengunjung.

Reset password lewat email memerlukan SMTP. Tanpa SMTP, gunakan npm run admin:reset; token reset tidak dicetak ke log.

## Pemeriksaan

```sh
npm run typecheck
npm test
npm run build
```

Dengan database dan server produksi lokal yang aktif:

```sh
npm run test:integration
```

Integration test dibatasi ke host/database loopback dan membuat/menghapus data serta akun QA sementara. TEST_SERVER_URL opsional mengatur origin lokal. QA_KEEP_SESSION hanya untuk pengujian browser; akun sementara wajib dibersihkan setelahnya. Jangan menjalankan integration test terhadap produksi.

## Deployment dan keamanan konfigurasi

Ikuti DEPLOYMENT.md dan .env.production.example. Jangan memasukkan .env, folder database, atau password ke Git. Aplikasi menolak storage lokal di Vercel. Bucket Supabase harus privat dengan S3 access key/secret khusus server.

Schema portfolio tidak boleh diekspos melalui Supabase Data API. Login Payload berbeda dari Supabase Auth. Jangan menambahkan Prisma atau sistem autentikasi lain untuk mengelola CMS yang sama.

Versi dikunci melalui package-lock.json. Override DOMPurify dan esbuild menindaklanjuti temuan audit transitif tanpa menurunkan Payload. Masih ada temuan low severity pada deepmerge melalui Payload yang belum memiliki patch upstream pada pemeriksaan ini; audit belum sepenuhnya bersih. Periksa ulang saat memperbarui dependensi.
