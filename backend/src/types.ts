import { Request } from "express";
import { RowDataPacket } from "mysql2";

interface userJwt {
	id?: number;
	userEmail?: string;
	user_name?: string;
}

export interface AuthRequest extends Request {
	user?: {
		id: number;
		user_name: string;
	};
}

export interface User {
	id: number;
	user_name: string;
	email_address: string;
	profile_img?: string;
	criado_em: string;
	password_hash?: string;
	phone_number: string;
}

export interface UserToken {
	id: number;
	user_name: string;
}

export interface refreshToken {
	id: number;
	user_id: number;
	token_hash: string;
	revoked: 0 | 1;
	created_at: string;
	expires_at: string;
}

export interface RefreshTokenWithUser extends RowDataPacket {
	refresh_id: number;
	user_id: number;
	token_hash: string;
	revoked: number;
	refresh_created_at: Date;
	expires_at: Date;
	user_name: string;
	email_address: string;
	profile_img: number;
	user_created_at: Date;
}

export interface ApiResponse<T = any> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
}
