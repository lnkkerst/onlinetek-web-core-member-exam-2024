import { generateOpenApiDocument } from "trpc-openapi";

import { appRouter } from "@/trpc/routers";

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "core member exam 2024 api",
  description: "core member exam 2024 api",
  version: "0.0.0",
  baseUrl: "/api",
});
