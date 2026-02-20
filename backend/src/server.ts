import https from "https";
import createApp from "./app";
import fs from "fs";
import { setupWebSocket } from "./websocket/server";
export default function startServer() {
	const options = {
		key: fs.readFileSync("../localhost+3-key.pem"),
		cert: fs.readFileSync("../localhost+3.pem"),
	};

	const app = createApp();
	const server = https.createServer(options, app);

	setupWebSocket(server);
	server.listen(3000, () => {
		console.log("Server started at https://localhost:3000");
	});

	server.on("error", (error: NodeJS.ErrnoException) => {
		console.error("Erro no servidor:", error);
	});
}
