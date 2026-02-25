import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { sanitizeString } from "../utils/auth";
import { signinSchema, signupSchema } from "../utils/zodSchemas";
import type { SignInForm } from "../utils/zodSchemas";
import type { SignUpForm } from "../utils/zodSchemas";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

interface JwtPayloadWithId extends jwt.JwtPayload {
	id: number;
	user_name: string;
}

import type { AuthRequest } from "../types";

export default class authMiddleware {
	static login(req: Request, res: Response, next: NextFunction) {
		const data: SignInForm = req.body;
		const validation = z.safeParse(signinSchema, data);
		if (validation.success) {
			req.body = {
				email: sanitizeString(validation.data.email),
				password: sanitizeString(validation.data.password),
				session: validation.data.session,
			};
			next();
		} else {
			res.send("invalid data");
		}
	}

	static register(req: Request, res: Response, next: NextFunction) {
		const data: SignUpForm = req.body;
		const validation = z.safeParse(signupSchema, data);
		if (validation.success) {
			req.body = {
				email: sanitizeString(validation.data.email),
				password: sanitizeString(validation.data.password),
				name: sanitizeString(validation.data.name),
				phone: sanitizeString(validation.data.phone),
				avatar: validation.data.avatar,
			};
			next();
		} else {
			res.send("invalid data");
		}
	}

	static verifyJwt(req: AuthRequest, res: Response, next: NextFunction) {
		const authorization =
			req.headers["authorization"] ?? req.headers.authorization;

		const access_token =
			typeof authorization === "string"
				? authorization.split(" ")[1]
				: undefined;

		if (!access_token || !process.env.AUTHORIZATION_SECRET) {
			return res.status(401).json({ message: "Credenciais ausentes." });
		}
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

			req.currentUser = data;

			return next();
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
