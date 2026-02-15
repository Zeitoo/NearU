import { pool } from "../configs/db.config";
import type { ResultSetHeader } from "mysql2";
import type { friendsResponseSql } from "../types";
export const putFriendship = async (requester: number, addressee: number) => {
	try {
		const [result] = await pool.query<ResultSetHeader>(
			`INSERT INTO friendships (requester_id, addressee_id) VALUES (?, ?)`,
			[requester, addressee]
		);

		if (result.affectedRows > 0) {
			return {
				success: true,
				insertId: result.insertId,
			};
		}

		return { success: false };
	} catch (error) {
		return { success: false };
	}
};
export const blockFriendship = async (requester: number, addressee: number) => {
	try {
		const [result] = await pool.query<ResultSetHeader>(
			`INSERT INTO friendships (requester_id, addressee_id, status)
                VALUES (?, ?, 'blocked')
                ON DUPLICATE KEY UPDATE
                status = 'blocked',
                updated_at = CURRENT_TIMESTAMP;`,
			[requester, addressee]
		);

		if (result.affectedRows > 0) {
			return {
				success: true,
				insertId: result.insertId,
			};
		}

		return { success: false };
	} catch (error) {
		return { success: false };
	}
};

export const acceptFriendship = async (
	requesterId: number,
	authUserId: number // vem do JWT
) => {
	const [result] = await pool.query<ResultSetHeader>(
		`
		UPDATE friendships
		SET status = 'accepted',
		    updated_at = CURRENT_TIMESTAMP
		WHERE requester_id = ?
		  AND addressee_id = ?
		  AND status = 'pending'
		`,
		[requesterId, authUserId]
	);

	if (result.affectedRows === 0) {
		return {
			success: false,
			message: "No pending request found",
		};
	}

	return { success: true };
};

export const rejectFriendship = async (
	requesterId: number,
	authUserId: number // vem do JWT
) => {
	const [result] = await pool.query<ResultSetHeader>(
		`
		UPDATE friendships
		SET status = 'rejected',
		    updated_at = CURRENT_TIMESTAMP
		WHERE requester_id = ?
		  AND addressee_id = ?
		  AND status = 'pending'
		`,
		[requesterId, authUserId]
	);

	if (result.affectedRows === 0) {
		return {
			success: false,
			message: "No pending request found",
		};
	}

	return { success: true };
};

export const removeFriendship = async (
	authUserId: number, // vem do JWT
	otherUserId: number // vem do body
) => {
	const [result] = await pool.query<ResultSetHeader>(
		`
		DELETE FROM friendships
		WHERE user_low = LEAST(?, ?)
		  AND user_high = GREATEST(?, ?)
		`,
		[authUserId, otherUserId, authUserId, otherUserId]
	);

	console.log("sql response: ", result);

	if (result.affectedRows === 0) {
		return {
			success: false,
			message: "Friendship not found",
		};
	}

	return { success: true };
};

export const getFriends = async (
	user_id: number
): Promise<friendsResponseSql[]> => {
	try {
		const [rows] = await pool.query(
			`
			SELECT
    			f.id,
    			f.status,
    			f.requester_id,
    			f.addressee_id,
    			u.id AS other_user_id,
    			u.user_name,
    			u.profile_img,
				
				CASE
					WHEN f.status = 'accepted' THEN 'friends'
					WHEN f.status = 'pending' AND f.requester_id = ? THEN 'sent'
					WHEN f.status = 'pending' AND f.addressee_id = ? THEN 'received'
					WHEN f.status = 'blocked' AND f.requester_id = ? THEN 'blocked'
					WHEN f.status = 'blocked' AND f.addressee_id = ? THEN 'blocked_by'
					ELSE 'other'
				END AS relation_type

			FROM friendships f
			JOIN users u
				ON u.id = IF(f.requester_id = ?, f.addressee_id, f.requester_id)

			WHERE ? IN (f.requester_id, f.addressee_id);
			`,
			[user_id, user_id, user_id, user_id, user_id, user_id]
		);

		return rows as friendsResponseSql[];
	} catch (error) {
		console.log("Error getting friends", error);
		return [];
	}
};
