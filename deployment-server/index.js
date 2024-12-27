import express from 'express';
import { createClient } from '@supabase/supabase-js'
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import 'dotenv/config';
import cors from 'cors';


const app = express();

const supabase_url = String(process.env.SUPABASE_URL)
const supabase_key = String(process.env.SUPABASE_KEY)

const supabase = createClient(supabase_url, supabase_key);

app.use('/static', express.static('output'));
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

async function checkAndDownloadFolder(ProjectId) {
    const projectDir = path.resolve('./output', ProjectId);

    if (fs.existsSync(projectDir)) {
        console.log(`Folder ${projectDir} already exists. Skipping download.`);
        return;
    }

    console.log(`Downloading files for project: ${ProjectId}`);
    await downloadFolder(ProjectId);
}

app.get('/*', async (req, res) => {
    try {
        const host = req.hostname;
        const ProjectId = host.split('.')[0];
        console.log('ProjectId:', ProjectId);

        let filePath = req.path;

        if(ProjectId==="Delete-Project"){
            await deleteFolder(path.resolve(`./output/${ProjectId}`));
        }

        if(filePath==="/health-check"){
            return res.send('Server is healthy.');
        }

        await checkAndDownloadFolder(ProjectId);

        console.log('filePath:', filePath);
        let contentType = mime.lookup(filePath) || 'application/octet-stream'; 

        if (filePath === '/' || filePath === '' || filePath === '/index.html') {
            filePath = '/index.html';
            contentType = 'text/html';
        }
        else {
            contentType = mime.lookup(filePath) || contentType;
        }

        const indexPath = path.resolve(`./output/${ProjectId}${filePath}`);

        if (fs.existsSync(indexPath)) {
            const fileContent = await fs.promises.readFile(indexPath, 'utf8');
            res.setHeader('Content-Type', contentType);
            return res.send(fileContent);
        }

        res.status(404).send(`${filePath} not found for ProjectId: ${ProjectId}`);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('An error occurred while processing the request.');
    }
});

async function GetAllFilesPaths(ProjectId) {

    const Files = [];

    const { data: files, error: listError } = await supabase
    .storage
    .from('netlify_Files')
    .list(`Objects/${ProjectId}`);

    for(const file of files) {
        console.log('file:', file.name);
        if(file.id===null){
            const newPath = `${ProjectId}/${file.name}`;
            const nestedFiles = await GetAllFilesPaths(newPath);
            Files.push(...nestedFiles);
        }
        else{
            Files.push(`${ProjectId}/${file.name}`);
        }
    }

    if (listError) {
        console.log(listError);
    }
    return Files;
}

async function downloadFolder(ProjectId) {
    try {

        const Files = await GetAllFilesPaths(ProjectId);
        console.log('Files:', Files);

        
        const outputDir = path.resolve(`./output/${ProjectId}`);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }


        for (const file of Files) {
            const filePath = `Objects/${file}`;
        
            const { data: fileData, error: downloadError } = await supabase
                .storage
                .from('netlify_Files')
                .download(filePath);
        
            if (downloadError) {
                console.error(`Failed to download ${filePath}:`, downloadError);
                continue; 
            }
        
            console.log(`Downloaded fileData:`, fileData);
        
            const localFilePath = path.resolve('./output', file);
        
            const localFileDir = path.dirname(localFilePath);
            if (!fs.existsSync(localFileDir)) {
                fs.mkdirSync(localFileDir, { recursive: true });
            }
        
            fs.writeFileSync(localFilePath, Buffer.from(await fileData.arrayBuffer()));
            console.log(`Downloaded ${filePath} to ${localFilePath}`);
        }

        return;
    } catch (error) {
        console.error('Error downloading folder:', error);
    }
}

async function deleteFolder(folderPath) {
    try {
        if (fs.existsSync(folderPath)) {
            await fs.promises.rm(folderPath, { recursive: true, force: true });
            console.log(`Deleted folder: ${folderPath}`);
        } else {
            console.log(`Folder does not exist: ${folderPath}`);
        }
    } catch (error) {
        console.error(`Error while deleting folder: ${error.message}`);
    }
}


app.listen(9000, () => {
    console.log('deployment-Server is running on port 9000');
});