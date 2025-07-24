import type { NextApiRequest } from "next";
import type { Session } from "next-auth";

export interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
}