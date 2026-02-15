import { Request, Response } from "express";
import { getUsersByName } from "../models/user.model";
export default class user {
	static async searchName(req: Request, res: Response) {
		const { name } = req.query;

		if (typeof name !== "string")
			return res.status(400).json({ message: "Invalid params" });

		const response = await getUsersByName(name);

		if (!response)
			return res.status(200).json({ message: "No user found." });

		res.status(200).json({
			message: "sucess",
			users: response.map((element) => {
				return {
					user_name: element.user_name,
					profile_img: element.profile_img,
					id: element.id,
				};
			}),
		});
	}
}
