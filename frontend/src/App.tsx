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
	const [myLocation, setMyLocation] = useState<LocationState>({
		accuracy: 122836,
		latitude: -25.055716,
		longitude: 33.701074,
	});

	const [error, setError] = useState<string | null>(null);
	const watchId = useRef<number | null>(null);
	const Navigate = useNavigate();
	const locationUrl = useLocation();

	console.log(locations);
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
		}
	};

	useEffect(() => {
		fetchFriends();
	}, [logged]);

	useEffect(() => {
		const interval = setInterval(() => {
			const latitude = Number((Math.random() * 0.001).toFixed(5));
			const longitude = Number((Math.random() * 0.001).toFixed(5));
			setMyLocation((prev) => ({
				latitude: prev.latitude - latitude,
				longitude: prev.longitude + longitude,
				accuracy: prev.accuracy,
			}));
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	if (locationUrl.pathname == "/") {
		setTimeout(() => {
			Navigate("/map");
		}, 1000);
	}

	if (logged) {
		return (
			<>
				<WebSocketProvider
					isSharing={isSharing}
					myLocation={myLocation}
					setLocations={setLocations}
					url={`${import.meta.env.VITE_WEBSOCKET_URL}?token=${
						accessTokenRef.current
					}`}>
					<div className="text-black">
						<Outlet
							context={{
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
