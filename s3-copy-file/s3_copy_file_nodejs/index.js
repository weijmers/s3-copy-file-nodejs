#!/usr/bin/env node
import { register, next } from "./extensions-api.js";
import { copy } from "./copy_s3_file.js"

const EventType = {
  INVOKE: 'INVOKE',
  SHUTDOWN: 'SHUTDOWN',
};

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
  await copy(process.env.S3_BUCKET, process.env.S3_KEY)

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