import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";

const client = new S3Client();

async function readBytes(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
  
export async function copy(bucket, key, basePath = "tmp") {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  try {
    const response = await client.send(command);
    const data = await readBytes(response.Body);
    const localFilePath = path.join(basePath, key);
    fs.writeFileSync(localFilePath, data);
  } catch (error) {
    console.log(error);
  }
}