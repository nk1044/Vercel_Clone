// import { createClient } from '@supabase/supabase-js'
// import 'dotenv/config'
// import fs from 'fs';
// import mime from 'mime-types'


// const supabase_url = String(process.env.SUPABASE_URL);
// const supabase_key = String(process.env.SUPABASE_KEY);

// const supabase = createClient(supabase_url, supabase_key);


// export async function uploadFile(Id, filepath) {


//     console.log("uploading to bucket: ", filepath);
//     // console.log("mime type of the file: ", mime.lookup(filepath));
//     const fileStat = fs.lstatSync(filepath);

//     if (fileStat.isDirectory()) {
//         // console.log("Skipping directory: ", filepath);
//         return;
//     }


//     const file = fs.readFileSync(filepath);

//     const { data, error } = await supabase
//         .storage
//         .from('netlify_Files')
//         .upload(`Objects/${Id}`, file, { contentType: mime.lookup(filepath), cacheControl: 'no-cache', upsert: false });

//     if (error) {
//         console.log('Error uploading file:', error);
//     } else {
//         // console.log('File uploaded successfully:', data);
//     }
// }




import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import 'dotenv/config';

const accessKeyId = process.env.B2_KEY_ID;
const secretAccessKey = process.env.B2_SECRET;
const endpoint = process.env.B2_ENDPOINT; // e.g., 'https://s3.us-west-004.backblazeb2.com'
const region = process.env.B2_REGION; // e.g., 'us-west-004'
const bucketName = process.env.B2_BUCKET; // your bucket name

// Create S3 client for Backblaze B2
const s3 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

export async function uploadFile(Id, filepath) {
  console.log("Uploading to B2 bucket:", filepath);

  const fileStat = fs.lstatSync(filepath);
  if (fileStat.isDirectory()) {
    console.log("Skipping directory:", filepath);
    return;
  }

  const fileBuffer = fs.readFileSync(filepath);
  const contentType = mime.lookup(filepath) || 'application/octet-stream';

  try {
    const result = await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: `Objects/${Id}`,
      Body: fileBuffer,
      ContentType: contentType
    }));

    console.log("✅ Uploaded:", result);
  } catch (err) {
    console.error("❌ Error uploading:", err);
  }
}
