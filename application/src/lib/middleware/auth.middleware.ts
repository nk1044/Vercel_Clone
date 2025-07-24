import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiResponse } from "next";
import type { NextApiRequestWithSession } from "@/lib/config/types";


export function withAuth(
  handler: (req: NextApiRequestWithSession, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        error: "You must be signed in to access this resource.",
      });
    }

    req.session = session;
    return handler(req, res);
  };
}
