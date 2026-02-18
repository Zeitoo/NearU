import { Response } from "express";
import { getUsersByName } from "../models/user.model";
import { AuthRequest } from "../types";
import { onlineUsers } from "../state/onLineUsers";
import { profileImg } from "../models/user.model";
export default class user {
	static async searchName(req: AuthRequest, res: Response) {
		const { name } = req.query;

		if (typeof name !== "string")
			return res.status(400).json({ message: "Invalid params" });

		let response = await getUsersByName(name);

		if (!response)
			return res.status(200).json({ message: "No user found." });

		response = response.filter((element) => element.id != req.user?.id);
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
		const userId = req.user?.id;
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
}
