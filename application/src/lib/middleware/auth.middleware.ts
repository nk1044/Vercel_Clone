// lib/withAuth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({
        error: "You must be signed in to access this resource.",
      });
    }

    // @ts-ignore - pass session to handler if needed
    req.session = session;
    
    return handler(req, res);
  };
}
