import { Response } from "express";
import { getUsersByName } from "../models/user.model";
import { AuthRequest } from "../types";
import { onlineUsers } from "../state/onLineUsers";
import { profileImg } from "../models/user.model";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { getUsersById } from "../models/auth.model";

interface JwtPayloadWithId extends jwt.JwtPayload {
	id: number;
	user_name: string;
}

export default class user {
	static async searchName(req: AuthRequest, res: Response) {
		const { name } = req.query;

		if (typeof name !== "string")
			return res.status(400).json({ message: "Invalid params" });

		let response = await getUsersByName(name);

		if (!response)
			return res.status(200).json({ message: "No user found." });

		response = response.filter(
			(element) => element.id != req.currentUser?.id
		);
		res.status(200).json({
			message: "sucess",
			users: response.map((element) => {
				return {
					user_name: element.user_name,
					profile_img: element.profile_img,
					id: element.id,
					online: onlineUsers.isOnline(element.id),
				};
			}),
		});
	}

	static async updateProfileImg(req: AuthRequest, res: Response) {
		const userId = req.currentUser?.id;
		const { profile_img } = req.body;

		if (!profile_img) {
			return res
				.status(400)
				.json({ message: "Profile img nao fornecido." });
		}

		if (!userId) {
			return res.status(401).json({ message: "Não autenticado" });
		}

		const response = await profileImg(profile_img, userId);

		if (!response)
			return res.status(400).json({ message: "Perfil nao modificado." });

		return res.status(200).json({ message: "Perfil alterado." });
	}

	static async getUser(req: AuthRequest, res: Response) {
		const { access_token } = req.body;

		if (!access_token || !process.env.AUTHORIZATION_SECRET) {
			return res.status(401).json({ message: "Credenciais ausentes." });
		}

		if (typeof access_token !== "string")
			return res.status(400).json({ message: "Invalid token" });

		try {
			const data = jwt.verify(
				access_token,
				process.env.AUTHORIZATION_SECRET
			) as JwtPayloadWithId;

			if (!data || !data.id) {
				return res
					.status(403)
					.json({ message: "Token inválido ou payload incompleto." });
			}
			const response = await getUsersById(data.id);

			if (response) {
				return res
					.status(200)
					.json({ message: "success", user: response });
			}
			return res.status(400).json({ message: "Houve um erro." });
		} catch (err) {
			if (err instanceof TokenExpiredError) {
				return res
					.status(401)
					.json({ message: "Access token expirado." });
			}
			if (err instanceof JsonWebTokenError) {
				return res.status(403).json({
					message: "Falha na verificação do token.",
					details: err.message,
				});
			}
			console.log("Erro ao verificar JWT:", err);
			return res
				.status(500)
				.json({ message: "Erro interno ao verificar token." });
		}
	}
}
