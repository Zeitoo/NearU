import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react";

import type { ReactNode } from "react";
type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSED" | "ERROR";

interface WebSocketContextType {
	sendMessage: (data: string | object) => void;
	status: WebSocketStatus;
	friendsCounter: number;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);
import type { socketMsg, locations, LocationState } from "../types";
import { useUser } from "../hooks/useUser";
interface WebSocketProviderProps {
	url: string;
	children: ReactNode;
	locations: locations[] | null;
	setLocations: React.Dispatch<React.SetStateAction<locations[] | null>>;
	myLocation: LocationState | null;
	isSharing: boolean;
}

export const WebSocketProvider = ({
	url,
	children,
	myLocation,
	setLocations,
	isSharing,
}: WebSocketProviderProps) => {
	const socketRef = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<WebSocketStatus>("CONNECTING");
	const [friendsCounter, setFriendsCounter] = useState<number>(0);
	const { user } = useUser();

	useEffect(() => {
		const socket = new WebSocket(url);
		socketRef.current = socket;

		socket.onopen = () => {
			setStatus("OPEN");
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data) as socketMsg;

			if (data.type.toLowerCase().includes("friend")) {
				setFriendsCounter((prev) => prev + 1);
			}

			if (data.type.toUpperCase() === "LOCATION-UPDATE") {
				const { location, user: incomingUser } = data.payload;

				setLocations((prevLocations) => {
					const list = prevLocations ?? [];

					// Verifica se o user já está em locations[]
					const exists = list.some(
						(l) => l.user.user_id === incomingUser.user_id
					);

					if (exists) {
						// Apenas actualiza a localização
						return list.map((l) =>
							l.user.user_id === incomingUser.user_id
								? { ...l, location }
								: l
						);
					} else {
						// Adiciona o user com os dados que vieram no payload
						const newEntry: locations = {
							user: incomingUser,
							location,
						};
						return [...list, newEntry];
					}
				});
			}
		};

		socket.onerror = () => {
			setStatus("ERROR");
		};

		socket.onclose = () => {
			setStatus("CLOSED");
		};

		return () => {
			socket.close();
		};
	}, [url]);

	useEffect(() => {
		if (status != "OPEN" || !socketRef.current) return;

		socketRef.current.send(
			JSON.stringify({
				type: "LOCATION-UPDATE",
				payload: {
					location: myLocation,
					user: user,
				},
			})
		);
	}, [myLocation, status]);

	const sendMessage = useCallback((data: string | object) => {
		if (
			!socketRef.current ||
			socketRef.current.readyState !== WebSocket.OPEN
		) {
			console.warn("WebSocket não está aberto.");
			return;
		}

		const payload = typeof data === "string" ? data : JSON.stringify(data);

		socketRef.current.send(payload);
	}, []);

	return (
		<WebSocketContext.Provider
			value={{
				sendMessage,
				status,
				friendsCounter,
			}}>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = (): WebSocketContextType => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error(
			"useWebSocket deve ser usado dentro do WebSocketProvider"
		);
	}
	return context;
};
