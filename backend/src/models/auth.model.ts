import { query } from "../utils/auth";
import type { SignUpForm } from "../utils/zodSchemas";
import crypto from "crypto";
import { hashPassword } from "../utils/auth";
import { ResultSetHeader, FieldPacket } from "mysql2";
import { pool } from "../configs/db.config";
export interface User {
	id?: number;
	user_id?: number;
	user_name?: string;
	email_address?: string;
	password_hash?: string;
	profile_img?: string | null;
	[k: string]: any;
}

import type { RefreshTokenWithUser } from "../types";
export const putUser = async (
	user: SignUpForm
): Promise<{ message: string }> => {
	const password_hash = await hashPassword(user.password);
	try {
		await query(
			`INSERT INTO users (user_name, phone_number ,email_address, password_hash, profile_img)
             VALUES (?, ?, ?, ?, ?);`,
			[user.name, user.phone, user.email, password_hash, user.avatar]
		);
		return { message: "success" };
	} catch (error: any) {
		if (typeof error?.message === "string") {
			if (error.message.includes("users.user_name")) {
				return { message: "name" };
			} else if (error.message.includes("users.phone_number")) {
				return { message: "phone" };
			} else if (error.message.includes("users.email_address")) {
				return { message: "email" };
			}
		}

		return { message: "error" };
	}
};

// src/models/auth.model.ts (adicionar esta função)

export const putUserByGoogle = async (profile: {
	googleId: string;
	email: string;
	displayName: string;
	photo?: string;
}): Promise<User> => {

	// 1. Verificar se já existe conta com este email
	const existing = await getUsersByEmail(profile.email).catch(() => null);

	if (existing?.id) {
		// Já existe — devolve o utilizador (login automático)
		return existing;
	}

	// 2. Criar utilizador novo via Google
	// user_name pode colidir, então adiciona sufixo aleatório se necessário
	const baseName = profile.displayName.replace(/\s+/g, "_").slice(0, 40);
	const user_name = `${baseName}_${crypto.randomBytes(3).toString("hex")}`;

	try {
		const [result] = await pool.execute<ResultSetHeader>(
			`INSERT INTO users (user_name, phone_number, email_address, password_hash, profile_img)
       VALUES (?, NULL, ?, NULL, ?)`,
			[user_name, profile.email, profile.photo ?? null]
		);

		return {
			id: result.insertId,
			user_name,
			email_address: profile.email,
			profile_img: profile.photo ?? null,
		};
	} catch (error: any) {
		throw new Error(
			"Erro ao criar utilizador via Google: " + error.message
		);
	}
};

export const getUsersByEmail = async (email: string): Promise<User> => {
	try {
		const [rows] = await query<User[]>(
			`SELECT * FROM users WHERE email_address = ?;`,
			[email]
		);
		return rows;
	} catch (error) {
		console.error("Error in getUsersByEmail:", error);
		return [];
	}
};

export const getUsersById = async (id: number): Promise<User> => {
	try {
		const [rows] = await query<User[]>(
			`SELECT * FROM users WHERE id = ?;`,
			[id]
		);
		return rows;
	} catch (error) {
		console.error("Error in getUsersByEmail:", error);
		return [];
	}
};

export const updateUserPass = async (password: string, userId: number) => {
	const passwordHash = await hashPassword(password);
	try {
		const [rows] = await pool.query<ResultSetHeader>(
			`UPDATE users SET password_hash = ? WHERE id = ?;`,
			[passwordHash, userId]
		);

		return rows.affectedRows > 0;
	} catch (error) {
		console.error("Error in setpasswords", error);
		return null;
	}
};

export const putRefreshToken = async (
	token: string,
	userId: number
): Promise<boolean> => {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const connection = await pool.getConnection();
	const token_hash = crypto.createHash("sha256").update(token).digest("hex");

	try {
		await connection.beginTransaction();

		// 1. Revoga todas as refresh tokens do usuário
		await connection.query(
			`UPDATE refresh_tokens
			 SET revoked = true
			 WHERE user_id = ? AND revoked = false`,
			[userId]
		);

		// 2. Insere o novo refresh token
		await connection.query(
			`INSERT INTO refresh_tokens (user_id, token_hash, revoked, expires_at)
			 VALUES (?, ?, false, ?)`,
			[userId, token_hash, expiresAt]
		);

		await connection.commit();
		return true;
	} catch (error) {
		await connection.rollback();
		console.error("Error in putRefreshToken:", error);
		return false;
	} finally {
		connection.release();
	}
};

export const getRefreshToken = async (
	refreshToken: string
): Promise<RefreshTokenWithUser | null> => {
	try {
		const refreshTokenHash = crypto
			.createHash("sha256")
			.update(refreshToken)
			.digest("hex");

		const [rows] = await pool.query<RefreshTokenWithUser[]>(
			`
			SELECT
			  rt.id           AS refresh_id,
			  rt.user_id,
			  rt.token_hash,
			  rt.revoked,
			  rt.created_at   AS refresh_created_at,
			  rt.expires_at,

			  u.phone_number,
			  u.user_name,
			  u.email_address,
			  u.profile_img
			FROM refresh_tokens rt
			INNER JOIN users u ON u.id = rt.user_id
			WHERE rt.token_hash = ?
			AND rt.revoked = false
			  AND rt.expires_at > NOW();
			`,
			[refreshTokenHash]
		);
		return rows.length ? rows[0] : null;
	} catch (error) {
		console.error("Error in getRefreshToken:", error);
		return null;
	}
};

export const deleteRefreshToken = async (refreshToken: string) => {
	try {
		const refreshTokenHash = crypto
			.createHash("sha256")
			.update(refreshToken)
			.digest("hex");

		const rows = await pool.query<ResultSetHeader>(
			` DELETE rt
			FROM refresh_tokens rt
			JOIN (
    			SELECT user_id
    			FROM refresh_tokens
    			WHERE token_hash = ?
    			
				) sub ON rt.user_id = sub.user_id;
			`,
			[refreshTokenHash]
		);

		if (Array.isArray(rows)) {
			const [result] = rows;
			return result.affectedRows > 0;
		}

		return false;
	} catch (error) {
		console.error("Error in getRefreshToken:", error);
		return null;
	}
};

export const deleteAccountSql = async (user_id: number) => {
	try {
		const rows = await pool.query<ResultSetHeader>(
			` DELETE FROM users WHERE id = ? LIMIT 1;
			`,
			[user_id]
		);

		if (Array.isArray(rows)) {
			const [result] = rows;
			return result.affectedRows > 0;
		}

		return false;
	} catch (error) {
		console.error("Error in getRefreshToken:", error);
		return null;
	}
};
