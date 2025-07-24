import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import 'dotenv/config'
import { uploadFile } from './upload_file.js';
import Redis from "ioredis";
import cors from 'cors'

const  app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.includes('localhost')) return callback(null, true);

        const allowedOrigins = [
            /^https?:\/\/.*\.netlify\.app$/,
            /^https?:\/\/.*\.vercel\.app$/ 
        ];
        if (allowedOrigins.some(regex => regex.test(origin))) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.get('/*', (req, res) => {
    res.send('Builder server running successfully');
});




// const redis = new Redis(String(process.env.REDIS_URL));
const redis = new Redis(`rediss://red-cth8ph9opnds73b0fl00:EvLtEY838xpPxd58GYJLnZhmMLXOGxmY@singapore-redis.render.com:6379/0`);
const publisher = new Redis(String(process.env.REDIS_URL));


async function Init(ProjectId) {
    // console.log("Executing script.js");
    const OutputDirPath = path.resolve(`./output/${ProjectId}`);
    // console.log(OutputDirPath);

    const logs = exec(`ls && cd ${OutputDirPath} && npm install && npm run build`);

    logs.stdout.on('data', (data) => {
        // console.log(data);
    });

    logs.stderr.on('data', (data) => {
        console.error(data);
    });

    logs.on('exit', async () => {
        console.log('Building process completed...');
        publishMessage(`${ProjectId}+Uploading`);
        const distFolderPath = path.resolve(`./output/${ProjectId}/dist`);
        const distFolderContent = fs.readdirSync(distFolderPath, { recursive: true });
        // console.log("distFolderContent: ", distFolderContent);

        try {
            // Prepare all upload promises
            const uploadPromises = distFolderContent.map(async (file) => {
                const filepath = path.join(distFolderPath, file);
                // console.log("mime type of the file: ", mime.lookup(filepath));
                const Id = ProjectId + "/" + file;

                // Upload the file and return the promise
                return uploadFile(Id, filepath);
            });

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);
            // console.log("All files uploaded successfully to bucket.");

            // Delete folder after successful uploads
            deleteFolder(OutputDirPath);
            // console.log("Files deleted from output folder.");
            publishMessage(`${ProjectId}+Completed`);
        } catch (error) {
            console.error("Error during file upload or cleanup:", error);
        }
    });
}

async function gitUrlClone(data) {
    
    
    const GITHUB_REPOSITORY_URL = data?.gitUrl;
    const ProjectId = data?.projectId;
    const logs = exec(`git clone ${GITHUB_REPOSITORY_URL} /home/app/output/${ProjectId}`);
    // console.log('cloning ', GITHUB_REPOSITORY_URL);
    
    logs.stdout.on('data', (data) => {
        // console.log(data);
    }
    );

    logs.stderr.on('data', (data) => {
        console.error(data);
    });

    logs.on('exit', async(code) => {
        // console.log('download completed.');
        publishMessage(`${ProjectId}+Building`);
        await Init(ProjectId);
    });

}


async function PopFromQueue() {
    console.log("Listening for data in queue...");
    while (true) {
        try {
            // Wait for data with a timeout of 1 second
            const result = await redis.brpop("user-list", 0);
            if (!result) {
                console.log("Queue is empty, retrying...");
                continue;
            }

            const [queueName, value] = result;

            console.log("Data popped from queue:", value);

            if (value) {
                const data = JSON.parse(value);
                publishMessage(`${data.projectId}+Downloading`);
                console.log("Processing Data:");
                await gitUrlClone(data);
                console.log("Data Processed");
            }
        } catch (error) {
            // console.error("Error popping from queue:", error);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}


async function deleteFolder(folderPath) {
    try {
        if (fs.existsSync(folderPath)) {
            await fs.promises.rm(folderPath, { recursive: true, force: true });
            // console.log(`Deleted folder: ${folderPath}`);
        } else {
            console.log(`Folder does not exist: ${folderPath}`);
        }
    } catch (error) {
        console.error(`Error while deleting folder: ${error.message}`);
    }
}


async function publishMessage(message) {
    try {
        const channel = 'notifications';
        await publisher.publish(channel, message);
        return true;
    } catch (error) {
        console.error("Error publishing message:", error);
        return false;
    }
}


app.listen(port, () => {
    console.log(`Server V2 is running on port ${port}`);
    PopFromQueue();
});