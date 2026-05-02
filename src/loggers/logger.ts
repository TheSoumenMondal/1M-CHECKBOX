import os from "node:os";
import winston from "winston";
import { env } from "../configs/env.js";

const multiLineFormat = winston.format.printf(
	({ timestamp, level, message, stack, metadata }) => {
		let output = `${timestamp} ${level}: ${stack || message}`;

		if (metadata) {
			for (const [key, value] of Object.entries(metadata)) {
				output += `\n  ${key}: ${
					typeof value === "object" ? JSON.stringify(value) : value
				}`;
			}
		}

		return output;
	},
);

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD | HH:mm:ss",
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.metadata({
			fillExcept: ["message", "level", "timestamp", "label"],
		}),
	),
	defaultMeta: {
		service: env.SERVICE_NAME,
		env: env.NODE_ENV,
		pid: process.pid,
		hostname: os.hostname(),
	},
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize({ all: true }),
				multiLineFormat,
			),
		}),
	],
});

export { logger };
