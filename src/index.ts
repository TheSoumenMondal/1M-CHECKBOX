import http from "node:http";
import { ExpressApp } from "./app.js";
import { env } from "./configs/env.js";
import { logger } from "./loggers/logger.js";
import { initSocketServer } from "./socket.js";

async function main(): Promise<void> {
	const appInstance = new ExpressApp();
	const app = appInstance.getApp();
	const server = http.createServer(app);
	const PORT = +env.PORT;
	initSocketServer(server);
	server.listen(PORT, () => {
		logger.info(`Server is running on port http://localhost:${PORT}`);
	});
}

main();
