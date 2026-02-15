export interface User {
	user_id: number;
	phone_number: string;
	user_name: string;
	email_address: string;
	profile_img: number;
}

export interface friendsResponseSql {
	id: number;
	status: string;
	requester_id: number;
	addressee_id: number;
	other_user_id: number;
	user_name: string;
	profile_img: number;
	online?: boolean;
	relation_type: RelationType;
}
export interface friendsResponse {
	friends: friendsResponseSql[];
	sent: friendsResponseSql[];
	received: friendsResponseSql[];
	blocked: friendsResponseSql[];
	blocked_by: friendsResponseSql[];
}
export type RelationType =
	| "friends"
	| "sent"
	| "received"
	| "blocked"
	| "blocked_by";
