import type http from "node:http";
import { Server } from "socket.io";
import { logger } from "./loggers/logger.js";

function initSocketServer(server: http.Server, state: boolean[]) {
	const io = new Server(server);
	io.on("connection", (socket) => {
		logger.info(`New client connected: ${socket.id}`);

		socket.on("client:state:change", (data) => {
			state[data.i] = data.state;
			io.emit("server:state:change", data);
		});

		socket.on("disconnect", () => {
			logger.info(`Client disconnected: ${socket.id}`);
		});
	});
}

export { initSocketServer };
