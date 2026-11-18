# Deployment — Vercel, Supabase PostgreSQL, Supabase Storage

Database dan Storage Supabase telah dihubungkan melalui .env.production.local pada 18 November 2026. Koneksi database dengan verifikasi SSL penuh, akses bucket privat, dua migrasi, dan seed konten awal telah diverifikasi. Pembuatan akun admin serta konfigurasi domain dan deployment Vercel masih menjadi langkah berikutnya. Kredensial produksi disimpan pada file yang diabaikan Git.

## 1. Runtime dan database

Gunakan Node.js 24 yang memenuhi engine pada package.json. Semua paket Payload harus memakai versi yang sama. Jangan menjalankan aplikasi ini sebagai static export.

Buat atau pilih proyek Supabase. Ambil connection string PostgreSQL dari menu Connect. Gunakan koneksi pooler yang sesuai untuk lingkungan Vercel; masukkan password yang sudah di-URL-encode dan opsi SSL sesuai dashboard. Pool aplikasi dibatasi tiga koneksi per instance.

Sertifikat CA Supabase tersedia pada supabase-ca.crt di root proyek. Konfigurasi Next.js menyertakannya pada server deployment. Gunakan sslmode=verify-full&sslrootcert=supabase-ca.crt pada DATABASE_URL, termasuk connection string Transaction pooler yang dipasang di Vercel. Untuk migrasi dari komputer melalui IPv4, gunakan Session pooler. Sertifikat diverifikasi ketika membuka koneksi.

Payload memakai schema **portfolio**, terpisah dari schema public. Jangan tambahkan schema portfolio ke daftar schema yang diekspos Data API Supabase. Akses konten dan akun dilakukan melalui server Payload; jangan memberi anon/authenticated akses langsung ke tabel internal CMS. Akun admin Payload berbeda dari Supabase Auth.

## 2. Supabase Storage

1. Buat bucket privat, misalnya portfolio.
2. Dari pengaturan S3 Storage, buat access key/secret yang hanya dipasang pada server.
3. Catat endpoint S3 dan region dari dashboard Supabase.
4. Jangan menggunakan anon key atau service role key sebagai pengganti pasangan S3 access key/secret.
5. Akses file tetap melalui endpoint Payload yang menerapkan aturan Media. Jangan membuat bucket publik untuk menghindari pemeriksaan akses.

Contoh variabel terdapat di `.env.production.example`. Jangan memasukkan nilai rahasia ke NEXT_PUBLIC_* atau Git.

## 3. Environment Vercel

Atur:

- DATABASE_URL: connection string Supabase PostgreSQL.
- PAYLOAD_SECRET: nilai acak panjang, stabil antardeployment.
- NEXT_PUBLIC_SERVER_URL: origin HTTPS final, tanpa trailing slash.
- DATABASE_PUSH=false.
- STORAGE_DRIVER=s3.
- S3_BUCKET, S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY.
- SMTP_* opsional bila ingin reset password lewat email.

Folder upload lokal tidak digunakan di Vercel. Aplikasi menolak konfigurasi Vercel dengan STORAGE_DRIVER=local. Limit file 4 MiB dipilih agar berada di bawah batas body server Vercel; kompres gambar sebelum unggah jika diperlukan.

Environment preview/staging sebaiknya mempunyai database dan bucket sendiri. Jangan mengarahkan preview branch sembarangan ke database produksi.

## 4. Migrasi dan seed awal

Dari terminal operator dengan environment Supabase yang benar:

Untuk PowerShell, pilih file environment secara eksplisit sebelum perintah CLI:

```powershell
$env:DOTENV_CONFIG_PATH = '.env.production.local'
$env:NODE_ENV = 'production'
```

File tersebut harus berisi nilai asli dari template .env.production.example dan tetap diabaikan Git. Semua script CLI memuat dotenv; jangan mengandalkan Next.js saja untuk memilih environment database migrasi. Sesudah selesai, hapus kedua variabel tersebut dari sesi terminal bila ingin kembali ke konfigurasi lokal.

```sh
npm ci --include=dev
npm run db:migrate
npm run seed
npm run admin:create
npm run typecheck
npm run build
```

Pastikan DATABASE_URL benar sebelum perintah migrasi. Migrasi hanya dijalankan sekali per versi melalui proses release/operator, bukan oleh setiap request aplikasi. Seed mengisi data awal tanpa menimpa entri yang sudah mempunyai legacyId/imported. Jangan mengganti PAYLOAD_SECRET setelah membuat akun tanpa memahami dampaknya pada sesi.

Jangan menjalankan test:integration terhadap produksi; skrip dibatasi untuk host/database loopback.

## 5. Deploy aplikasi

Impor repositori ke Vercel dengan preset Next.js dan build command `npm run build`. Isi environment sebelum build. Gunakan npm dan lockfile yang tersedia. Tinjau staging sebelum mengganti domain publik.

Jika ingin menjalankan migrasi otomatis, gunakan job release terpisah dengan kredensial server dan kontrol concurrency. Jangan menyisipkan schema push atau seed yang menimpa data ke proses render.

## 6. Pemeriksaan setelah deploy

- /admin bisa login; pengguna anonim tidak bisa menambah konten atau membaca users.
- Draft dan /preview tidak terbuka tanpa sesi pemilik.
- Buat proyek draft → preview → publish → edit → unpublish. Hasil berubah tanpa deploy ulang.
- Unggah gambar privat dan pastikan URL ditolak tanpa login; ubah publik lalu pastikan bisa dibaca.
- Gambar/PDF tetap tersedia setelah deploy ulang.
- Beranda, /cv, dan tautan lama /resume.html konsisten.
- SMTP mengirim hanya bila memang dikonfigurasi.

## 7. Backup dan rollback

Backup PostgreSQL (schema portfolio beserta data/versi) dan objek Storage secara terpisah. Simpan PAYLOAD_SECRET pada pengelola rahasia. Uji restore ke staging sebelum mengandalkannya.

Rollback deployment tidak otomatis membatalkan perubahan schema. Cadangkan sebelum migrasi, gunakan perubahan schema yang kompatibel bila memungkinkan, dan rencanakan pemulihan data. Jangan menjalankan migrate:down/fresh/reset di produksi tanpa peninjauan.

## Referensi

- https://payloadcms.com/docs/upload/storage-adapters
- https://supabase.com/docs/guides/storage/s3/authentication
- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://nextjs.org/docs/app/guides/self-hosting
