import 'dotenv/config'
import { createInterface } from 'node:readline/promises'
import { emitKeypressEvents } from 'node:readline'
import { getPayload } from 'payload'
import config from '../payload.config'

const mode = process.argv[2]
if (!['create', 'reset'].includes(mode)) throw new Error('Gunakan npm run admin:create atau npm run admin:reset.')
const payload = await getPayload({ config })
const accounts = await payload.find({ collection: 'users', limit: 1 })
if (mode === 'create' && accounts.totalDocs) throw new Error('Akun pemilik sudah ada. Gunakan admin:reset bila kehilangan akses.')
const rl = createInterface({ input: process.stdin, output: process.stdout })
const email = (await rl.question('Email pemilik: ')).trim().toLowerCase()
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email tidak valid.')
rl.close()
async function hiddenPassword() {
  if (!process.stdin.isTTY) throw new Error('Jalankan melalui terminal interaktif; password tidak dibaca dari argumen command.')
  process.stdout.write('Password baru (minimal 12 karakter, input disembunyikan): ')
  emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.resume()
  return new Promise<string>((resolve) => {
    let value = ''
    const handler = (text: string, key: { name?: string; ctrl?: boolean }) => {
      if (key.ctrl && key.name === 'c') process.exit(130)
      if (key.name === 'return') {
        process.stdin.off('keypress', handler); process.stdin.setRawMode(false)
        process.stdin.pause(); process.stdout.write('\n'); resolve(value)
      } else if (key.name === 'backspace') value = value.slice(0, -1)
      else if (text && !key.ctrl) value += text
    }
    process.stdin.on('keypress', handler)
  })
}
const password = await hiddenPassword()
if (password.length < 12) throw new Error('Password minimal 12 karakter.')
if (mode === 'create') {
  await payload.create({ collection: 'users', data: { email, password }, context: { bootstrapAdmin: true } })
} else {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (!existing.docs[0]) throw new Error('Email pemilik tidak ditemukan.')
  await payload.update({ collection: 'users', id: existing.docs[0].id, data: { password, loginAttempts: 0, lockUntil: null }, context: { operatorReset: true } })
}
console.log('Akun diperbarui. Login melalui /admin. Password tidak disimpan dalam source/dokumen.')
await payload.destroy()
process.exit(0)
