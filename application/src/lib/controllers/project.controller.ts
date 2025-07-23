import mongoose from "mongoose";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";
import { Redis } from "ioredis";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { stat } from "fs";


const redis = new Redis(process.env.REDIS_URI as string);
// const subscriber = new Redis(process.env.REDIS_URI as string);

const createProject = async (gitUrl: string, UserId: string, projectId: string) => {
    const user = await User.findById(UserId);
    if (!user) {
        throw new Error("User not found");
    }
    const project = await Project.create({
        URL: gitUrl,
        name: projectId,
        Owner: user,
        status: "Downloading"
    });
    console.log("Project created:", project);
    return project;
}

async function PushInQueue(data: IData) {
    await redis.lpush("user-list", JSON.stringify(data));
    console.log("Data pushed in queue:", data);
    return;
}

interface IData {
    gitUrl: string;
    projectId?: string;
}

function isValidGitHubUrl(url: string): boolean {
    const githubRepoRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubRepoRegex.test(url);
}

const checkBuilderServer = async () => {
    try {
        const baseUrl = process.env.BUILDER_URI || "http://localhost:3000";
        const response = await fetch(baseUrl + "/health");
        if (!response.ok) {
            throw new Error("Builder server is not running");
        }
        console.log("Builder server health:", response.status);
    } catch (error) {
        console.error("Error checking builder server:", error);
    }
}

const CreateNewProject = async (req: any, res: any) => {
    try {
        const { gitUrl, projectId } = req.body;
        const projectID = projectId ? projectId.toString().trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_') : uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

        console.log("Project ID:", projectID);

        if (!gitUrl || !projectID || gitUrl.trim() === '' || projectID.trim() === '') {
            return res.status(400).json({ error: "Git URL and Project ID are required" });
        }
        if (!isValidGitHubUrl(gitUrl)) {
            return res.status(400).json({ error: "Invalid GitHub URL" });
        }
        const email = req.session?.user?.email;
        if (!email) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const data = {
            gitUrl,
            projectID
        } as IData;
        const project = await createProject(gitUrl, user._id.toString(), projectID);
        console.log("Project created successfully:", project);
        checkBuilderServer();
        PushInQueue(data);
        res.status(200).json(project);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error, could not push data in queue");
    }
}

const GetCurrentProjectStatus = async function (req: any, res: any) {
    try {
        const STATUS_MESSAGES: Record<string, string> = {
            Pending: "Project is in queue and will start soon.",
            Downloading: "Cloning your GitHub repository.",
            Building: "Building the project from source.",
            Deploying: "Deploying your application.",
            Completed: "Deployment completed successfully!",
            Failed: "Deployment failed. Please check the logs.",
        };
    
        const userEmail = req.session?.user?.email;
    
        if (!userEmail) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        // Step 3: Validate project name
        const { name } = req.query;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Project name is required" });
        }
        const project = await Project.findOne({ name, Owner: user._id });
    
        if (!project) {
            res.write(`event: error\ndata: ${JSON.stringify({ error: `Project not found for name:${name}` })}\n\n`);
            return res.end();
        }
    
        const status = project.status;
        const message = STATUS_MESSAGES[status] || "Processing your project...";
    
        const data = {
            status,
            timestamp: new Date().toISOString(),
            message,
        };
        res.status(200).json(data);
    } catch (error) {
        console.log("Error fetching project status:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const UpdateProjectStatus = async function (message: string) {
    const [projectId, status] = message.split('+');

    const project = await Project.findOne({ name: projectId });
    if (!project) {
        console.error(`Project with ID ${projectId} not found`);
        return null;
    }
    console.log(`Updating project status for ${projectId} to ${status}`);
    if (!status) {
        console.error(`Status is undefined for project ${projectId}`);
        return null;
    }
    enum ProjectStatus {
        Downloading = "Downloading",
        Building = "Building",
        Failed = "Failed",
        Pending = "Pending",
        Deploying = "Deploying",
        Completed = "Completed"
    }
    if (!Object.values(ProjectStatus).includes(status as ProjectStatus)) {
        console.error(`Invalid status: ${status}`);
        return null;
    }
    project.status = status as ProjectStatus;
    await project.save({ validateBeforeSave: false });
    // console.log(`Project status updated: ${status}`);
};

const GetAllProjects = async function (req: any, res: any) {
    try {
        const user = req.session?.user;
        if (!user || !user.email) {
            console.log("Unauthorized access attempt or invalid user ID");
            return res.status(401).send("Unauthorized");
        }
        const fetchedUser = await User.findOne({ email: user.email });
        if (!fetchedUser) {
            console.log("User not found:", user.email);
            return res.status(404).send("User not found");
        }
        console.log("Fetching projects for user:", user.email);
        const userid = fetchedUser._id;
        const projects = await Project.find({ Owner: userid });
        if (!projects) {
            return res.status(400).send("No projects found");
        }
        // console.log("Fetched projects:", projects);
        res.status(200).json({
            projects
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error, could not fetch projects");
    }
}

const GetProjectByName = async function (req: any, res: any) {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).send("Project name is required");
        }
        const user = req.session?.user;
        if (!user || !user.email) {
            console.log("Unauthorized access attempt or invalid user ID");
            return res.status(401).send("Unauthorized");
        }
        const fetchedUser = await User.findOne({ email: user.email });
        if (!fetchedUser) {
            console.log("User not found:", user.email);
            return res.status(404).send("User not found");
        }
        const project = await Project.findOne({ name: name, Owner: fetchedUser._id });
        if (!project) {
            return res.status(404).send("Project not found");
        }
        res.status(200).json({
            project
        });
    } catch (error) {
        console.error("Error fetching project by name:", error);
        res.status(500).send("Internal server error, could not fetch project");
    }
}




// async function subscribeToChannel() {
//     const channel = 'notifications';
//     try {
//         await subscriber.subscribe(channel);
//         console.log(`Subscribed to channel: ${channel}`);
//         subscriber.on('message', async (channel, message) => {
//             await UpdateProjectStatus(message);
//         });
//     } catch (err) {
//         console.error(`Failed to subscribe: ${err}`);
//     }
// }

export {
    CreateNewProject,
    GetCurrentProjectStatus,
    GetAllProjects,
    GetProjectByName,
    // subscribeToChannel
}