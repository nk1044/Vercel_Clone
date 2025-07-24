import type { NextApiResponse } from "next";
import { connectDB } from "@/lib/config/db";
import { GetCurrentProjectStatus } from "@/lib/controllers/project.controller";
import { withAuth } from "@/lib/middleware/auth.middleware";
import { NextApiRequestWithSession } from "@/lib/config/types";

async function handler(req: NextApiRequestWithSession, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case "GET":
      const { name } = req.query;
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Project name is required" });
        return;
      }
      await GetCurrentProjectStatus(req, res);
      return;
      
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      return;
  }
}

export default withAuth(handler);