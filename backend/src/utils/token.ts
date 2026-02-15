import jwt from "jsonwebtoken";
import { UserToken } from "../types";
import crypto from "crypto";

export const generatAccessToken = (user: UserToken) => {
	if (process.env.AUTHORIZATION_SECRET) {
		return jwt.sign(user, process.env.AUTHORIZATION_SECRET, {
			expiresIn: "1m",
		});
	}
};

export const generateToken = (length: number) => {
	const token = crypto.randomBytes(length).toString("hex");
	return token;
};
