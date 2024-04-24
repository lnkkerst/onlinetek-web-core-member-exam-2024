import { itemCategories, items } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const ItemModel = createSelectSchema(items);
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
