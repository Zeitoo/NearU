import { useState, useEffect } from "react";
import { api } from "../auth/auth";
import type { friendsResponseSql } from "../types";
import FriendsCard from "./FriendsCard";
import SearchCard from "./SearchCard";

interface friendsReq {
	message: string;
	result: {
		friends: friendsResponseSql[];
		sent: friendsResponseSql[];
		received: friendsResponseSql[];
		blocked: friendsResponseSql[];
		blocked_by: friendsResponseSql[];
	};
}

const intialFriends = {
	message: "",
	result: {
		friends: [],
		sent: [],
		received: [],
		blocked: [],
		blocked_by: [],
	},
};

interface User {
	id: number;
	phone_number: string;
	user_name: string;
	email_address: string;
	profile_img: number;
}

export default function Friends() {
	const [value, setValue] = useState<string>("");
	const [Friends, setFriends] = useState<friendsReq>(intialFriends);
	const [foundUsers, setFoundUsers] = useState<User[]>([]);

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
			console.error(
				"Erro ao remover amigo:",
				error?.response?.data || error.message
			);
		}
	};

	const fetchUsers = async () => {
		if (value.length > 0) {
			try {
				const response = await api.get(`api/user/search?name=${value}`);
				setFoundUsers(response.data.users);
			} catch {
				console.log("erro ao procurar usuarios...");
			}
		}
	};

	const fetchFriends = async () => {
		const response = await api.get("api/friends");

		const data: friendsReq = response.data;

		if (data.message === "Success") {
			setFriends(data);
		}
	};

	const blockFriend = async (friendId: number) => {
		try {
			const response = await api.post("api/friends/block", { friendId });

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
						blocked: [
							...prev.result.blocked,
							{
								other_user_id: friendId,
							} as friendsResponseSql,
						],
					},
				}));
			}
		} catch (error: any) {
			console.error(
				"Erro ao bloquear:",
				error?.response?.data || error.message
			);
		}
	};

	const addRequest = async (friendId: number) => {
		try {
			const response = await api.post("api/friends/add", { friendId });

			if (response.status === 200) {
				setFriends((prev) => ({
					...prev,
					result: {
						...prev.result,
						sent: [
							...prev.result.sent,
							{
								other_user_id: friendId,
							} as friendsResponseSql,
						],
					},
				}));
			}
		} catch (error: any) {
			console.error(
				"Erro ao enviar pedido:",
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
			console.error(
				"Erro ao aceitar:",
				error?.response?.data || error.message
			);
		}
	};

	const unblockFriend = async (friendId: number) => {
		console.log("unblock amigo");
	};

	useEffect(() => {
		fetchUsers();
	}, [value]);

	useEffect(() => {
		fetchFriends();
	}, []);

	return (
		<div className="pb-20">
			<header className="flex justify-between border-b-gray-300 border-b p-3 px-4 items-center">
				<h1 className="text-2xl text-indigo-500 font-semibold">
					Friends
				</h1>
			</header>

			<div className="my-5 w-full px-4 z-10">
				<div className="relative">
					<input
						type="text"
						name="friends"
						id="friends"
						autoComplete="off"
						value={value}
						onChange={(e) => {
							setValue(e.target.value);
						}}
						placeholder="Procure por um amigo"
						aria-label="Search for a friend by name"
						className={`border-2 transition-colors font-semibold bg-white 
					border-gray-400 text-gray-700 w-full p-2 py-5 h-5 text-[12px] pl-4 rounded-lg`}
					/>

					<div className="absolute text-gray-700 top-1/2 right-2.5 -translate-y-1/2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
							stroke="currentColor"
							className="size-5">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				</div>
			</div>

			{value.length > 0 ? (
				foundUsers.map((element, index) => {
					const props = [];
					const isBlocked = Friends.result.blocked.some(
						(friend) => friend.other_user_id == element.id
					);
					const isFriend = Friends.result.friends.some(
						(friend) => friend.other_user_id == element.id
					);
					const isSent = Friends.result.sent.some(
						(friend) => friend.other_user_id == element.id
					);
					const isRecieved = Friends.result.received.some(
						(friend) => friend.other_user_id == element.id
					);
					const isBlocking = Friends.result.blocked_by.some(
						(friend) => friend.other_user_id == element.id
					);

					if (isBlocked) {
						props.push({
							option: "Desbloquear",
							action: unblockFriend,
						});
					} else if (isFriend) {
						props.push({
							option: "Bloquear",
							action: blockFriend,
						});
						props.push({
							option: "Remover",
							action: removeFriend,
						});
					} else if (isSent) {
						props.push({
							option: "Cancelar",
							action: removeFriend,
						});

						props.push({
							option: "Bloquear",
							action: blockFriend,
						});
					} else if (isRecieved) {
						props.push({
							option: "Remover",
							action: removeFriend,
						});

						props.push({
							option: "Bloquear",
							action: blockFriend,
						});

						props.push({
							option: "Aceitar",
							action: acceptRequest,
						});
					} else if (isBlocking) {
						("");
					} else {
						props.push({
							option: "Adicionar",
							action: addRequest,
						});

						props.push({
							option: "Bloquear",
							action: blockFriend,
						});
					}

					return (
						<>
							<SearchCard
								key={`${element.user_name} + ${index}`}
								type="Amigos"
								friendType={element}
								dropDownProps={props}
							/>
						</>
					);
				})
			) : (
				<>
					<FriendsCard
						key={"amigos1"}
						type="Amigos"
						friendType={Friends.result.friends}
						dropDownProps={[
							{
								option: "Remover",
								action: removeFriend,
							},
							{
								option: "Bloquear",
								action: blockFriend,
							},
						]}
					/>

					<FriendsCard
						key={"pedidos1"}
						type="Pedidos recebidos"
						friendType={Friends.result.received}
						dropDownProps={[
							{
								option: "Remover",
								action: removeFriend,
							},
							{
								option: "Bloquear",
								action: blockFriend,
							},
							{
								option: "Aceitar",
								action: acceptRequest,
							},
						]}
					/>

					<FriendsCard
						key={"pedidos2"}
						type="Pedidos enviados"
						friendType={Friends.result.sent}
						dropDownProps={[
							{
								option: "Cancelar",
								action: removeFriend,
							},
							{
								option: "Bloquear",
								action: blockFriend,
							},
						]}
					/>

					<FriendsCard
						key={"blocked users"}
						type="Usuarios bloqueados"
						friendType={Friends.result.blocked}
						dropDownProps={[
							{
								option: "desbloquear",
								action: unblockFriend,
							},
						]}
					/>
				</>
			)}
		</div>
	);
}
