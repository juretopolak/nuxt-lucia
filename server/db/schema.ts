import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  password: text('password'),
})

export const userSessions = sqliteTable('user_sessions', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
})

export const oauthAccounts = sqliteTable('oauth_accounts', {
  providerId: text('provider_id').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }
})

export type InsertUser = InferInsertModel<typeof users>
export type SelectUser = InferSelectModel<typeof users>
