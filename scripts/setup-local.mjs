import { randomBytes } from 'node:crypto'
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'
if (existsSync('.env')) {
  console.log('.env sudah ada; konfigurasi Anda tidak diubah.')
} else {
  const password = randomBytes(24).toString('hex')
  writeFileSync('.env', [
    'DATABASE_URL=postgresql://postgres:' + password + '@127.0.0.1:5433/portfolio',
    'PAYLOAD_SECRET=' + randomBytes(48).toString('hex'),
    'NEXT_PUBLIC_SERVER_URL=http://localhost:3000',
    'DATABASE_PUSH=false',
    'STORAGE_DRIVER=local',
    '',
  ].join('\n'), { mode: 0o600 })
  console.log('.env lokal dibuat dengan rahasia acak. Tidak ada akun admin/default password.')
}
mkdirSync('.data', { recursive: true })
