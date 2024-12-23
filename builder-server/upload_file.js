import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import fs from 'fs';
import mime from 'mime-types'


const supabase_url = String(process.env.SUPABASE_URL);
const supabase_key = String(process.env.SUPABASE_KEY);

const supabase = createClient(supabase_url, supabase_key);


export async function uploadFile(Id, filepath) {


    console.log("uploading to bucket: ", filepath);
    // console.log("mime type of the file: ", mime.lookup(filepath));
    const fileStat = fs.lstatSync(filepath);

    if (fileStat.isDirectory()) {
        // console.log("Skipping directory: ", filepath);
        return;
    }


    const file = fs.readFileSync(filepath);

    const { data, error } = await supabase
        .storage
        .from('netlify_Files')
        .upload(`Objects/${Id}`, file, { contentType: mime.lookup(filepath), cacheControl: 'no-cache', upsert: false });

    if (error) {
        console.log('Error uploading file:', error);
    } else {
        // console.log('File uploaded successfully:', data);
    }
}




