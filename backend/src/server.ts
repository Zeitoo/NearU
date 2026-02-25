import http from "http";
import createApp from "./app";
import { setupWebSocket } from "./websocket/server";
import {query} from "./utils/auth"
export default function startServer() {
	const app = createApp();

	const server = http.createServer(app);

	setupWebSocket(server);
	server.listen(3000, () => {
		console.log("Server started.");
	});

	server.on("error", (error: NodeJS.ErrnoException) => {
		console.error("Erro no servidor:", error);
	});

	setTimeout(() => {
		query("SHOW TABLES").then((res) => {
			console.log("Conexão com o banco de dados estabelecida com sucesso.", res);
		}).catch((err) => {
			console.log(err)
		})
	}, 5000);
}
