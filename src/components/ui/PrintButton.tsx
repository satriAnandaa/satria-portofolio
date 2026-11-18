'use client'
export function PrintButton() {
  return <button className="button" type="button" onClick={() => window.print()}>Cetak / Simpan sebagai PDF ↗</button>
}
