import http from "node:http";
import { ExpressApp } from "./app.js";
import { env } from "./configs/env.js";
import { logger } from "./loggers/logger.js";

async function main(): Promise<void> {
	const app = new ExpressApp().getApp();
	const server = http.createServer(app);
	const PORT = +env.PORT;
	server.listen(PORT, () => {
		logger.info(`Server is running on port ${PORT}`);
	});
}

main();
