import path from "node:path";
import Express from "express";

import { redisClient } from "./configs/redis.js";

class ExpressApp {
	private readonly app: Express.Application;
	constructor() {
		this.app = Express();
		this.configureMiddlewares();
		this.configureRoutes();
		this.getCheckboxes();
	}

	private configureMiddlewares(): void {
		this.app.use(Express.json());
		this.app.use(Express.urlencoded({ extended: true }));
		this.app.use(Express.static("public"));
	}

	public getCheckboxes() {
		this.app.get("/checkboxes", async (_req, res) => {
			const hash = await redisClient.hgetall("checkbox_state");
			const state = Array(100000).fill(false);
			for (const [key, value] of Object.entries(hash)) {
				state[parseInt(key, 10)] = value === "true";
			}
			res.json(state);
		});
	}

	public configureRoutes(): void {
		this.app.get("/", (_req, res) => {
			res.sendFile(path.resolve(process.cwd(), "public", "index.html"));
		});
	}

	public getApp(): Express.Application {
		return this.app;
	}
}

export { ExpressApp };
