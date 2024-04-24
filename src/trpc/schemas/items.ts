import { itemCategories, items } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const ItemModel = createSelectSchema(items, {
  name: schema => schema.name.min(1).max(64),
  notes: schema => schema.notes.max(1024),
  quantity: schema => schema.quantity.min(0),
});
export const ItemZod = ItemModel.omit({});
export const ItemCreateZod = ItemZod.omit({
  id: true,
}).partial({
  createdAt: true,
});
export const ItemUpdateZod = ItemCreateZod.partial();

export const CategoryModel = createSelectSchema(itemCategories);
export const CategoryZod = CategoryModel.omit({});
export const CategoryCreateZod = CategoryZod.omit({
  id: true,
});
export const CategoryUpdateZod = CategoryCreateZod.partial();
