// utils/notifyUser.ts
import { onlineUsers } from "../state/onLineUsers";
import type { AuthenticatedSocket } from "../types";

export function notifyUser(userId: number, event: string, payload: any) {
  const socket: AuthenticatedSocket | undefined = onlineUsers.getSocket(userId);

  if (!socket || socket.readyState !== socket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: event,
      payload,
    })
  );
}