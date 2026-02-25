import WebSocket, { RawData } from "ws";
import jwt from "jsonwebtoken";
import { onlineUsers, permissions } from "../state/onLineUsers";

import type { AuthenticatedSocket, webSocketMessage } from "../types";
type UserId = number;

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
		ws.token = token;
	} catch (err) {
		ws.close();
		return;
	}

	ws.on("open", () => {
		console.log("Novo user connectado.");
	});

	onlineUsers.add(userId, ws);

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

			const data = JSON.parse(message.toString()) as webSocketMessage;

			handleMessage(data);
		} catch (error) {
			console.log("Erro ao processar mensagem:", error);
		}
	});

	ws.on("close", () => {
		if (ws.userId) {
			onlineUsers.removeByUser(ws.userId);
			rateLimits.delete(ws.userId);
		}
	});

	ws.on("error", (error) => {
		console.log(`Erro no WebSocket do usuário ${userId}:`, error);

		if (ws.userId) {
			onlineUsers.removeByUser(ws.userId);
			rateLimits.delete(ws.userId);
		}
	});
}

// Limpeza periódica
setInterval(() => {
	const now = Date.now();

	for (const [userId, socket] of onlineUsers.getAll()) {
		const token = socket.token;

		if (!token) return socket.close();
		if (!process.env.AUTHORIZATION_SECRET) return socket.close();

		try {
			const data = jwt.verify(
				token,
				process.env.AUTHORIZATION_SECRET
			) as JwtPayloadWithId;

			if (!data?.id) {
				socket.close();
			}
		} catch (err) {
			return socket.close();
		}

		if (socket.readyState === WebSocket.CLOSED) {
			onlineUsers.removeByUser(userId);
			rateLimits.delete(userId);
		}
	}

	for (const [userId, rate] of rateLimits) {
		if (now - rate.lastReset > 60 * 60 * 1000) {
			rateLimits.delete(userId);
		}
	}
}, 35 * 60 * 1000);

const handleMessage = (data: webSocketMessage) => {
	switch (data.type) {
		case "LOCATION-UPDATE":
			permissions.get(data.payload.user.user_id)?.forEach((element) => {
				if (onlineUsers.isOnline(element)) {
					onlineUsers.getSocket(element)?.send(JSON.stringify(data));
				}
			});

			break;
	}
};
