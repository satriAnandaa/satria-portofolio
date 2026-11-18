import 'dotenv/config'
import EmbeddedPostgres from 'embedded-postgres'
import { existsSync, mkdirSync } from 'node:fs'
const url = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('db:local hanya untuk database loopback; tidak mengubah database remote.')
mkdirSync('.data', { recursive: true })
const pg = new EmbeddedPostgres({
  databaseDir: '.data/postgres',
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  port: Number(url.port || 5433),
  persistent: true,
  authMethod: 'scram-sha-256',
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  postgresFlags: ['-h', '127.0.0.1'],
  onLog: () => {},
  onError: (error) => console.error(String(error)),
})
if (!existsSync('.data/postgres/PG_VERSION')) await pg.initialise()
await pg.start()
const client = pg.getPgClient()
await client.connect()
const database = url.pathname.slice(1)
if (!/^[a-zA-Z0-9_]+$/.test(database)) throw new Error('Nama database lokal tidak valid.')
const result = await client.query('SELECT 1 FROM pg_database WHERE datname=$1', [database])
await client.end()
if (!result.rowCount) {
  const connection = pg.getPgClient()
  await connection.connect()
  await connection.query('CREATE DATABASE "' + database + '" WITH ENCODING \'UTF8\' TEMPLATE template0 LC_COLLATE \'C\' LC_CTYPE \'C\'')
  await connection.end()
}
console.log('PostgreSQL lokal aktif pada 127.0.0.1:' + url.port + '. Data persisten di .data/postgres. Ctrl+C untuk berhenti.')
let stopping = false
async function stop() { if (stopping) return; stopping = true; await pg.stop(); process.exit(0) }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
setInterval(() => {}, 60000)
