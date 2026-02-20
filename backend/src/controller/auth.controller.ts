import { Request, Response } from "express";
import { generatAccessToken } from "../utils/token";
import { SignUpForm } from "../utils/zodSchemas";
import {
	getUsersByEmail,
	putRefreshToken,
	putUser,
	getRefreshToken,
	deleteRefreshToken,
	getUsersById,
	updateUserPass,
	deleteAccountSql,
} from "../models/auth.model";
import { compareHashPasswords } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthRequest } from "../types";

export default class auth {
	static async login(req: Request, res: Response) {
		const { email, password, session } = req.body;

		if (!email)
			return res.status(400).json({ message: "Email nao fornecido." });
		
		const user = await getUsersByEmail(email);

		if (!user.password_hash || !user.id || !user.user_name)
			return res.status(404).json({message: "User nao encontrado."})

		const result = await compareHashPasswords(password, user.password_hash);

		if (!result)
			return res.status(400).json({ message: "Invalid credentials" });

		delete user.password_hash;
		const refreshToken = generateToken(32);

		const resposta = await putRefreshToken(refreshToken, user.id);

		if (!resposta)
			return res.status(500).json({ message: "Houve um erro no login." });

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			maxAge: session ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24,
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
		if (!response) {
			return res.status(500).json({
				message: "Erro interno do servidor no auth...",
			});
		} else {
			if (response.message == "name") {
				return res.status(400).json({ message: "name" });
			} else if (response.message == "email") {
				return res.status(400).json({ message: "email" });
			}

			return res.status(200).json({ message: "success" });
		}
	}

	static async refresh(req: Request, res: Response) {
		const { refresh_token } = req.cookies;

		const refreshToken = generateToken(32);

		if (!refresh_token)
			return res.status(400).json({
				message: "Refresh token não fornecido. Por favor fazer login",
			});

		const response = await getRefreshToken(refresh_token);

		if (!response) {
			res.status(404).json({ message: "Refresh token inválido." });

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
		if (!refresh_token)
			return res
				.status(400)
				.json({ message: "Refresh token não fornecido." });

		const response = await deleteRefreshToken(refresh_token);

		if (!response)
			return res.status(400).json({ message: "Refresh token invalido." });

		res.clearCookie("refresh_token");

		return res.status(200).json({ message: "Logout feito com sucesso." });
	}

	static async changePass(req: AuthRequest, res: Response) {
		const { actual, newPass } = req.body;

		if (!actual || !newPass)
			return res.status(400).json({ message: "Informacoes ausentes." });

		if (!req.user?.id)
			return res.status(401).json({
				message:
					"Primeiro inicie a sessao antes de trocar de palavra-passe.",
			});

		const response = await getUsersById(req.user?.id);

		if (!response.password_hash)
			return res.status(404).json({ message: "user nao encontrado." });

		const isValid = await compareHashPasswords(
			actual,
			response.password_hash
		);

		if (isValid) {
			const resposta = await updateUserPass(newPass, req.user.id);

			if (!resposta)
				return res.status(500).json({ message: "Deu errado" });
			return res.status(200).json({ message: "Sucesso" });
		}

		return res.status(200).json({ message: "palavra-passe errada." });
	}

	static async deleteAccount(req: AuthRequest, res: Response) {
		const { password } = req.body;
		if (!password)
			return res.status(400).json({ message: "Palavra-passe ausente." });

		if (!req.user?.id)
			return res.status(401).json({
				message: "Primeiro inicie a sessao antes de apagar a conta.",
			});

		const response = await getUsersById(req.user?.id);

		if (!response.password_hash)
			return res.status(404).json({ message: "user nao encontrado." });

		const isValid = await compareHashPasswords(
			password,
			response.password_hash
		);

		if (isValid) {
			const resposta = await deleteAccountSql(req.user.id);

			if (!resposta)
				return res.status(400).json({ message: "Deu errado" });
			return res.status(200).json({ message: "Sucesso" });
		}

		return res.status(400).json({ message: "palavra-passe errada." });
	}

	static async activate(req: Request, res: Response) {}

	static async reset(req: Request, res: Response) {
		console.log(req.body);
		setTimeout(() => {
			res.status(200).json({ message: "reseted" });
		}, 4000);
	}
}
