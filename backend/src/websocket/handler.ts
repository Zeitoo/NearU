import WebSocket, { RawData } from "ws";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { onlineUsers } from "../state/onLineUsers";

export interface AuthenticatedSocket extends WebSocket {
	userId?: number;
	socketId?: string;
}

type UserId = number;

// Armazena sockets ativos por userId
const sockets = new Map<UserId, AuthenticatedSocket>();

// Rate limiting por usuário
const rateLimits = new Map<UserId, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 15 * 1000;

interface JwtPayloadWithId extends jwt.JwtPayload {
	id: number;
	user_name: string;
}

export async function handleWebSocketConnection(
	ws: AuthenticatedSocket,
	req: any
) {
    console.log("novo user connectado")
	const baseUrl = "http://localhost";
	const url = new URL(req.url || "", baseUrl);
	const token = url.searchParams.get("token");

	if (!token || !process.env.AUTHORIZATION_SECRET) {
		ws.close();
		return;
	}

	let userId: UserId;

	try {
		const data = jwt.verify(
			token,
			process.env.AUTHORIZATION_SECRET
		) as JwtPayloadWithId;

		if (!data?.id) {
			ws.close();
			return;
		}

		userId = data.id;
		ws.userId = userId;
	} catch (err) {
		if (err instanceof TokenExpiredError) {
			console.error("Token expirado");
		}
		if (err instanceof JsonWebTokenError) {
			console.error("Token inválido");
		}
		ws.close();
		return;
	}

	ws.on("open", () => {
		console.log("Novo user connectado.");
	});
	// Gera um socketId simples
	const socketId = crypto.randomUUID();
	ws.socketId = socketId;

	// Armazena conexão
	sockets.set(userId, ws);
	onlineUsers.add(userId, socketId);

	ws.on("message", async (message: RawData) => {
		try {
			const now = Date.now();
			const rate = rateLimits.get(userId) || { count: 0, lastReset: now };

			if (now - rate.lastReset > RATE_LIMIT_WINDOW) {
				rate.count = 0;
				rate.lastReset = now;
			}

			rate.count++;
			rateLimits.set(userId, rate);

			if (rate.count > RATE_LIMIT_MAX) {
				ws.send(
					JSON.stringify({
						type: "error",
						message: "Você está enviando mensagens rápido demais.",
					})
				);
				return;
			}

			const data = JSON.parse(message.toString());

			// exemplo simples de broadcast
			if (data.type === "PING") {
				ws.send(
					JSON.stringify({
						type: "PONG",
						timestamp: Date.now(),
					})
				);
			}
		} catch (error) {
			console.error("Erro ao processar mensagem:", error);
		}
	});

	ws.on("close", () => {
		if (ws.userId) {
			sockets.delete(ws.userId);
			onlineUsers.removeByUser(ws.userId);
			rateLimits.delete(ws.userId);
		}
	});

	ws.on("error", (error) => {
		console.error(`Erro no WebSocket do usuário ${userId}:`, error);

		if (ws.userId) {
			sockets.delete(ws.userId);
			onlineUsers.removeByUser(ws.userId);
			rateLimits.delete(ws.userId);
		}
	});
}

// Limpeza periódica
setInterval(() => {
	const now = Date.now();

	for (const [userId, socket] of sockets) {
		if (socket.readyState === WebSocket.CLOSED) {
			sockets.delete(userId);
			onlineUsers.removeByUser(userId);
			rateLimits.delete(userId);
		}
	}

	for (const [userId, rate] of rateLimits) {
		if (now - rate.lastReset > 60 * 60 * 1000) {
			rateLimits.delete(userId);
		}
	}
}, 5 * 60 * 1000);
