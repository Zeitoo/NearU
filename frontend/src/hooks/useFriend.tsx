import type { friendsReq, friendsResponseSql } from "../types";
import { api } from "../auth/auth";
export default function useFriend(
	setFriends: React.Dispatch<React.SetStateAction<friendsReq>>
) {
	const removeFriend = async (friendId: number) => {
		try {
			const response = await api.post("api/friends/remove", { friendId });

			if (response.status === 200) {
				setFriends((prev) => ({
					...prev,
					result: {
						...prev.result,
						friends: prev.result.friends.filter(
							(u) => u.other_user_id !== friendId
						),
						sent: prev.result.sent.filter(
							(u) => u.other_user_id !== friendId
						),
						received: prev.result.received.filter(
							(u) => u.other_user_id !== friendId
						),
						blocked_by: prev.result.blocked_by.filter(
							(u) => u.other_user_id !== friendId
						),
					},
				}));
			}
		} catch (error: any) {
			console.log(
				"Erro ao remover amigo:",
				error?.response?.data || error.message
			);
		}
	};

	const blockFriend = async (friendId: number) => {
		try {
			const response = await api.post("api/friends/block", { friendId });

			if (response.status === 200) {
				setFriends((prev) => {
					let AllUsers = [
						...prev.result.friends,
						...prev.result.sent,
						...prev.result.received,
						...prev.result.blocked,
						...prev.result.blocked_by,
					];

					const [blockedUser] = AllUsers.filter(
						(user) => user.other_user_id == friendId
					);

					return {
						...prev,
						result: {
							...prev.result,
							friends: prev.result.friends.filter(
								(u) => u.other_user_id !== friendId
							),
							sent: prev.result.sent.filter(
								(u) => u.other_user_id !== friendId
							),
							received: prev.result.received.filter(
								(u) => u.other_user_id !== friendId
							),
							blocked: [
								...prev.result.blocked,
								blockedUser as friendsResponseSql,
							],
						},
					};
				});
			}
		} catch (error: any) {
			console.log(
				"Erro ao bloquear:",
				error?.response?.data || error.message
			);
		}
	};

	const acceptRequest = async (friendId: number) => {
		try {
			const response = await api.post("api/friends/accept", { friendId });

			if (response.status === 200) {
				setFriends((prev) => {
					const acceptedUser = prev.result.received.find(
						(u) => u.other_user_id === friendId
					);

					if (!acceptedUser) return prev;

					return {
						...prev,
						result: {
							...prev.result,
							received: prev.result.received.filter(
								(u) => u.other_user_id !== friendId
							),
							friends: [...prev.result.friends, acceptedUser],
						},
					};
				});
			}
		} catch (error: any) {
			console.log(
				"Erro ao aceitar:",
				error?.response?.data || error.message
			);
		}
	};

	const unblockFriend = async (friendId: number) => {
		try {
			const response = await api.post("api/friends/unblock", {
				friendId,
			});

			if (response.status === 200) {
				setFriends((prev) => ({
					...prev,
					result: {
						...prev.result,
						blocked: prev.result.blocked.filter(
							(u) => u.other_user_id !== friendId
						),
					},
				}));
			}
		} catch (error: any) {
			console.log(
				"Erro ao desbloquear:",
				error?.response?.data || error.message
			);
		}
	};

	return {
		removeFriend,
		blockFriend,
		acceptRequest,
		unblockFriend,
	};
}
