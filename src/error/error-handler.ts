import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../configs/env.js";
import { logger } from "../loggers/logger.js";
import { ApiError } from "./api-error.js";

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction,
) {
	const isApiError = err instanceof ApiError;

	const statusCode = isApiError
		? err.getStatusCode()
		: StatusCodes.INTERNAL_SERVER_ERROR;

	const message = isApiError ? err.message : "Internal Server Error";

	logger.error("Request failed", {
		method: req.method,
		url: req.originalUrl,
		ip: req.ip,
		userAgent: req.headers["user-agent"],
		statusCode,
		error: {
			name: err.name,
			message: err.message,
			stack: err.stack,
		},
	});

	res.status(statusCode).json({
		success: false,
		message,
		error: err.name,
		data: null,
		...(env.NODE_ENV === "development" && { stack: err.stack }),
	});
}
