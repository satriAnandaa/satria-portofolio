# Rencana migrasi — Next.js, Tailwind CSS, dan admin konten

Status: implementasi lokal selesai dan diuji. Sesuai pilihan pemilik, deployment belum dilakukan; konfigurasi produksi disiapkan untuk Vercel + Supabase PostgreSQL + Supabase Storage. Lihat README.md, ADMIN_GUIDE.md, DEPLOYMENT.md, dan QA_RESULTS.md untuk hasil aktual.

## 1. Tujuan dan batas lingkup

Migrasikan portofolio HTML/CSS/JavaScript menjadi aplikasi Next.js dengan Tailwind CSS. Pertahankan identitas Data Lab Editorial, konten pribadi yang tersedia, dua tema, aksesibilitas, aset lokal yang valid, dan CV siap cetak.

Tambahkan panel admin agar pemilik dapat mengubah konten tanpa mengedit kode: profil, teks beranda, proyek, keahlian, proses kerja, pengalaman, pendidikan, kontak, gambar, metadata SEO, dan CV.

Asumsi awal: satu pemilik/admin, satu bahasa Indonesia, konten terstruktur, dan tidak ada pendaftaran publik. Blog, multi-admin dengan peran berbeda, page builder bebas, serta inbox pesan bukan lingkup versi pertama. Formulir kontak tetap membuka draf email.

## 2. Kondisi proyek yang sudah diperiksa

- Halaman publik: `index.html`; CV: `resume.html`.
- Gaya dan perilaku: `css/style.css` dan `js/main.js`.
- Dokumentasi konten: `README.md` dan `CONTENT_GUIDE.md`.
- Tiga konsep: Analytics UI, Brand Launch, Creative Portfolio.
- Konten belum lengkap: kontribusi/hasil/bukti proyek, detail institusi/periode pengalaman dan pendidikan, serta studi kasus data/backend.
- Foto valid: `assets/images/about.png` dan `assets/images/hero.png`.
- Gambar proyek bawaan dan `assets/resume/CV.pdf` adalah placeholder; tidak boleh dimigrasikan sebagai unggahan valid.
- Belum tersedia package.json, database, autentikasi, atau backend aplikasi.
- Runtime teramati: Node.js 22.18.0, npm 11.5.2. Runtime ini harus diperiksa dan diperbarui sesuai versi Payload/Next yang dipilih sebelum instalasi.

## 3. Arsitektur yang direkomendasikan

| Bagian | Pilihan | Alasan |
| --- | --- | --- |
| Aplikasi | Next.js App Router + TypeScript | Halaman publik, CV, halaman proyek, dan admin dalam satu repositori |
| Tampilan publik | Tailwind CSS | Utility untuk layout dan komponen; token CSS untuk warna, tipografi, serta print |
| Admin | Payload CMS terintegrasi | Panel pengelolaan konten, autentikasi, media, draft, dan versi |
| Database | PostgreSQL melalui adapter Payload | Penyimpanan konten persisten; migrasi schema dapat dilacak |
| Media produksi | Object storage kompatibel S3 | Unggahan gambar/PDF tetap tersedia setelah deploy ulang |
| Rendering | Server Components sebagai default | Data dibaca di server; JavaScript klien dibatasi pada interaksi |

Next.js/React/Payload harus dipilih sebagai kombinasi versi yang kompatibel dan dikunci melalui lockfile. Jangan memasang seluruh paket dengan versi terbaru secara terpisah tanpa memeriksa kompatibilitas.

PostgreSQL di sini adalah keputusan infrastruktur aplikasi, bukan penambahan klaim keahlian pribadi pada portofolio.

Payload dipilih karena kebutuhan utamanya pengelolaan konten. Admin custom penuh tetap mungkin, tetapi membutuhkan implementasi sendiri untuk form CRUD, autentikasi, upload, draft, dan riwayat; bukan pilihan awal rencana ini.

## 4. Struktur aplikasi yang dituju

