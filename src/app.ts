import path from "node:path";
import Express from "express";

class ExpressApp {
	private readonly app: Express.Application;
	public state: boolean[] = Array(1000).fill(false);
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
		this.app.get("/checkboxes", (_req, res) => {
			res.json(this.state);
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
