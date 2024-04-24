import { users } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const UserModel = createSelectSchema(users, {
  email: schema => schema.email.email(),
  bio: schema => schema.bio.max(1024),
  name: schema => schema.name.min(1).max(32),
  phone: schema => schema.phone.min(11).max(11),
});
export const UserZod = UserModel.omit({
  hashedPassword: true,
});
export const UserUpdateZod = UserZod.partial().omit({
  id: true,
  createdAt: true,
  email: true,
});

export const UserLoginZod = z.object({
  email: z.string(),
  password: z.string(),
});
export const UserRegisterZod = UserLoginZod.merge(UserZod.pick({}));
