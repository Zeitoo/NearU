type UserId = number;

class OnlineUsersStore {
    private online = new Map<UserId, string>(); // userId -> socketId

    add(userId: UserId, socketId: string) {
        this.online.set(userId, socketId);
    }

    removeBySocket(socketId: string) {
        for (const [id, sId] of this.online) {
            if (sId === socketId) {
                this.online.delete(id);
                break;
            }
        }
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
        return [...this.online.keys()];
    }
}

export const onlineUsers = new OnlineUsersStore();