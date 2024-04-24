import { NextApiRequest, NextApiResponse } from "next";
import { createOpenApiNextHandler } from "trpc-openapi";

import { createContext } from "@/trpc/context";
import { appRouter } from "@/trpc/routers";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return createOpenApiNextHandler({
    router: appRouter,
    createContext,
  } as any)(req, res);
};

export default handler;
