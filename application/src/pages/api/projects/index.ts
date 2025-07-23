import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/config/db";
import { GetAllProjects, CreateProject } from "@/lib/controllers/project.controller";
import { withAuth } from "@/lib/middleware/auth.middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case "GET":
      return GetAllProjects(req, res);

    case "POST":
      return CreateProject(req, res);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

export default withAuth(handler);
