import { Project } from '../models/Project.model.js';
import { User } from '../models/User.model.js';
import {Redis} from "ioredis";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const redis = new Redis(`${process.env.REDIS_URI}`);
const subscriber = new Redis(`${process.env.REDIS_URI}`);


const createProject = async (gitUrl, UserId, projectId) => {

    const user = await User.findById(UserId);
    const project = await Project.create({
        URL: gitUrl,
        name: projectId,
        Owner: user,
        status: "Downloading"
    });
    await project.save({validateBeforeSave: false});
    return project;
}

async function PushInQueue(data) {
    await redis.lpush("user-list", data);
    console.log("Data pushed in queue:", data);

    // const result = await redis.brpop("user-list", 0);
    // const [queueName, value] = result;
    // console.log("Data popped from queue:", value);
}


const GetUrl = async(req, res)=>{
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    const userId = req.user._id;
    console.log("User ID in getUrl:", userId);
    

    try {
            const {gitUrl, pId} = req.body;
            const projectId = pId ? pId : randomName;

            const data = {
                gitUrl,
                projectId
            }
            await PushInQueue(JSON.stringify(data));
            const project = await createProject(gitUrl, userId, projectId);

            res.status(200).json({
                ...project
                });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error, could not push data in queue");
    }
}

const GetCurrentProjectStatus = async function (req, res) {
    const ProjectId = req?.body?.projectId;
    console.log("Project ID for current project status:", ProjectId);
    if (!ProjectId) {
        return res.status(400).send("Project not found");
    }
    const project = await Project.findById(ProjectId);
    res.status(200).json({
        status: project.status
    });
}

const UpdateProjectStatus = async function (message) {
    const [projectId, status] = message.split('+');

    const project = await Project.findOne({ name: projectId });
    if (!project) {
        console.error(`Project with ID ${projectId} not found`);
        return null;
    }

    project.status = status;
    await project.save({ validateBeforeSave: false });
    // console.log(`Project status updated: ${status}`);
};


const GetAllProjects = async function (req, res){
    // console.log("User in get all projects:", req.user);
    const userid = req.user._id;
    const projects = await Project.find({Owner: userid});
    if(!projects){
        return res.status(400).send("No projects found");
    }
    res.status(200).json({
        projects
    });
}


async function subscribeToChannel() {
    const channel = 'notifications';

    try {
        await subscriber.subscribe(channel); // Use the subscriber connection
        console.log(`Subscribed to channel: ${channel}`);

        subscriber.on('message', async (channel, message) => {
            // console.log(`Received message from ${channel}: ${message}`);
            await UpdateProjectStatus(message); // Update project status
        });
    } catch (err) {
        console.error(`Failed to subscribe: ${err.message}`);
    }
}

subscribeToChannel().catch(console.error);


export {
    GetUrl,
    GetCurrentProjectStatus,
    GetAllProjects,
    subscribeToChannel
}