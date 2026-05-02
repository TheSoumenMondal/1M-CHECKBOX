import * as dotenv from "dotenv";
import z from "zod";
import { ApiError } from "../error/api-error.js";

dotenv.config();

const envSchema = z.object({
	PORT: z
		.string()
		.min(0)
		.max(65535)
		.transform((val) => parseInt(val, 10)),
	LOG_LEVEL: z
		.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
		.default("info"),
	SERVICE_NAME: z.string().optional(),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	REDIS_HOST: z.string().default("localhost"),
	REDIS_PORT: z
		.string()
		.transform((val) => parseInt(val, 10))
		.default(6379),
	OAUTH_CLIENT_ID: z.string().optional(),
	OAUTH_CLIENT_SECRET: z.string().optional(),
});

const getTypedEnv = () => {
	const parsed = envSchema.safeParse(process.env);
	if (!parsed.success) {
		throw ApiError.zodError(parsed.error);
	}
	return parsed.data;
};

const env = getTypedEnv();

export { env };
