import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/config/db";
import { GetCurrentProjectStatus } from "@/lib/controllers/project.controller";
import { withAuth } from "@/lib/middleware/auth.middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case "GET":
      const { name } = req.query;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Project name is required" });
      }
      return GetCurrentProjectStatus(req, res);
      
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

export default withAuth(handler);