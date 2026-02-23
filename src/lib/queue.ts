import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
});

export const warmthQueue = new Queue("warmth-recalculate", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
    },
});

export const nudgeQueue = new Queue("nudge-generator", {
    connection,
});

// Worker for warmth recalculation (Example)
// In a real production app, this would run in a separate process or a dedicated worker service.
/*
const warmthWorker = new Worker("warmth-recalculate", async (job) => {
  console.log(`Processing warmth for user: ${job.data.userId}`);
  // Logic to iterate through user contacts and call calculateWarmth
}, { connection });
*/
