import { t } from "..";
import { authRouter } from "./auth";
import { itemsCrudRouter } from "./items-crud";

export const appRouter = t.router({
  itemsCrud: itemsCrudRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
