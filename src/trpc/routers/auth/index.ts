import { users } from "@/db/schema";
import { authorizedProcedure, publicProcedure, t } from "@/trpc";
import {
  UserLoginZod,
  UserRegisterZod,
  UserUpdateZod,
  UserZod,
} from "@/trpc/schemas/auth";
import { hashPassword, jwtSign, verifyPassword } from "@/utils/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { prefix, tags } from "./index.meta";

export const authRouter = t.router({
  login: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/login`,
        method: "POST",
        description: "用户登录",
        tags,
      },
    })
    .input(UserLoginZod)
    .output(
      z.object({
        user: UserZod,
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (!dbUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User with email ${email} not found`,
        });
      }
      if (!(await verifyPassword(password, dbUser.hashedPassword))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect email or password",
        });
      }
      const token = jwtSign({ id: dbUser.id });
      return { token, user: dbUser };
    }),

  register: publicProcedure
    .meta({
      openapi: {
        path: `${prefix}/register`,
        method: "POST",
        description: "用户注册",
        tags,
      },
    })
    .input(UserRegisterZod)
    .output(UserZod)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;
      const hashedPassword = await hashPassword(password);
      try {
        const [dbUser] = await db
          .insert(users)
          .values({
            email,
            hashedPassword,
          })
          .returning();
        return dbUser;
      } catch (_e) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `User with email ${email} already exists`,
        });
      }
    }),

  getUser: authorizedProcedure
    .meta({
      openapi: {
        path: `${prefix}/user`,
        method: "GET",
        protect: true,
        description: "获取当前登录用户的信息",
        tags,
      },
    })
    .input(z.void())
    .output(UserZod)
    .query(async ({ ctx }) => {
      const { db, user } = ctx;
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id));
      return dbUser;
    }),

  updateUser: authorizedProcedure
    .meta({
      openapi: {
        path: `${prefix}/user`,
        method: "PUT",
        protect: true,
        description: "更新当前登录用户的信息",
        tags,
      },
    })
    .input(UserUpdateZod)
    .output(UserZod)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const [dbUser] = await db
        .update(users)
        .set({
          ...input,
        })
        .where(eq(users.id, user.id))
        .returning();
      return dbUser;
    }),
});
