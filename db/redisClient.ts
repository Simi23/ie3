import { createClient, type RedisClientType } from "redis";

const RedisUrl = process.env.REDIS_URL ?? "";

const globalForRedis = globalThis as unknown as { redis: RedisClientType };

export const redis =
  globalForRedis.redis ||
  (await createClient({ url: RedisUrl })
    .on("error", (err: any) => console.log(`Redis Client error: ${err}`))
    .connect());

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
