import { useState, useEffect } from "react";
import { api } from "../auth/auth";
import FriendsCard from "../Components/FriendsCard";
import SearchCard from "../Components/SearchCard";
import type {
	friendsReq,
	friendsResponseSql,
	outletContextType,
} from "../types";
import useFriend from "../hooks/useFriend";
import { useUser } from "../hooks/useUser";
import { useWebSocket } from "../websocket/WebSocketContext";
import { useOutletContext } from "react-router-dom";

export default function Friends() {
	const [value, setValue] = useState<string>("");
	const [foundUsers, setFoundUsers] = useState<friendsResponseSql[]>([]);
	const { friendsCounter } = useWebSocket();
	const { Friends, setFriends } = useOutletContext<outletContextType>();

	const { acceptRequest, blockFriend, removeFriend, unblockFriend } =
		useFriend(setFriends);

	const { user } = useUser();

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

	const addRequest = async (friendId: number) => {
		try {
			const response = await api.post("api/friends/add", { friendId });

			if (response.status === 200) {
				setFriends((prev) => {
					const [addedUsers] = foundUsers.filter(
						(element) => element.id == friendId
					);

					if (!addedUsers) return prev;

					return {
						...prev,
						result: {
							...prev.result,
							sent: [
								...prev.result.sent,
								{
									profile_img: addedUsers.profile_img,
									other_user_id: addedUsers?.id,
									user_name: addedUsers.user_name,
								} as friendsResponseSql,
							],
						},
					};
				});
			}
		} catch (error: any) {
			console.log(
				"Erro ao enviar pedido:",
				error?.response?.data || error.message
			);
		}
	};

	const blockFriendF = async (friendId: number) => {
		try {
			const response = await api.post("api/friends/block", { friendId });

			if (response.status === 200) {
				setFriends((prev) => {
					const blockedUser = foundUsers.filter(
						(element) => element.id == friendId
					)[0];

					if (user?.user_id) {
						blockedUser.requester_id = user?.user_id;
						blockedUser.other_user_id = friendId;
						blockedUser.status = "blocked";
						blockedUser.addressee_id = friendId;
					}

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

	useEffect(() => {
		document.title = "Amigos";
	}, []);

	useEffect(() => {
		fetchFriends();
	}, [friendsCounter]);

	useEffect(() => {
		fetchUsers();
	}, [value]);

	return (
		<div className="pb-20 friends md:pb-0 md:border border-gray-400 md:ml-22 md:bg-gray-100 lg:h-screen">
			<div className="fixed left-1/2 -translate-x-1/2 h-15 bottom-0 flex items-center justify-center w-12 z-50 md:hidden">
				<div
					onClick={() => {
						setValue("");
					}}
					className="h-10 aspect-square cursor-pointer"></div>
			</div>
			<header className="flex bg-white gap-6 border-b-gray-300 border-b p-3 px-4 items-center">
				<h1 className="text-2xl text-indigo-500 font-semibold">
					Friends
				</h1>
				<div className="relative hidden lg:block flex-1">
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
						className={`transition-colors font-semibold  
					 text-gray-700 w-full p-2 py-5 h-5 text-sm pl-4 rounded-lg bg-gray-100 flex-1 border-2 border-white`}
					/>

					<div className="absolute cursor-pointer flex items-center text-gray-700 top-1/2 right-2.5 -translate-y-1/2">
						{value.length > 0 ? (
							<button
								onClick={() => setValue("")}
								className="scale-100 hover:scale-75 transition-all">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.8}
									stroke="currentColor"
									className="size-6">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18 18 6M6 6l12 12"
									/>
								</svg>
							</button>
						) : (
							""
						)}
					</div>
				</div>
			</header>

			<div className="my-5 w-full px-4 z-10 lg:hidden">
				<div className="relative w-full flex flex-col justify-center items-center">
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
						className={`border-2 friends-card  transition-colors font-semibold bg-white 
					border-gray-400 text-gray-700 w-full p-2 py-5 h-5 text-[12px] pl-4 rounded-lg`}
					/>

					<div className="absolute cursor-pointer flex items-center text-gray-700 top-1/2 right-2.5 -translate-y-1/2">
						{value.length > 0 ? (
							<button
								onClick={() => setValue("")}
								className="scale-100 hover:scale-75 transition-all">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.8}
									stroke="currentColor"
									className="size-6">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18 18 6M6 6l12 12"
									/>
								</svg>
							</button>
						) : (
							""
						)}
					</div>
				</div>
			</div>

			{value.length > 0 ? (
				<div className="appear-2 .friends-card  lg:grid grid-cols-2 gap-2">
					{foundUsers.map((element, index) => {
						let caso = "none";
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
							caso = "bloqueado";
						} else if (isFriend) {
							props.push({
								option: "Bloquear",
								action: blockFriendF,
							});
							props.push({
								option: "Remover",
								action: removeFriend,
							});
							caso = "amigo";
						} else if (isSent) {
							props.push({
								option: "Cancelar",
								action: removeFriend,
							});

							props.push({
								option: "Bloquear",
								action: blockFriendF,
							});
							caso = "enviado";
						} else if (isRecieved) {
							props.push({
								option: "Remover",
								action: removeFriend,
							});

							props.push({
								option: "Bloquear",
								action: blockFriendF,
							});

							props.push({
								option: "Aceitar",
								action: acceptRequest,
							});

							caso = "pedido";
						} else if (isBlocking) {
							("");
						} else {
							props.push({
								option: "Adicionar",
								action: addRequest,
							});

							props.push({
								option: "Bloquear",
								action: blockFriendF,
							});
						}

						return (
							<SearchCard
								caso={caso}
								key={`${element.user_name} + ${index}`}
								type="Amigos"
								friendType={element}
								dropDownProps={props}
							/>
						);
					})}
				</div>
			) : (
				<div className="appear md:flex flex-col justify-center items-center md:mt-6 lg:grid lg:grid-cols-2 gap-10">
					<>
						<div className="friends-card">
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
						</div>

						<div className="friends-card ">
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
								key={"blockedusers2"}
								type="Usuarios bloqueados"
								friendType={Friends.result.blocked}
								dropDownProps={[
									{
										option: "Desbloquear",
										action: unblockFriend,
									},
									{
										option: "Remover",
										action: unblockFriend,
									},
								]}
							/>
						</div>
					</>
				</div>
			)}
		</div>
	);
}
