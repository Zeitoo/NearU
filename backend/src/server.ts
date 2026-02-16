import http from "http";
import createApp from "./app";
import { onlineUsers } from "./state/onLineUsers";
import { setupWebSocket } from "./websocket/server";
export default function startServer() {
	const app = createApp();
	const server = http.createServer(app);

	setupWebSocket(server);
	server.listen(3000, () => {
		console.log("Server started at http://localhost:3000");
	});

	server.on("error", (error: NodeJS.ErrnoException) => {
		console.error("Erro no servidor:", error);
	});

}
