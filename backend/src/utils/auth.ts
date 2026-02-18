import { RowDataPacket } from "mysql2";
import { pool } from "../configs/db.config";
import bcrypt from "bcrypt";
import crypto from "crypto";

const SALTS = 10;

export function sanitizeString(value: unknown): string {
	if (typeof value !== "string") return "";

	return value
		.trim()
		.replace(/<script.*?>.*?<\/script>/gi, "") // remove scripts
		.replace(/<\/?[^>]+(>|$)/g, "") // remove qualquer HTML
		.replace(/['";]/g, "") // remove caracteres comuns em SQLi
		.replace(/--/g, "") // remove comentários SQL
		.replace(/\b(OR|AND)\b\s+\d+=\d+/gi, ""); // remove padrões tipo OR 1=1
}

export async function hashPassword(password: string) {
	const hashedPassword = await bcrypt.hash(password, SALTS);
	return hashedPassword;
}

export async function compareHashPasswords(password: string, hash: string) {
	const result = await bcrypt.compare(password, hash);
	return result;
}

export function hash(data: string) {
	const hashedData = crypto.hash("sha256", data);

	return hashedData;
}

export function compareHashes(data: string, hashedData: string) {
	return crypto.hash("sha256", data) == hashedData;
}

export async function query<T = RowDataPacket[]>(
	sql: string,
	params?: any[]
): Promise<T> {
	const [rows] = await pool.query<RowDataPacket[]>(sql, params);
	return rows as T;
}
