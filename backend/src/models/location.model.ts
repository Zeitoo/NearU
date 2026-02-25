import { pool } from "../configs/db.config";
import { QueryResult, RowDataPacket } from "mysql2";

export const putLocationPermission = async (
	ownerId: number,
	viewerId: number,
	isAllowed: boolean
) => {
	try {
		const [result]: any = await pool.execute(
			`
			INSERT INTO location_permissions (owner_id, viewer_id, is_allowed)
			VALUES (?, ?, ?)
			ON DUPLICATE KEY UPDATE
			is_allowed = VALUES(is_allowed)`,

			[ownerId, viewerId, isAllowed ? 1 : 0]
		);
		if (result.affectedRows > 0) {
			return {
				success: true,
			};
		}

		return { success: false };
	} catch (error) {
		return { success: false };
	}
};

export interface PermissionRow {
	owner_id: number;
	viewer_id: number;
}
import { permissions } from "../state/onLineUsers";
export const loadPermissionsToCache = async (): Promise<
	Map<number, Set<number>>
> => {
	try {
		permissions.clear();
		const [rows] = await pool.execute<RowDataPacket[] & PermissionRow[]>(
			`SELECT owner_id, viewer_id FROM location_permissions WHERE is_allowed = 1`
		);

		for (const r of rows) {
			const owner = r.owner_id;
			const viewer = r.viewer_id;

			if (!permissions.has(owner)) {
				permissions.set(owner, new Set());
			}
			permissions.get(owner)!.add(viewer);
		}

		return permissions;
	} catch (err) {
		console.log("Erro ao carregar permissions:", err);
		throw err;
	}
};

export const addPermissionToCache = (ownerId: number, viewerId: number) => {
	if (!permissions.has(ownerId)) permissions.set(ownerId, new Set());
	permissions.get(ownerId)!.add(viewerId);
};

export const removePermissionFromCache = (
	ownerId: number,
	viewerId: number
) => {
	const s = permissions.get(ownerId);
	if (!s) return;
	s.delete(viewerId);
	if (s.size === 0) permissions.delete(ownerId);
};

export const getPermissions = async (ownerId: number): Promise<unknown> => {
	try {
		const [rows] = await pool.query<RowDataPacket[]>(
			`
			SELECT * 
			FROM location_permissions 
			WHERE owner_id = ?;
			`,
			[ownerId]
		);

		return rows;
	} catch (error) {
		console.log("Error getting friends", error);
		return [];
	}
};
