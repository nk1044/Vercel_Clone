import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/config/db";
import { GetAllProjects, CreateNewProject, GetProjectByName } from "@/lib/controllers/project.controller";
import { withAuth } from "@/lib/middleware/auth.middleware";
import { NextApiRequestWithSession } from "@/lib/config/types";

// req:NextApiRequestWithSession, res: NextApiResponse
async function handler(req: NextApiRequestWithSession, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case "GET":
      if (req.query.name) {
        return GetProjectByName(req, res);
      }
      return GetAllProjects(req, res);

    case "POST":
      return CreateNewProject(req, res);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

export default withAuth(handler);
