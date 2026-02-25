import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Components/Footer";
import { useAuth } from "./Contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { WebSocketProvider } from "./websocket/WebSocketContext";
import { ProtectedRoute } from "./Components/Protected";
import type { friendsReq, LocationState, locations } from "./types";
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

	const [isSharing, setIsSharing] = useState<boolean>(true);

	const fetchFriends = async () => {
		const response = await api.get("api/friends");

		const data: friendsReq = response.data;

		if (data.message === "Success") {
			setFriends(data);
		}
	};

	const [locations, setLocations] = useState<locations[] | null>(null);
	const [myLocation, setMyLocation] = useState<LocationState | null>(null);

	const [error, setError] = useState<string | null>(null);
	const watchId = useRef<number | null>(null);
	const Navigate = useNavigate();
	const locationUrl = useLocation();

	error;
	const startTracking = () => {
		if (!navigator.geolocation) {
			setError("Geolocalização não suportada.");
			return;
		}

		watchId.current = navigator.geolocation.watchPosition(
			(position) => {
				setMyLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
				});

				setIsSharing(true);
			},
			(err) => {
				setError(err.message);
			},
			{
				enableHighAccuracy: true,
				maximumAge: 0,
				timeout: 10000,
			}	
		);
	};

	const stopTracking = () => {
		if (watchId.current !== null) {
			navigator.geolocation.clearWatch(watchId.current);
			watchId.current = null;
			setIsSharing(false);
			setMyLocation(null);
		}
	};

	useEffect(() => {
		if (!locationUrl.pathname.includes("auth")) {
			fetchFriends();
		}
	}, [logged]);

	if (locationUrl.pathname == "/") {
		setTimeout(() => {
			Navigate("/map");
		}, 1000);
	}

	if (logged) {
		return (
			<>
				<WebSocketProvider
					myLocation={myLocation}
					setLocations={setLocations}
					url={`${import.meta.env.VITE_WEBSOCKET_URL}?token=${
						accessTokenRef.current
					}`}>
					<div className="text-black">
						<Outlet
							context={{
								isSharing,
								Friends,
								setFriends,
								startTracking,
								stopTracking,
								myLocation,
								locations,
							}}
						/>

						<Footer />
					</div>
				</WebSocketProvider>
			</>
		);
	}

	if (locationUrl.pathname.includes("auth")) {
		return (
			<>
				<Outlet />
			</>
		);
	}

	if (
		locationUrl.pathname.includes("login") ||
		locationUrl.pathname.includes("signin") ||
		locationUrl.pathname.includes("signup")
	) {
		return (
			<div className="text-black">
				<Outlet />
			</div>
		);
	}

	return (
		<ProtectedRoute>
			<div></div>
		</ProtectedRoute>
	);
}

export default App;
