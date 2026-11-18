import { BrandMark } from "@/components/ui/Design";

export function AdminLogo() {
  return (
    <span className="studio-logo">
      <BrandMark />
      <span>
        <strong>Satria.</strong>
        <small>KELOLA PORTOFOLIO</small>
      </span>
    </span>
  );
}
export function AdminIcon() {
  return (
    <span className="studio-icon">
      <BrandMark />
    </span>
  );
}
export function LoginIntro() {
  return (
    <div className="studio-login">
      <span className="studio-kicker">RUANG ADMIN PRIBADI</span>
      <h1>
        Ide bagus.
        <br />
        Konten yang hidup.
      </h1>
      <p>Masuk untuk mengelola portofolio, publikasi, dan media Anda.</p>
    </div>
  );
}
export function AppearanceHelp() {
  return (
    <div className="studio-help">
      Desain menggunakan font dan tekstur lokal. Nama serta arah karier hero
      berasal dari Profil & CV. Judul hero lama dipakai sebagai pernyataan utama
      pada bagian tentang.
    </div>
  );
}
