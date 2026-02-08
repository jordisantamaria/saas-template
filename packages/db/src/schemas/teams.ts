import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { baseColumns } from './base'
import { users } from './auth'

export const organizations = pgTable('organizations', {
  ...baseColumns,
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id),
})

export const members = pgTable('members', {
  ...baseColumns,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['admin', 'member', 'viewer'] })
    .default('member')
    .notNull(),
})

export const invitations = pgTable('invitations', {
  ...baseColumns,
  email: text('email').notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  invitedById: uuid('invited_by_id')
    .notNull()
    .references(() => users.id),
  role: text('role', { enum: ['admin', 'member', 'viewer'] })
    .default('member')
    .notNull(),
  status: text('status', { enum: ['pending', 'accepted', 'expired'] })
    .default('pending')
    .notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
})

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, { fields: [organizations.ownerId], references: [users.id] }),
  members: many(members),
  invitations: many(invitations),
}))

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, { fields: [members.userId], references: [users.id] }),
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
}))

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  invitedBy: one(users, { fields: [invitations.invitedById], references: [users.id] }),
}))
