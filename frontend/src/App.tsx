import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";
import { useAuth } from "./Contexts/AuthContext";
import { useEffect, useState } from "react";
import { WebSocketProvider } from "./websocket/WebSocketContext";
import { ProtectedRoute } from "./Components/Protected";
import type { friendsReq } from "./types";
import { api } from "./auth/auth";

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

function App() {
	const { logged, accessTokenRef } = useAuth();
	const [Friends, setFriends] = useState<friendsReq>(intialFriends);

	const fetchFriends = async () => {
		const response = await api.get("api/friends");

		const data: friendsReq = response.data;

		if (data.message === "Success") {
			setFriends(data);
		}
	};
	useEffect(() => {
		fetchFriends();
	}, [logged]);

	if (logged) {
		return (
			<>
				<WebSocketProvider
					url={`${import.meta.env.VITE_WEBSOCKET_URL}?token=${
						accessTokenRef.current
					}`}>
					<div className="text-black">
						<Outlet context={{ Friends, setFriends }} />

						<Footer />
					</div>
				</WebSocketProvider>
			</>
		);
	}

	return (
		<ProtectedRoute>
			<div></div>
		</ProtectedRoute>
	);
}

export default App;
