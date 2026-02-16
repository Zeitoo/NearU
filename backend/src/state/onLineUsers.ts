type UserId = number;

import type { AuthenticatedSocket } from "../types";
class OnlineUsersStore {
	private online = new Map<UserId, AuthenticatedSocket>(); // userId -> socketId

	add(userId: UserId, socketId: AuthenticatedSocket) {
		this.online.set(userId, socketId);
	}

	removeByUser(userId: UserId) {
		this.online.delete(userId);
	}

	isOnline(userId: UserId) {
		return this.online.has(userId);
	}

	getSocket(userId: UserId) {
		return this.online.get(userId);
	}

	getAll() {
		return [...this.online.entries()];
	}

}

export const onlineUsers = new OnlineUsersStore();