```text
src/
  app/
    (frontend)/
      layout.tsx
      page.tsx
      projects/[slug]/page.tsx
      cv/page.tsx
      preview/route.ts
      preview/exit/route.ts
      globals.css
    (payload)/
      layout.tsx
      admin/[[...segments]]/page.tsx
      api/[...slug]/route.ts
  components/
    layout/
    sections/
    projects/
    ui/
  collections/
    Users.ts
    Projects.ts
    Skills.ts
    ProcessSteps.ts
    Experiences.ts
    Education.ts
    Media.ts
  globals/
    Profile.ts
    SiteSettings.ts
  lib/
    content.ts
    access.ts
    validation.ts
  hooks/
    revalidateContent.ts
  migrations/
  scripts/
    seed.ts
  payload.config.ts
public/
  assets/
tests/
.env.example
next.config.mjs
postcss.config.mjs
```

Struktur detail route Payload mengikuti template resmi versi yang dipilih. Gaya Tailwind frontend dibatasi ke layout frontend agar tidak merusak tampilan admin. Tidak menambahkan Prisma atau sistem autentikasi kedua di atas fitur yang sudah ditangani Payload.

## 5. Konten yang dapat diedit di admin

| Menu | Isi utama |
| --- | --- |
| Profil | Nama, lokasi, bio, arah karier, foto, kontak, tautan sosial, pilihan PDF CV |
| Pengaturan situs | Teks hero, judul/deskripsi SEO, navigasi, bagian yang ditampilkan, catatan ilustrasi |
| Proyek | Judul, slug unik, ringkasan, konteks/masalah, kontribusi, teknologi, hasil, keterbatasan, gambar, demo/repo, urutan, unggulan |
| Keahlian | Nama, kelompok, deskripsi, urutan; tanpa persentase penguasaan otomatis |
| Proses kerja | Nama langkah, deskripsi, urutan, keterangan bahwa proses merupakan kerangka yang dituju |
| Pengalaman | Posisi, institusi opsional, periode, uraian, bukti/tautan opsional |
| Pendidikan | Program, institusi dan periode opsional, status pendidikan bila sudah dikonfirmasi |
| Media | Gambar/PDF valid, judul, alt text gambar, nama file, visibilitas |
| Akun | Akun pemilik, login/logout, pemulihan akses |

Pisahkan status editorial `draft/published` dari tahap proyek `concept/in-progress/completed`. Konsep dapat dipublikasikan dengan label konsep; draft tidak boleh terlihat publik.

Field yang belum diketahui disimpan kosong/null. Tampilan merender penanda “Belum diisi” secara konsisten; tidak menyimpan instruksi pengisian sebagai fakta proyek. Laporan kelengkapan membantu admin menemukan data yang masih kurang. Tidak mewajibkan angka hasil jika memang tidak ada.

CV dan beranda membaca sumber data profil, pengalaman, pendidikan, dan keahlian yang sama agar perubahan tidak perlu dilakukan dua kali.

## 6. Alur penggunaan admin

1. Pemilik login ke `/admin`.
2. Pilih menu, misalnya Proyek → Tambah proyek.
3. Isi konteks, kontribusi, teknologi, hasil jika tersedia, dan tautan bukti.
4. Unggah gambar valid, lengkapi alt text, dan pilih urutan/unggulan.
5. Simpan sebagai draft.
6. Pratinjau tampilan publik melalui akses preview yang terlindungi.
7. Publikasikan; halaman terkait diperbarui melalui invalidasi cache.
8. Untuk konten lama: edit dan publikasikan ulang, batalkan publikasi, atau arsipkan.

Versi sebelumnya dapat dipulihkan jika fitur versi dikonfigurasi. Penghapusan permanen hanya melalui tindakan eksplisit dengan konfirmasi; alur utama menggunakan arsip/unpublish. Kebijakan retensi versi ditetapkan agar database tidak membesar tanpa batas.

