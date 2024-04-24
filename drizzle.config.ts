import { loadEnvConfig } from "@next/env";
import { type Config } from "drizzle-kit";

loadEnvConfig(process.cwd());

export default {
  schema: "./src/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;
