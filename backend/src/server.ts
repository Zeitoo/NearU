import https from "https";
import createApp from "./app";
import { setupWebSocket } from "./websocket/server";
import fs from "fs";
export default function startServer() {
	const app = createApp();

	const config = {
		key: fs.readFileSync("../localhost+3-key.pem"),
		cert: fs.readFileSync("../localhost+3.pem"),
	};

	const server = https.createServer(config, app);

	setupWebSocket(server);
	server.listen(3000, () => {
		console.log("Server started.");
	});

	server.on("error", (error: NodeJS.ErrnoException) => {
		console.error("Erro no servidor:", error);
	});

}
