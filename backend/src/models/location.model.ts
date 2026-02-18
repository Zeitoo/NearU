import { Response } from "express";
import { pool } from "../configs/db.config";
import type { AuthRequest } from "../types";

export const allowViewer = async (req: AuthRequest, res: Response) => {
	try {
		const ownerId = req.user?.id;
		const { viewerId } = req.body;

		if (!ownerId) {
			return res.status(401).json({ message: "Não autenticado" });
		}

		if (!viewerId || typeof viewerId !== "number") {
			return res.status(400).json({ message: "viewerId inválido" });
		}

		if (viewerId === ownerId) {
			return res
				.status(400)
				.json({ message: "Não podes permitir a ti mesmo" });
		}

		await pool.execute(
			`
      INSERT INTO location_permissions (owner_id, viewer_id, is_allowed)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE is_allowed = 1
      `,
			[ownerId, viewerId]
		);

		return res.status(200).json({
			message: "Permissão concedida com sucesso",
		});
	} catch (error: any) {
		// FK violation (user não existe)
		if (error.code === "ER_NO_REFERENCED_ROW_2") {
			return res.status(404).json({
				message: "Utilizador não encontrado",
			});
		}

		console.error(error);

		return res.status(500).json({
			message: "Erro interno do servidor",
		});
	}
};

export const updateLocationPermission = async (
	req: AuthRequest,
	res: Response
) => {
	try {
		const ownerId = req.user?.id;
		const { viewerId, isAllowed } = req.body;

		if (!ownerId) {
			return res.status(401).json({ message: "Não autenticado" });
		}

		if (typeof viewerId !== "number" || typeof isAllowed !== "boolean") {
			return res.status(400).json({
				message: "viewerId ou isAllowed inválido",
			});
		}

		const [result]: any = await pool.execute(
			`
      UPDATE location_permissions
      SET is_allowed = ?
      WHERE owner_id = ? AND viewer_id = ?
      `,
			[isAllowed ? 1 : 0, ownerId, viewerId]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				message: "Permissão não encontrada",
			});
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

export const getLocations= async (req: AuthRequest, res: Response) => {
	try {
		const [rows] = await pool.execute(
			` SELECT * FROM location_permissions WHERE is_allowed = 1;`
		);

		console.log(rows);
		return res.status(200).json(rows);
	} catch {
		return res.status(500).json({ message: "Erro interno" });
	}
};

