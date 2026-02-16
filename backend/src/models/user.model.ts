import { query } from "../utils/auth";

import { RowDataPacket } from "mysql2";
import { hashPassword } from "../utils/auth";
import { ResultSetHeader, FieldPacket } from "mysql2";
import { pool } from "../configs/db.config";
export interface User {
	id: number;
	user_name?: string;
	email_address?: string;
	password_hash?: string;
	profile_img?: string | null;
	[k: string]: any;
}

export const getUsersByName = async (name: string): Promise<User[]> => {
	try {
		const [rows] = await pool.query(
			`SELECT * FROM users WHERE user_name LIKE ?`,
			[`%${name}%`]
		);

		return rows as User[];
	} catch (error) {
		console.error("Error in getUsersByName:", error);
		return [];
	}
};
