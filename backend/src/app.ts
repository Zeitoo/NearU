import Express from "express";
import routes from "./routes";
import cors from "cors";
import { corsOptions } from "./configs/cors.config";
import cookieParser from "cookie-parser";

export default function createApp() {
	const app = Express();
	app.use(Express.json());
	app.use(cors(corsOptions));
	app.use(cookieParser());
	app.use("/api", routes);

	app.get("/", (req, res) => {
		res.send("hi");
	});

	return app;
}
