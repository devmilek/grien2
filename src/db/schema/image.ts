import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const images = pgTable("images", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url").notNull().unique(),
  alt: varchar("alt", {
    length: 255,
  }),
  key: varchar("key", {
    length: 255,
  }).notNull(),
  mimeType: varchar("mimeType", {
    length: 255,
  }).notNull(),
  size: integer("size").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  uploadedBy: varchar("uploaded_by")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});

// export const imagesRelations = relations(images, ({ one }) => ({
//   licence: one(licences, {
//     fields: [images.licenceId],
//     references: [licences.id],
//   }),
// }));

export type Image = typeof images.$inferSelect;
export type ImageInsert = typeof images.$inferInsert;
