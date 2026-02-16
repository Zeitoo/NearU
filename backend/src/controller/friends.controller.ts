import type { Response } from "express";
import type { AuthRequest, friendsResponseSql, RelationType } from "../types";
import { getFriends } from "../models/friends.model";
import {
	putFriendship,
	acceptFriendship,
	blockFriendship,
	removeFriendship,
	rejectFriendship,
	unblockFriendship,
} from "../models/friends.model";
import { onlineUsers } from "../state/onLineUsers";
import { notifyUser } from "../utils/notifyUser";

export default class FriendsController {
	// Listar amigos
	static async listFriends(req: AuthRequest, res: Response) {
		const user_id = req.user?.id;
		if (!user_id)
			return res.status(400).json({ message: "Erro na autenticacao..." });

		const result: Record<RelationType, friendsResponseSql[]> = {
			friends: [],
			sent: [],
			received: [],
			blocked: [],
			blocked_by: [],
		};

		const response = await getFriends(user_id);

		if (response.length < 1)
			return res.status(200).json({ message: "Zero friends", result });
		response.filter(
			(element) =>
				!(
					element.status === "blocked" &&
					element.requester_id != req.user?.id
				)
		);

		response.forEach((element) => {
			element.online = onlineUsers.isOnline(element.other_user_id);
			result[element.relation_type].push(element);
		});

		res.status(200).json({ message: "Success", result });
	}

	// Enviar pedido de amizade
	static async addFriends(req: AuthRequest, res: Response) {
		const { friendId } = req.body;
		if (!friendId)
			return res
				.status(400)
				.json({ message: "ID do usuário é obrigatório." });
		if (!req.user?.id)
			return res.status(400).json({
				message:
					"Erro desconhecido ao tentar criar pedido de amizade...",
			});

		const response = await putFriendship(req.user.id, friendId);
		if (!response.success)
			return res.status(400).json({ message: "Amizade já existente..." });

		// Notifica o amigo online
		notifyUser(friendId, "FRIEND_REQUEST", {
			fromUserId: req.user.id,
			message: "Você recebeu um pedido de amizade",
		});

		res.status(200).json({ message: "Success" });
	}

	// Aceitar pedido de amizade
	static async acceptFriends(req: AuthRequest, res: Response) {
		const { friendId } = req.body;
		if (!friendId)
			return res
				.status(400)
				.json({ message: "ID do usuário é obrigatório." });
		if (!req.user?.id)
			return res.status(400).json({
				message: "Erro desconhecido ao aceitar pedido de amizade...",
			});

		const response = await acceptFriendship(friendId, req.user.id);
		if (!response)
			return res
				.status(400)
				.json({ message: "Erro ao aceitar pedido de amizade." });

		// Notifica o amigo que o pedido foi aceito
		notifyUser(friendId, "FRIEND_ACCEPTED", {
			fromUserId: req.user.id,
			message: "Seu pedido de amizade foi aceito",
		});

		res.status(200).json({ message: "Success" });
	}

	// Bloquear usuário
	static async blockFriends(req: AuthRequest, res: Response) {
		const { friendId } = req.body;
		if (!friendId)
			return res
				.status(400)
				.json({ message: "ID do usuário é obrigatório." });
		if (!req.user?.id)
			return res.status(400).json({
				message: "Erro desconhecido ao bloquear usuario...",
			});

		const response = await blockFriendship(req.user.id, friendId);
		if (!response)
			return res
				.status(400)
				.json({ message: "Erro ao bloquear usuario." });

		// Notifica o amigo que foi bloqueado
		notifyUser(friendId, "FRIEND_BLOCKED", {
			fromUserId: req.user.id,
			message: "Você foi bloqueado",
		});

		res.status(200).json({ message: "Success." });
	}

	// Desbloquear usuário
	static async unblockUser(req: AuthRequest, res: Response) {
		const { friendId } = req.body;
		if (!friendId)
			return res.status(400).json({ message: "User ID é obrigatório." });
		if (!req.user?.id)
			return res.status(401).json({ message: "Não autenticado." });

		const success = await unblockFriendship(req.user.id, friendId);
		if (!success)
			return res.status(403).json({
				message: "Não autorizado ou bloqueio inexistente.",
			});

		// Notifica o amigo que foi desbloqueado
		notifyUser(friendId, "FRIEND_UNBLOCKED", {
			fromUserId: req.user.id,
			message: "Você foi desbloqueado",
		});

		res.status(200).json({ message: "Desbloqueado com sucesso." });
	}

	// Rejeitar pedido de amizade
	static async rejectFriends(req: AuthRequest, res: Response) {
		const { friendId } = req.body;
		if (!req.user?.id)
			return res.status(400).json({
				message: "Erro desconhecido ao rejeitar pedido de amizade...",
			});

		const response = await rejectFriendship(friendId, req.user.id);
		if (!response)
			return res
				.status(400)
				.json({ message: "Erro ao rejeitar pedido de amizade." });

		// Notifica o amigo que o pedido foi rejeitado
		notifyUser(friendId, "FRIEND_REJECTED", {
			fromUserId: req.user.id,
			message: "Seu pedido de amizade foi rejeitado",
		});

		res.status(200).json({ message: "Success." });
	}

	// Remover amizade
	static async removeFriends(req: AuthRequest, res: Response) {
		const { friendId } = req.body;
		if (!friendId)
			return res
				.status(400)
				.json({ message: "ID do usuário é obrigatório." });
		if (!req.user?.id)
			return res.status(400).json({
				message: "Erro desconhecido ao remover amizade...",
			});

		const response = await removeFriendship(req.user.id, friendId);
		if (!response)
			return res
				.status(400)
				.json({ message: "Erro ao remover amizade." });

		// Notifica o amigo que a amizade foi removida
		notifyUser(friendId, "FRIEND_REMOVED", {
			fromUserId: req.user.id,
			message: "Sua amizade foi removida",
		});

		res.status(200).json({ message: "Success." });
	}
}
