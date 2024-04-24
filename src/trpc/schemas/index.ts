import { z, ZodSchema } from "zod";

export const PaginationWrapper = z.object({
  total: z.number(),
});

export function withPagination(schema: ZodSchema) {
  return PaginationWrapper.extend({
    data: schema,
  });
}

export const IdObjectZod = z.object({
  id: z.string().uuid(),
});

export const PaginationZod = z.object({
  page: z.number().min(1).default(1),
  size: z.number().max(100).min(1).default(20),
});
