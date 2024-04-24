import { db } from "@/db/db";
import { jwtVerify } from "@/utils/auth";
import { TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createContext = async ({ req }: CreateNextContextOptions) => {
  const token = req.headers.authorization?.split(" ").at(-1);
  let user;
  if (token) {
    try {
      user = jwtVerify(token);
    } catch (e) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authorization header failed",
      });
    }
  }
  return { db, user };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
