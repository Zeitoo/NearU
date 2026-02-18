export interface User {
	user_id: number;
	phone_number: string;
	user_name: string;
	email_address: string;
	profile_img: number;
	online?: boolean;
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
	isAllowed?: boolean;
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

export interface friendsReq {
	message: string;
	result: {
		friends: friendsResponseSql[];
		sent: friendsResponseSql[];
		received: friendsResponseSql[];
		blocked: friendsResponseSql[];
		blocked_by: friendsResponseSql[];
	};
}

export interface socketMsg {
	type: string;
	payload: any;
}

export interface outletContextType {
	Friends: friendsReq;
	setFriends: React.Dispatch<React.SetStateAction<friendsReq>>;
	startTracking: () => void;
	stopTracking: () => void;
	locations: locations[] | null;
	myLocation: LocationState | null;
}

export type LocationState = {
	latitude: number;
	longitude: number;
	accuracy: number;
};

export interface locations {
	user: User;
	location: LocationState;
}