## 7. Aturan akses dan validasi

- Buat akun pemilik pertama melalui proses bootstrap terbatas; jangan membuka pendaftaran publik.
- Semua operasi tambah/edit/hapus/upload diperiksa di server dan hanya untuk admin terautentikasi.
- Pengunjung hanya dapat membaca konten terpublikasi, tidak diarsipkan, dan field publik.
- Local API untuk pembacaan publik harus menerapkan access control secara eksplisit; Payload Local API memiliki default overrideAccess=true. Gunakan overrideAccess=false dan aturan publik yang sesuai.
- Preview membutuhkan sesi admin yang sah; draft dan respons preview tidak masuk cache publik.
- Validasi slug, panjang input, URL dengan protokol yang diizinkan, jenis file nyata, ukuran unggahan, dan alt text. Tidak mengizinkan HTML/script bebas dari editor.
- Rahasia database, cookie/session, dan storage hanya berada di server; tidak memakai prefix NEXT_PUBLIC untuk rahasia.
- Gunakan HTTPS dan cookie sesi yang aman pada produksi. Batasi percobaan login dan uji akses API secara langsung.
- Sediakan pemulihan akun yang terdokumentasi. Reset melalui email memerlukan penyedia email; bila belum tersedia, gunakan prosedur pemulihan operator yang aman.
- Media privat/draft tidak boleh tersaji sebagai file publik tanpa pemeriksaan akses. File yang sudah dipublikasikan dapat dilayani untuk halaman publik.

## 8. Tahapan implementasi

### Tahap 1 — Persiapan dan fondasi

- Catat kondisi Git dan simpan checkpoint seluruh perubahan saat ini; jangan menimpa perubahan pengguna.
- Pastikan runtime memenuhi persyaratan versi yang dipilih.
- Siapkan Next.js + TypeScript + Tailwind + Payload, database lokal, konfigurasi environment contoh, dan lockfile.
- Pisahkan layout frontend/admin dan buat komponen dasar.

Selesai jika aplikasi dapat dijalankan, halaman awal dapat dibangun, dan admin dapat terhubung ke database lokal.

### Tahap 2 — Migrasi tampilan publik

- Pecah halaman menjadi Header, Hero, ProjectNotes, Toolkit, Process, About, Experience, Education, Contact, Footer, dan CV.
- Pindahkan layout ke Tailwind dengan mempertahankan token warna/typography dan CSS print yang memang diperlukan.
- Ubah manipulasi DOM menjadi state/effect React untuk menu, tema, dan formulir; pertahankan details/summary native.
- Pertahankan ID anchor yang dipakai dan aset valid di public/assets.
- Tambahkan /cv dan halaman detail proyek. Redirect /index.html dan /resume.html ke rute baru.

Selesai jika desain Data Lab Editorial, tema, mobile, keyboard, kontak mailto, dan CV berfungsi tanpa regresi penting.

### Tahap 3 — Schema dan migrasi konten

- Buat Collections/Globals, tipe TypeScript, validasi, dan aturan akses.
- Siapkan seed idempotent menggunakan ID migrasi stabil agar tidak menggandakan entri atau menimpa edit admin saat dijalankan ulang.
- Impor data nyata dan tiga konsep dengan status/labelling yang benar. Simpan kekosongan sebagai field opsional.
- Gunakan satu lapisan content.ts untuk pembacaan publik; data admin tidak dikirim ke browser.
- Beranda dan CV memakai data yang sama.

Selesai jika data tersimpan di database dan tampilan tidak lagi bergantung pada salinan konten hardcoded.

### Tahap 4 — Alur admin lengkap

- Aktifkan akun pemilik, login/logout, pembuatan dan pengeditan konten.
- Konfigurasikan unggah media, draft, preview terlindungi, publish/unpublish, pengurutan, dan arsip.
- Atur versi/restore dan pesan validasi yang jelas.
- Tambahkan invalidasi cache setelah perubahan konten publik. Edit tidak memerlukan build/deploy ulang.

