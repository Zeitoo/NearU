import { Response } from "express";
import { putLocationPermission } from "../models/location.model";
import type { AuthRequest } from "../types";
import {
	removePermissionFromCache,
	addPermissionToCache,
} from "../models/location.model";
export const updateLocationPermission = async (
	req: AuthRequest,
	res: Response
) => {
	try {
		const ownerId = req.currentUser?.id;
		const { viewerId, isAllowed } = req.body;

		if (!ownerId) {
			return res.status(401).json({ message: "Não autenticado" });
		}

		if (typeof viewerId !== "number" || typeof isAllowed !== "boolean") {
			return res.status(400).json({
				message: "viewerId ou isAllowed inválido",
			});
		}

		const response = await putLocationPermission(
			ownerId,
			viewerId,
			isAllowed
		);

		if (!response.success)
			return res.status(400).json({ message: "Houve um erro." });

		if (isAllowed) {
			addPermissionToCache(ownerId, viewerId);
		} else {
			removePermissionFromCache(ownerId, viewerId);
		}

		return res.status(200).json({
			message: "Permissão atualizada com sucesso",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Erro interno do servidor",
		});
	}
};
