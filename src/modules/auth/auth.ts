import path from "node:path";
import { Router } from "express";
import { env } from "../../configs/env.js";
import { logger } from "../../loggers/logger.js";

const authRouter: Router = Router();

authRouter.get("/login", (_req, res) => {
	res.sendFile(path.resolve(process.cwd(), "public", "login.html"));
});

authRouter.get("/auth/google", (req, res) => {
	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
	const redirectUri = `${req.protocol}://${req.get("host")}/auth/google/callback`;
	const options: Record<string, string> = {
		redirect_uri: redirectUri,
		client_id: env.OAUTH_CLIENT_ID || "",
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	};
	const qs = new URLSearchParams(options);
	res.redirect(`${rootUrl}?${qs.toString()}`);
});

authRouter.get("/auth/google/callback", async (req, res) => {
	const code = req.query.code as string;
	if (!code) return res.redirect("/login");

	const redirectUri = `${req.protocol}://${req.get("host")}/auth/google/callback`;
	const url = "https://oauth2.googleapis.com/token";
	const values: Record<string, string> = {
		code,
		client_id: env.OAUTH_CLIENT_ID || "",
		client_secret: env.OAUTH_CLIENT_SECRET || "",
		redirect_uri: redirectUri,
		grant_type: "authorization_code",
	};

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams(values).toString(),
		});
		const data = (await response.json()) as {
			id_token?: string;
			access_token?: string;
		};

		if (data.id_token || data.access_token) {
			let name = "Someone";
			if (data.access_token) {
				try {
					const userResponse = await fetch(
						`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.access_token}`
					);
					const profile = (await userResponse.json()) as { name?: string };
					if (profile.name) name = profile.name;
				} catch (e) {
					logger.error("Failed to fetch user name", e);
				}
			}
			res.cookie("auth_token", data.id_token || data.access_token, {
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.cookie("user_name", name, {
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.redirect("/");
		} else {
			res.redirect("/login?error=auth_failed");
		}
	} catch (err) {
		logger.error(err);
		res.redirect("/login?error=server_error");
	}
});

authRouter.get("/logout", (_req, res) => {
	res.clearCookie("auth_token");
	res.clearCookie("user_name");
	res.redirect("/");
});

export { authRouter };