Selesai jika pemilik dapat menambah proyek, melihat draft sendiri, memublikasikan, mengedit, serta membatalkan publikasi dari admin.

### Tahap 5 — Pengujian dan kesiapan produksi

- Jalankan typecheck, build produksi, dan pemeriksaan lint sesuai konfigurasi proyek.
- Uji pengunjung anonim tidak dapat menulis konten, membaca draft, mengakses preview, atau melihat akun admin melalui API.
- Uji admin tambah/edit/urutkan/publish/arsip/restore; data dan upload tetap ada setelah restart/deploy.
- Uji kedua tema pada mobile/desktop, keyboard, reduced motion, heading, alt text, dan kontras.
- Uji query publik serta invalidasi cache dengan build produksi, bukan hanya dev server.
- Uji konsistensi profil/CV, PDF valid, slug unik, 404, redirect lama, dan penanganan database/storage error.
- Uji kontak membuka draf dan tidak mengklaim pesan terkirim.
- Perbarui README, panduan admin, dan instruksi backup/restore.

Selesai jika seluruh kriteria penerimaan di bawah terpenuhi.

### Tahap 6 — Deployment

- Gunakan hosting yang menjalankan server Next.js/Node, PostgreSQL persisten, dan object storage untuk media. Aplikasi admin terintegrasi ini tidak cukup dihosting sebagai file statis saja.
- Tentukan penyedia berdasarkan hosting yang dimiliki dan anggaran; rencana ini tidak membuat akun atau membeli layanan.
- Konfigurasikan domain, HTTPS, environment server, migrasi database, storage, dan backup.
- Uji staging terlebih dahulu, lalu pindahkan publik setelah lolos pemeriksaan.
- Pisahkan backup database dari backup media; uji pemulihannya.
- Siapkan rollback aplikasi dan pemulihan database dengan memperhatikan kompatibilitas schema. Rollback kode saja tidak menjamin rollback migrasi database.

## 9. Kriteria penerimaan

- Pemilik bisa mengubah profil dan teks utama tanpa mengedit file.
- Proyek dapat ditambah, diedit, diurutkan, diberi media, dipratinjau, dipublikasikan, dan diarsipkan.
- Draft tidak terbaca melalui halaman publik maupun API anonim.
- Perubahan publik terlihat setelah publish tanpa mengedit source atau deploy manual.
- Profil dan CV konsisten dari sumber data yang sama.
- Placeholder bawaan tidak muncul sebagai gambar/PDF yang seolah valid.
- Tidak ada kredensial atau field akun admin dalam data/browser publik.
- Desain editorial, responsif, dua tema, serta perilaku kontak dan cetak tetap terjaga.
- Konten dan unggahan bertahan setelah restart; prosedur backup dan pemulihan tersedia.

## 10. Keputusan saat implementasi dimulai

Pilihan dasar rencana: Payload, PostgreSQL, satu akun admin, Bahasa Indonesia, dan struktur konten tetap.

Yang perlu disesuaikan dengan lingkungan pengguna: penyedia hosting/database/storage, anggaran operasional, domain, alamat akun admin, serta kebutuhan email pemulihan. Kredensial tidak dimasukkan ke source code atau dokumen ini.

## Referensi resmi

- Next.js App Router: https://nextjs.org/docs/app
- Tailwind untuk Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Persyaratan dan instalasi Payload: https://payloadcms.com/docs/getting-started/installation
- Panel admin Payload: https://payloadcms.com/docs/admin/overview
- Draft dan akses publik: https://payloadcms.com/docs/versions/drafts
- Aturan akses: https://payloadcms.com/docs/access-control/overview
- Local API dan overrideAccess: https://payloadcms.com/docs/local-api/overview
- Penyimpanan media: https://payloadcms.com/docs/upload/storage-adapters
- Hosting Next.js: https://nextjs.org/docs/app/guides/self-hosting
