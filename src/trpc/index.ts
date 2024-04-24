import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";

import { type Context } from "./context";

export { appRouter } from "./routers";

export const t = initTRPC.meta<OpenApiMeta>().context<Context>().create();

export const publicProcedure = t.procedure;
export const authorizedProcedure = t.procedure.use(async opts => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});
