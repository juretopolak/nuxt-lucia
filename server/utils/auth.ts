import { betterSqlite3, d1 } from '@lucia-auth/adapter-sqlite'
import Database from 'better-sqlite3'
import { lucia } from 'lucia'
import { h3 } from 'lucia/middleware'
import 'lucia/polyfill/node'
import { join } from 'pathe'

const tables = {
  user: 'users',
  key: 'user_keys',
  session: 'user_sessions',
}

let adapter

if (process.env.DB) {
  // d1 in production
  adapter = d1(process.env.DB, tables)
}
else if (process.dev) {
  // local sqlite in development
  const { dbDir } = useRuntimeConfig()
  const sqlite = new Database(join(dbDir, './db.sqlite'))
  adapter = betterSqlite3(sqlite, tables)
}
else {
  throw new Error('No database configured for production')
}

export const auth = lucia({
  env: process.dev ? 'DEV' : 'PROD',
  middleware: h3(),
  adapter,
  sessionExpiresIn: {
    activePeriod: 1 * 60 * 60 * 1000, // 1 hour after creating session
    idlePeriod: 23 * 60 * 60 * 1000, // 24 hours after creating session
  },
})

export type Auth = typeof auth
