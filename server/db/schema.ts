import { InferInsertModel, sql } from 'drizzle-orm'
import { sqliteTable, text, blob } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  // other user attributes
});

export const userSessions = sqliteTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  activeExpires: blob('active_expires', {
    mode: 'bigint'
  }).notNull(),
  idleExpires: blob('idle_expires', {
    mode: 'bigint'
  }).notNull()
});

export const userKeys = sqliteTable('user_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  hashedPassword: text('hashed_password')
});

export type InsertUser = InferInsertModel<typeof users>;