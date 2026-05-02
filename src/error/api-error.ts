import { StatusCodes } from "http-status-codes";
import type { ZodError } from "zod";

class ApiError extends Error {
	private readonly statusCode: number;
	private readonly isOperational: boolean = true;
	constructor(
		statusCode: number,
		message: string,
		name: string,
		isOperational: boolean = true,
	) {
		super(message);
		this.statusCode = statusCode;
		this.name = name;
		this.isOperational = isOperational;
		Error.captureStackTrace(this);
	}

	public getStatusCode(): number {
		return this.statusCode;
	}

	public getIsOperational(): boolean {
		return this.isOperational;
	}

	static badRequest(message: string): ApiError {
		return new ApiError(StatusCodes.BAD_REQUEST, message, "Bad Request");
	}

	static unauthorized(message: string): ApiError {
		return new ApiError(StatusCodes.UNAUTHORIZED, message, "Unauthorized");
	}

	static forbidden(message: string): ApiError {
		return new ApiError(StatusCodes.FORBIDDEN, message, "Forbidden");
	}

	static notFound(message: string): ApiError {
		return new ApiError(StatusCodes.NOT_FOUND, message, "Not Found");
	}

	static conflict(message: string): ApiError {
		return new ApiError(StatusCodes.CONFLICT, message, "Conflict");
	}

	static internal(message: string): ApiError {
		return new ApiError(
			StatusCodes.INTERNAL_SERVER_ERROR,
			message,
			"Internal Server Error",
		);
	}

	static invalid(message: string): ApiError {
		return new ApiError(StatusCodes.BAD_REQUEST, message, "Invalid");
	}

	static zodError(error: ZodError): ApiError {
		const message = error.issues.map((issue) => issue.message).join(", ");
		return new ApiError(StatusCodes.BAD_REQUEST, message, "Validation Error");
	}
}

export { ApiError };
