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
	lastMessage: MessageEvent | null;
	status: WebSocketStatus;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
	undefined
);

interface WebSocketProviderProps {
	url: string;
	children: ReactNode;
}

export const WebSocketProvider = ({
	url,
	children,
}: WebSocketProviderProps) => {
	const socketRef = useRef<WebSocket | null>(null);
	const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
	const [status, setStatus] = useState<WebSocketStatus>("CONNECTING");

	useEffect(() => {
		const socket = new WebSocket(url);
		socketRef.current = socket;

		socket.onopen = () => {
			setStatus("OPEN");
			setInterval(() => {
				socket.send(JSON.stringify({ message: "hi my niggaaa." }));
			}, 2000);
		};

		socket.onmessage = (event) => {
			setLastMessage(event);
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
				lastMessage,
				status,
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
