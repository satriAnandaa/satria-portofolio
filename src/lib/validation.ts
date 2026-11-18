export function validateURL(value: unknown) {
  if (!value) return true
  try {
    const url = new URL(String(value))
    return ['https:', 'http:'].includes(url.protocol) || 'Gunakan URL http/https yang valid.'
  } catch { return 'Gunakan URL lengkap yang valid.' }
}

export function validateSlug(value: unknown) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || '')) || 'Gunakan huruf kecil, angka, dan tanda hubung.'
}

export function recognizedFile(buffer: Buffer): string | null {
  if (buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png'
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return 'image/jpeg'
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp'
  if (buffer.toString('ascii', 0, 5) === '%PDF-') return 'application/pdf'
  return null
}
