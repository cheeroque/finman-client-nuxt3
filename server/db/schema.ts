import { pgTable, boolean, integer, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const CategoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  color: text('color'),
  isIncome: boolean('is_income').default(false),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})

export const RevisesTable = pgTable('revises', {
  id: serial('id').primaryKey(),
  note: text('note').default(''),
  sum: integer('sum').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})

export const SessionsTable = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  expiresAt: timestamp('expires_at', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
})

export const TransactionsTable = pgTable('transactions', {
  id: serial('id').primaryKey(),
  note: text('note').default(''),
  sum: integer('sum').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => CategoriesTable.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => UsersTable.id, { onDelete: 'set null' }),
})

export const UsersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})
