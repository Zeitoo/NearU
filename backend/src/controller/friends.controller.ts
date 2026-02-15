import type { Response, Request } from "express";
import type { AuthRequest, friendsResponseSql, RelationType } from "../types";
import { getFriends } from "../models/friends.model";

import {
	putFriendship,
	acceptFriendship,
	blockFriendship,
	removeFriendship,
	rejectFriendship,
} from "../models/friends.model";
import { onlineUsers } from "../state/onLineUsers";
export default class friends {
	static async listFriends(req: AuthRequest, res: Response) {
		const onlineusers = onlineUsers.getAll();
		const user_id = req.user?.id;

		const result: Record<RelationType, friendsResponseSql[]> = {
			friends: [],
			sent: [],
			received: [],
			blocked: [],
			blocked_by: [],
		};
		if (!user_id)
			return res.status(400).json({
				message: "Erro na autenticacao...",
			});

		const response = await getFriends(user_id);

		if (response.length < 1)
			return res.status(200).json({ message: "Zero friends", result });

		response.map(
			(element) =>
				(element.online = onlineusers.includes(element.other_user_id))
		);
		for (const row of response) {
			result[row.relation_type].push(row);
		}

		res.status(200).json({ message: "Success", result });
	}
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

		const response = await putFriendship(req.user?.id, friendId);

		if (!response.success)
			return res.status(400).json({ message: "Amizade ja existente..." });

		res.status(200).json({ message: "Success" });
	}

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

		return res.status(200).json({ message: "Success." });
	}

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

		return res.status(200).json({ message: "Success." });
	}

	static async removeFriends(req: AuthRequest, res: Response) {
		console.log("req recebido");
		const { friendId } = req.body;
		if (!friendId)
			return res
				.status(400)
				.json({ message: "ID do usuário é obrigatório." });

		console.log("removendo amizade entre", req.user?.id, friendId);

		if (!req.user?.id)
			return res.status(400).json({
				message: "Erro desconhecido ao remover amizade...",
			});

		const response = await removeFriendship(req.user.id, friendId);

		if (!response)
			return res
				.status(400)
				.json({ message: "Erro ao remover amizade." });

		return res.status(200).json({ message: "Success." });
	}

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

		return res.status(200).json({ message: "Success." });
	}
}
