import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";
import { useAuth } from "./Contexts/AuthContext";
import { WebSocketProvider } from "./websocket/WebSocketContext";
import { ProtectedRoute } from "./Components/Protected";
function App() {
	const { logged, accessTokenRef } = useAuth();

	if (logged) {
		return (
			<>
				<WebSocketProvider
					url={`${import.meta.env.VITE_WEBSOCKET_URL}?token=${
						accessTokenRef.current
					}`}>
					<div className="text-black">
						<Outlet />

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
