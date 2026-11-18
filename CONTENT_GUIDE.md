# Melengkapi konten melalui admin

Konten aktif sekarang disimpan dalam PostgreSQL dan diedit melalui /admin. File HTML lama hanya referensi migrasi. Seed awal berada di src/data/initial-content.json dan tidak menimpa edit admin ketika dijalankan ulang.

## Prioritas

1. **Studi kasus data/backend nyata:** tambah proyek melalui menu Proyek. Isi masalah, sumber/izin data di konteks, kontribusi, metode/teknologi, hasil, keterbatasan, serta bukti.
2. **Tiga konsep lama:** lengkapi Analytics UI, Brand Launch, dan Creative Portfolio. Jangan menyebutnya produk yang telah dirilis tanpa bukti.
3. **Pengalaman:** lengkapi institusi/perusahaan, periode, kontribusi, dan tautan yang boleh dipublikasikan.
4. **Pendidikan:** lengkapi institusi, periode, dan status yang sudah dikonfirmasi.
5. **CV final:** edit Profil & CV. /cv membaca data yang sama dengan beranda; unggah PDF valid bila ingin menyediakan versi unduhan.

Field yang belum diketahui tetap kosong. Tampilan memberi penanda Belum diisi. Jangan mengganti kekosongan dengan pencapaian, angka, perusahaan, atau keterampilan buatan. Status Konsep berbeda dari Draft: konsep bisa dipublikasikan dengan label yang benar.

Dashboard admin menunjukkan proyek yang belum mempunyai kontribusi atau hasil. Alt text wajib untuk unggahan gambar. Setiap file mempunyai visibilitas privat/publik yang terpisah dari status entri.

## Bagian opsional baru

Layanan, penghargaan, testimoni, paket harga, dan artikel blog belum diisi. Tambahkan hanya penawaran atau informasi yang benar-benar Anda miliki. Konten awal dan seed tidak membuat entri contoh untuk bagian-bagian ini. Setelah publikasi, aktifkan bagian melalui Situs & beranda.

Sampul proyek bawaan merupakan ilustrasi konsep dengan label yang terlihat. Ganti melalui unggahan sampul untuk menampilkan hasil karya atau tangkapan layar asli.

## Data pribadi yang dipertahankan

- Satria Ananda; Bali, Indonesia.
- Pendidikan yang tercantum: S1 Sistem Informasi.
- Email: satriaananda690@gmail.com.
- Telepon/WhatsApp: +62 821-4702-0593.
- GitHub: https://github.com/satriAnandaa.
- LinkedIn: https://www.linkedin.com/in/satria-ananda-966361317.
- Instagram: https://www.instagram.com/suchria_/.
- Keahlian berasal dari portofolio sebelumnya, tanpa penambahan klaim PostgreSQL/Next.js hanya karena dipakai sebagai infrastruktur situs.

Informasi diimpor dari proyek, bukan verifikasi eksternal. Konfirmasikan detail pengalaman/pendidikan sebelum memakai CV final. Lihat ADMIN_GUIDE.md untuk alur pengeditan dan DEPLOYMENT.md untuk produksi.
