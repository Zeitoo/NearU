import { Request, Response } from "express";
import { generatAccessToken } from "../utils/token";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { SignUpForm } from "../utils/zodSchemas";
import {
	getUsersByEmail,
	putRefreshToken,
	putUser,
	getRefreshToken,
	deleteRefreshToken,
} from "../models/auth.model";
import { compareHashPasswords } from "../utils/auth";
import { generateToken } from "../utils/token";
import crypto from "crypto";

const isProduction = process.env.NODE_ENV === "production";

export default class auth {
	static async login(req: Request, res: Response) {
		const user = await getUsersByEmail(req.body.email);
		if (!user.password_hash || !user.id || !user.user_name)
			return res.status(400);
		const result = await compareHashPasswords(
			req.body.password,
			user.password_hash
		);
		if (!result)
			return res.status(401).json({ message: "Invalid credentials" });

		delete user.password_hash;
		const refreshToken = generateToken(32);

		const resposta = await putRefreshToken(refreshToken, user.id);
		if (!resposta)
			return res.status(500).json({ message: "Houve um erro no login." });

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
		});

		return res.status(200).json({
			message: "Login feito com sucesso.",
			access_token: generatAccessToken({
				id: user.id,
				user_name: user.user_name,
			}),
			user,
		});
	}

	static async register(req: Request, res: Response) {
		const data: SignUpForm = req.body;

		const response = await putUser(data);

		if (response) {
			setTimeout(() => {
				res.status(200).json(response);
			}, 3000);
		} else {
			setTimeout(() => {
				res.status(500).json({
					message: "Erro interno do servidor no auth...",
				});
			}, 4000);
		}
	}

	static async refresh(req: Request, res: Response) {
		const { refresh_token } = req.cookies;

		const refreshToken = generateToken(32);

		if (!refresh_token)
			return res
				.status(200)
				.json({ message: "Refresh token não fornecido. Por favor fazer login" });

		const response = await getRefreshToken(refresh_token);

		if (!response) {
			//onproduction change

			res.status(200).json({ message: "Refresh token inválido." });

			return;
		}

		const user = {
			user_id: response.user_id,
			phone_number: response.phone_number,
			user_name: response.user_name,
			email_address: response.email_address,
			profile_img: response.profile_img,
		};

		const resposta = await putRefreshToken(refreshToken, user.user_id);
		if (!resposta)
			return res
				.status(500)
				.json({ message: "Houve um erro no refresh." });

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
		});

		return res.status(200).json({
			message: "Refresh feito com sucesso.",
			access_token: generatAccessToken({
				id: user.user_id,
				user_name: user.user_name,
			}),
			user,
		});
	}

	static async logout(req: Request, res: Response) {
		const { refresh_token } = req.cookies;
		console.log("The refresh Token");
		if (!refresh_token)
			return res
				.status(400)
				.json({ message: "Refresh token não fornecido." });
		const response = await deleteRefreshToken(refresh_token);

		if (!response)
			return res.status(400).json({ message: "Refresh token invalido." });

		res.status(200).json({ message: "Logout feito com sucesso." });
	}

	static async reset(req: Request, res: Response) {
		console.log(req.body);
		setTimeout(() => {
			res.status(200).json({ message: "reseted" });
		}, 4000);
	}

	static async activate(req: Request, res: Response) {}

	static async test(req: Request, res: Response) {
		res.send(generatAccessToken({ id: 1, user_name: "test" }));
	}
}
