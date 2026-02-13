import type { Response, Request } from "express";
import type { AuthRequest } from "../types";

import {
	putFriendship,
	acceptFriendship,
	blockFriendship,
	removeFriendship,
	rejectFriendship,
} from "../models/friends.model";
export default class friends {
	static async addFriends(req: AuthRequest, res: Response) {
		const { friendId } = req.body;

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
		const { friendId } = req.body;

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
