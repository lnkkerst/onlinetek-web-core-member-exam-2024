import { itemCategories, items } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { PaginationZod } from ".";

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
export const ItemsGetZod = PaginationZod.extend({
  name: z.string().min(1).max(64).optional(),
  categoryId: z.string().uuid().optional(),
  lendable: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "quantity"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const CategoryModel = createSelectSchema(itemCategories);
export const CategoryZod = CategoryModel.omit({});
export const CategoryCreateZod = CategoryZod.omit({
  id: true,
});
export const CategoryUpdateZod = CategoryCreateZod.partial();
