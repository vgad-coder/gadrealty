/**
 * Runs a command with the local laptop database available.
 *
 *   node scripts/with-db.mjs next dev
 *   node scripts/with-db.mjs payload run src/seed.ts
 *
 * - If DATABASE_URL points to a real Postgres (the live site), the command just runs.
 * - Otherwise a small Postgres-compatible database (PGlite) starts, saving its files in .data/,
 *   the command runs, and the database stops again.
 * - If the local database is already running (for example `npm run dev` in another window),
 *   it is reused.
 */
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5433
const LOCAL_URL = `postgres://postgres:postgres@127.0.0.1:${PORT}/postgres`

const rawArgs = process.argv.slice(2)
// --migrate: bring the local database up to date (saved migrations) before the command runs.
const migrateFirst = rawArgs[0] === '--migrate'
const [command, ...args] = migrateFirst ? rawArgs.slice(1) : rawArgs
if (!command) {
  console.error('Usage: node scripts/with-db.mjs <command> [args...]')
  process.exit(1)
}

function loadDotEnv() {
  try {
    process.loadEnvFile(path.join(root, '.env'))
  } catch {
    // no .env file yet
  }
}

function portIsOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' })
    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })
}

async function startLocalDatabase() {
  const { PGlite } = await import('@electric-sql/pglite')
  const { PGLiteSocketServer } = await import('@electric-sql/pglite-socket')
  const dataDir = path.join(root, '.data', 'pglite')
  mkdirSync(dataDir, { recursive: true })
  const db = await PGlite.create(dataDir)
  const server = new PGLiteSocketServer({
    db,
    port: PORT,
    host: '127.0.0.1',
    // Payload holds one connection open and uses others for its work.
    maxConnections: 20,
    idleTimeout: 24 * 60 * 60 * 1000,
  })
  await server.start()
  console.log(`[database] Local database ready on port ${PORT}`)
  return async () => {
    await server.stop()
    await db.close()
  }
}

function run(cmd = command, cmdArgs = args) {
  const isWindows = process.platform === 'win32'
  return new Promise((resolve) => {
    const child = spawn(cmd, cmdArgs, {
      cwd: root,
      stdio: 'inherit',
      shell: isWindows,
      env: process.env,
    })
    const forward = (signal) => () => child.kill(signal)
    process.on('SIGINT', forward('SIGINT'))
    process.on('SIGTERM', forward('SIGTERM'))
    child.on('exit', (code) => resolve(code ?? 0))
  })
}

loadDotEnv()

const url = process.env.DATABASE_URL
const usingLocal = !url || url === LOCAL_URL

let stopDatabase = null
if (usingLocal) {
  process.env.DATABASE_URL = LOCAL_URL
  if (await portIsOpen(PORT)) {
    console.log('[database] Using the local database that is already running')
  } else {
    stopDatabase = await startLocalDatabase()
  }
}

let code = 0
if (migrateFirst && usingLocal) {
  code = await run('payload', ['migrate'])
  if (code !== 0) {
    console.error('[database] Could not bring the local database up to date.')
    if (stopDatabase) await stopDatabase()
    process.exit(code)
  }
}
code = await run()
if (stopDatabase) await stopDatabase()
process.exit(code)
