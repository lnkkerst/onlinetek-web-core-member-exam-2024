import { NextApiRequest, NextApiResponse } from "next";

import { openApiDocument } from "@/trpc/openapi";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(openApiDocument);
};

export default handler;
