import { itemCategories, items } from "@/db/schema";
import { publicProcedure, t } from "@/trpc";
import { IdObjectZod, withPagination } from "@/trpc/schemas";
import {
  CategoryCreateZod,
  CategoryUpdateZod,
  CategoryZod,
  ItemCreateZod,
  ItemsGetZod,
  ItemUpdateZod,
  ItemZod,
} from "@/trpc/schemas/items";
import { TRPCError } from "@trpc/server";
import { and, asc, count, desc, eq, like, SQL } from "drizzle-orm";
import { z } from "zod";
import { prefix, tags } from "./index.meta";

export const itemsCrudRouter = t.router({
  getAllCategories: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/categories`,
        method: "GET",
        description: "获取所有分类",
        tags: tags,
      },
    })
    .input(z.void())
    .output(withPagination(CategoryZod.array()))
    .query(async ({ ctx }) => {
      const { db } = ctx;
      return await db.transaction(async tx => {
        const data = await tx.select().from(itemCategories);
        const [total] = await tx
          .select({ value: count() })
          .from(itemCategories);

        return { total: total.value, data };
      });
    }),
  createCategory: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/categories`,
        method: "POST",
        description: "创建新的分类",
        tags: tags,
      },
    })
    .input(CategoryCreateZod)
    .output(CategoryZod)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { name } = input;
      const [dbCategory] = await db
        .insert(itemCategories)
        .values({ name })
        .returning();
      return dbCategory;
    }),

  getCategoryById: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/categories/{id}`,
        method: "GET",
        description: "根据 ID 获取分类",
        tags,
      },
    })
    .input(IdObjectZod)
    .output(CategoryZod)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;
      const [dbCategory] = await db
        .select()
        .from(itemCategories)
        .where(eq(itemCategories.id, id));
      if (!dbCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Category with id ${id} not found`,
        });
      }
      return dbCategory;
    }),

  deleteCategoryById: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/categories/{id}`,
        method: "DELETE",
        description: "根据 ID 删除分类",
        tags,
      },
    })
    .input(IdObjectZod)
    .output(CategoryZod)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;
      const [dbCategory] = await db
        .delete(itemCategories)
        .where(eq(itemCategories.id, id))
        .returning();
      if (!dbCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Category with id ${id} not found`,
        });
      }
      return dbCategory;
    }),
  updateCategoryById: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/categories/{id}`,
        method: "PUT",
        description: "更新分类信息",
        tags,
      },
    })
    .input(IdObjectZod.merge(CategoryUpdateZod))
    .output(CategoryZod)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { name, id } = input;
      const [dbCategory] = await db
        .update(itemCategories)
        .set({
          name,
        })
        .where(eq(itemCategories.id, id))
        .returning();
      return dbCategory;
    }),

  getAllItems: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/items`,
        method: "GET",
        description: "获取多个物资信息",
        tags: tags,
      },
    })
    .input(ItemsGetZod)
    .output(withPagination(ItemZod.array()))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { page, size, name, lendable, categoryId, sortBy, order } = input;

      const offset = (page - 1) * size;
      const limit = size;

      let andFilter = [];
      if (categoryId) {
        andFilter.push(eq(items.categoryId, categoryId));
      }
      if (name) {
        andFilter.push(like(items.name, `%${name}%`));
      }
      if (lendable != undefined) {
        andFilter.push(eq(items.lendable, lendable));
      }

      let orderFn: typeof asc = asc;
      if (order === "desc") {
        orderFn = desc;
      }

      let orderBy = orderFn(items.createdAt);

      if (sortBy === "quantity") {
        orderBy = orderFn(items.quantity);
      } else if (sortBy === "createdAt") {
        orderBy = orderFn(items.createdAt);
      }

      const query = await db.transaction(async tx => {
        const [total] = await tx.select({ value: count() }).from(items);

        const data = await tx
          .select()
          .from(items)
          .where(and(...andFilter))
          .orderBy(orderBy)
          .offset(offset)
          .limit(limit);

        return { total: total.value, data };
      });

      return query;
    }),
  createItem: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/items`,
        method: "POST",
        description: "创建新的物品",
        tags: tags,
      },
    })
    .input(ItemCreateZod)
    .output(ItemZod)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const [dbItem] = await db
        .insert(items)
        .values({ ...input })
        .returning();
      return dbItem;
    }),

  getItemById: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/items/{id}`,
        method: "GET",
        description: "根据 ID 获取物品",
        tags,
      },
    })
    .input(IdObjectZod)
    .output(ItemZod)
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;
      const [dbItem] = await db.select().from(items).where(eq(items.id, id));
      if (!dbItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Item with id ${id} not found`,
        });
      }
      return dbItem;
    }),

  deleteItemById: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/items/{id}`,
        method: "DELETE",
        description: "根据 ID 删除物品",
        tags,
      },
    })
    .input(IdObjectZod)
    .output(ItemZod)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;
      const [dbItem] = await db
        .delete(items)
        .where(eq(items.id, id))
        .returning();
      if (!dbItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Item with id ${id} not found`,
        });
      }
      return dbItem;
    }),
  updateItemById: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/items/{id}`,
        method: "PUT",
        description: "更新物品信息",
        tags,
      },
    })
    .input(IdObjectZod.merge(ItemUpdateZod))
    .output(ItemZod)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, ...updates } = input;
      const [dbItem] = await db
        .update(items)
        .set({
          ...updates,
        })
        .where(eq(items.id, id))
        .returning();
      return dbItem;
    }),
});
