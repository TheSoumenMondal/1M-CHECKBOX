import path from "node:path";
import Express from "express";

class ExpressApp {
	private readonly app: Express.Application;
	constructor() {
		this.app = Express();
		this.configureMiddlewares();
	}

	private configureMiddlewares(): void {
		this.app.use(Express.json());
		this.app.use(Express.urlencoded({ extended: true }));
		this.app.use(Express.static("public"));
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
