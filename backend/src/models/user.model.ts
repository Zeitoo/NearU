import { pool } from "../configs/db.config";
import type { User, AuthRequest } from "../types";

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

export const profileImg = async (avatar: number, userId: number) => {
	try {
		const [result]: any = await pool.execute(
			`
			UPDATE users
			SET profile_img = ?
			WHERE id = ?; 
	  `,
			[avatar, userId]
		);

		if (result.affectedRows === 0) {
			return false;
		}

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};
