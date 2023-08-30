import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "../../../server/api/root";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    renderTrpcPanel(appRouter, {
      url: "http://localhost:3000/api/trpc",
      transformer: "superjson",
    }),
  );
}
