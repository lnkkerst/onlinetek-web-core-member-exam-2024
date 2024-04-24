import { name, relations } from "drizzle-orm";
import * as d from "drizzle-orm/pg-core";

export const itemCategories = d.pgTable("item-categories", {
  id: d.uuid("id").defaultRandom().primaryKey(),
  name: d.text("name").notNull(),
});

export const items = d.pgTable("items", {
  id: d.uuid("id").defaultRandom().primaryKey(),
  name: d.text("name").notNull(),
  categoryId: d
    .uuid("category_id")
    .references(() => itemCategories.id)
    .notNull(),
  quantity: d.integer("quantity").notNull(),
  lendable: d.boolean("lendable").notNull(),
  notes: d.text("notes").notNull().default(""),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
});

export const itemCategoriesRelations = relations(
  itemCategories,
  ({ many }) => ({
    items: many(items),
  }),
);

export const itemsRelations = relations(items, ({ one }) => ({
  category: one(itemCategories, {
    fields: [items.categoryId],
    references: [itemCategories.id],
  }),
}));

export const users = d.pgTable("users", {
  id: d.uuid("id").defaultRandom().primaryKey(),
  name: d.text("name"),
  email: d.text("email").unique().notNull(),
  hashedPassword: d.text("hashed_password").notNull(),
  phone: d.text("phone"),
  avatarUrl: d.text("avatar_url"),
  bio: d.text("bio").default(""),
  birthday: d.date("birthday"),
  createdAt: d.timestamp("created_at").notNull().defaultNow(),
});
