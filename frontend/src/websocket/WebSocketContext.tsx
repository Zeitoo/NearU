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
	setLocations: React.Dispatch<React.SetStateAction<locations[] | null>>;
	myLocation: LocationState | null;
}

export const WebSocketProvider = ({
	url,
	children,
	myLocation,
	setLocations,
}: WebSocketProviderProps) => {
	const socketRef = useRef<WebSocket | null>(null);
	const reconnectAttempts = useRef(0);
	const reconnectTimeout = useRef<number | null>(null);

	const MAX_RECONNECT_ATTEMPTS = 10;
	const BASE_DELAY = 4000;

	const [status, setStatus] = useState<WebSocketStatus>("CONNECTING");
	const [friendsCounter, setFriendsCounter] = useState<number>(0);

	const { user } = useUser();

	const connect = useCallback(() => {
		console.log("🔌 Tentando conectar WebSocket...");

		setStatus("CONNECTING");

		const socket = new WebSocket(url);
		socketRef.current = socket;

		socket.onopen = () => {
			console.log("✅ WebSocket conectado.");
			setStatus("OPEN");
			reconnectAttempts.current = 0;
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

					const exists = list.some(
						(l) => l.user.user_id === incomingUser.user_id
					);

					if (exists) {
						return list.map((l) =>
							l.user.user_id === incomingUser.user_id
								? { ...l, location }
								: l
						);
					}

					const newEntry: locations = {
						user: incomingUser,
						location,
					};

					return [...list, newEntry];
				});
			}
		};

		socket.onerror = (error) => {
			console.log("❌ WebSocket erro:", error);
			setStatus("ERROR");
		};

		socket.onclose = () => {
			console.log("🔒 WebSocket fechado.");
			setStatus("CLOSED");

			if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
				console.log("Máximo de tentativas de reconexão atingido.");
				return;
			}

			const delay = BASE_DELAY * Math.pow(2, reconnectAttempts.current);

			console.log(
				`Tentando reconectar em ${delay / 1000}s (tentativa ${
					reconnectAttempts.current + 1
				})`
			);

			reconnectTimeout.current = setTimeout(() => {
				reconnectAttempts.current += 1;
				connect();
			}, delay);
		};
	}, [url, setLocations]);

	useEffect(() => {
		connect();

		return () => {
			if (reconnectTimeout.current) {
				clearTimeout(reconnectTimeout.current);
			}
			socketRef.current?.close();
		};
	}, [connect]);

	useEffect(() => {
		if (status !== "OPEN" || !socketRef.current) return;
		setTimeout(() => {
			if (!!socketRef.current) {
				socketRef.current.send(
					JSON.stringify({
						type: "LOCATION-UPDATE",
						payload: {
							location: myLocation,
							user: user,
						},
					})
				);
			}
		}, 1000);
	}, [myLocation, status, user]);

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
