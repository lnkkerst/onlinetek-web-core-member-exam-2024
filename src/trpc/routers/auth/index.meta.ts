import { apiTags } from "@/trpc/openapi/tags";
import { uniq } from "lodash-es";
import { prefix as parentPrefix } from "../index.meta";
import { tags as parentTags } from "../index.meta";

export const prefix = `${parentPrefix}/auth`;

export const tags = uniq([apiTags.auth, ...parentTags]);
