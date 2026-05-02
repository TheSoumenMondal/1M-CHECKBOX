import type http from "node:http";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";
import { pubClient, redisClient, subClient } from "./configs/redis.js";
import { logger } from "./loggers/logger.js";

function initSocketServer(server: http.Server) {
	const io = new Server(server);
	io.adapter(createAdapter(pubClient, subClient));

	io.on("connection", (socket) => {
		logger.info(`New client connected: ${socket.id}`);

		socket.on("client:state:change", async (data) => {
			const cookies = socket.handshake.headers.cookie
				? Object.fromEntries(socket.handshake.headers.cookie.split(';').map(c => c.trim().split('=')))
				: {};
			if (!cookies.auth_token) {
				return;
			}
			await redisClient.hset("checkbox_state", data.i, String(data.state));
			io.emit("server:state:change", data);
		});

		socket.on("disconnect", () => {
			logger.info(`Client disconnected: ${socket.id}`);
		});
	});
}

export { initSocketServer };
