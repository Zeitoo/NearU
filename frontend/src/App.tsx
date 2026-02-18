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
const fakeLocations: locations[] = [
	{
		user: {
			email_address: "joao@mail.com",
			phone_number: "84133138",
			profile_img: 18,
			user_id: 7,
			online: true,
			user_name: "Joao",
		},
		location: {
			accuracy: 122836,
			latitude: -25.055716,
			longitude: 33.701074,
		},
	},
];

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

	const [locations, setLocations] = useState<locations[] | null>(
		fakeLocations
	);
	const [myLocation, setMyLocation] = useState<LocationState>({
		accuracy: 122836,
		latitude: -25.055716,
		longitude: 33.701074,
	});
	const [error, setError] = useState<string | null>(null);
	const watchId = useRef<number | null>(null);
	const Navigate = useNavigate();
	const locationUrl = useLocation();

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

	/*
	useEffect(() => {
		const interval = setInterval(() => {
			setMyLocation((prev) => ({
				latitude: prev.latitude - 0.00005,
				longitude: prev.longitude + 0.00001,
				accuracy: prev.accuracy,
			}));
		}, 6000);

		return () => clearInterval(interval);
	}, []);*/

	if (logged) {
		if (locationUrl.pathname == "/") {
			setTimeout(() => {
				Navigate("map");
			}, 1000);
		}

		return (
			<>
				<WebSocketProvider
					isSharing={isSharing}
					myLocation={myLocation}
					locations={locations}
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

	return (
		<ProtectedRoute>
			<div></div>
		</ProtectedRoute>
	);
}

export default App;
