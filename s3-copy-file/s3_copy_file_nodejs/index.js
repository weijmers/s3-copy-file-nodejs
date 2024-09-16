#!/usr/bin/env node
import { register, next } from "./extensions-api.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const EventType = {
  INVOKE: 'INVOKE',
  SHUTDOWN: 'SHUTDOWN',
};

const client = new S3Client();

async function readBytes(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function fetchS3File(bucket, key) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  try {
    const response = await client.send(command);
    const data = await readBytes(response.Body);
    const localFilePath = `/tmp/${process.env.S3_KEY}`;
    fs.writeFileSync(localFilePath, data);
  } catch (error) {
    console.log(error);
  }
}

async function handleShutdown(event) {
  console.log(JSON.stringify(event));
  console.log('SHUTDOWN');
  process.exit(0);
}

async function handleInvoke(event) {}

(async function main() {
  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  console.log("hello from extension ...");
  const extensionId = await register();
  
  console.log("fetch file ...");
  await fetchS3File(process.env.S3_BUCKET, process.env.S3_KEY)

  while (true) {
    const event = await next(extensionId);
    switch (event.eventType) {
      case EventType.SHUTDOWN:
        await handleShutdown(event);
        break;
      case EventType.INVOKE:
        await handleInvoke(event);
        break;
      default:
        throw new Error('unknown event: ' + event.eventType);
    }
  }
})();