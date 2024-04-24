import { createNextApiHandler } from "@trpc/server/adapters/next";

import { createContext } from "@/trpc/context";
import { appRouter } from "@/trpc/routers";

export default createNextApiHandler({
  router: appRouter,
  createContext,
});
