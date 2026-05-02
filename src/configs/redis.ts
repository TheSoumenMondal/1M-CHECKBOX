import { Redis } from "ioredis";
import { logger } from "../loggers/logger.js";
import { env } from "./env.js";

const redisConfig = {
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
};

export const redisClient = new Redis(redisConfig);

export const pubClient = new Redis(redisConfig);

export const subClient = new Redis(redisConfig);

redisClient.on("error", (err) => {
	logger.error("Redis Client Error", err);
});

pubClient.on("error", (err) => {
	logger.error("Redis Pub Client Error", err);
});

subClient.on("error", (err) => {
	logger.error("Redis Sub Client Error", err);
});
