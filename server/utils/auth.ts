import { webcrypto } from 'node:crypto'
import { BetterSqlite3Adapter, D1Adapter } from '@lucia-auth/adapter-sqlite'
import Database from 'better-sqlite3'
import { Lucia, TimeSpan } from 'lucia'
import { GitHub } from 'arctic'
import { join } from 'pathe'
import type { SelectUser } from '~/server/db/schema'

globalThis.crypto = webcrypto as Crypto

const tables = {
  user: 'users',
  session: 'user_sessions',
}

let adapter

if (process.env.DB) {
  // d1 in production
  adapter = new D1Adapter(process.env.DB, tables)
}
else if (process.dev) {
  // local sqlite in development
  const { dbDir } = useRuntimeConfig()
  const sqlite = new Database(join(dbDir, './db.sqlite'))
  adapter = new BetterSqlite3Adapter(sqlite, tables)
}
else {
  throw new Error('No database configured for production')
}

export const auth = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'd'), // 1 day
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth
    DatabaseUserAttributes: SelectUser
  }
}
const runtimeConfig = useRuntimeConfig()

export const github = new GitHub(runtimeConfig.githubClientId, runtimeConfig.githubClientSecret)

// const runtimeConfig = useRuntimeConfig()

// export const githubAuth = github(auth, {
//   clientId: runtimeConfig.githubClientId,
//   clientSecret: runtimeConfig.githubClientSecret,
// })

export type Auth = typeof auth
