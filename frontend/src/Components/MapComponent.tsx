import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { locations, LocationState } from "../types";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
	locations: locations[] | null;
	myLocation: LocationState | null;
}

type LayerKey = "default" | "satellite" | "streets";

const LAYERS: Record<
	LayerKey,
	{ label: string; url: string; attribution: string }
> = {
	default: {
		label: "Padrão",
		url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	},
	satellite: {
		label: "Satélite",
		url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
		attribution:
			"Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics",
	},
	streets: {
		label: "Ruas",
		url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
		attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
	},
};

const iconCache = new Map<string, L.Icon>();

const getAvatarIcon = (profileImg: number, isOnline: boolean): L.Icon => {
	const key = `${profileImg}-${isOnline}`;
	if (!iconCache.has(key)) {
		iconCache.set(
			key,
			new L.Icon({
				iconUrl: `/Avatars/avatar (${profileImg}).png`,
				iconSize: [45, 45],
				iconAnchor: [22, 45],
				popupAnchor: [0, -40],
				className: isOnline
					? "avatar-marker online location-online"
					: "avatar-marker",
			})
		);
	}
	return iconCache.get(key)!;
};

const myIcon = new L.DivIcon({
	html: `<div style="
    width:20px;height:20px;
    background:#22c55e;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 0 3px rgba(34,197,94,0.35);
    position: relative;
	animation: pulse 1.5s infinite;
  ">
  <p class="bg-white p-3 py-1 absolute rounded-lg -top-8 left-1/2 -translate-x-1/2">Você</p>
  </div>`,
	className: "online",
	iconSize: [30, 30],
	iconAnchor: [10, 10],
});

type LocationWithFriend = locations & { location: LocationState };

interface MapControllerProps {
	myLocation: LocationState | null;
	locations: LocationWithFriend[];
}

const MapController: FC<MapControllerProps> = ({ myLocation, locations }) => {
	const map = useMap();
	const hasFlownToUser = useRef(false);
	// Guarda os usernames que já receberam foco
	const focusedUsers = useRef(new Set<string>());
	// Guarda os usernames presentes no render anterior
	const prevUsernames = useRef(new Set<string>());

	// --- Minha localização: foco apenas na primeira vez ---
	useEffect(() => {
		if (myLocation === null) {
			hasFlownToUser.current = false; 
		}
		if (myLocation && !hasFlownToUser.current) {
			map.flyTo([myLocation.latitude, myLocation.longitude], 15, {
				duration: 1.5,
			});
			hasFlownToUser.current = true;
		}
	}, [myLocation, map]);

	useEffect(() => {
		const currentUsernames = new Set(locations.map((f) => f.user.user_name));

		// Detecta usernames que saíram do mapa → remove do set de focados
		// para que, se voltarem, recebam foco novamente
		for (const username of prevUsernames.current) {
			if (!currentUsernames.has(username)) {
				focusedUsers.current.delete(username);
			}
		}

		// Detecta novos pontos (entraram agora) → aplica foco uma única vez
		for (const friend of locations) {
			const username = friend.user.user_name;
			if (!focusedUsers.current.has(username)) {
				focusedUsers.current.add(username);
				map.flyTo(
					[friend.location.latitude, friend.location.longitude],
					15,
					{ duration: 1.5 }
				);

				break;
			}
		}

		prevUsernames.current = currentUsernames;
	}, [locations, map]);

	return null;
};

interface LayerSelectorProps {
	active: LayerKey;
	onChange: (layer: LayerKey) => void;
}

const LayerSelector: FC<LayerSelectorProps> = ({ active, onChange }) => {
	return (
		<div
			style={{
				position: "absolute",
				bottom: "24px",
				right: "16px",
				zIndex: 1000,
				display: "flex",
				flexDirection: "column",
				gap: "4px",
				background: "rgba(255,255,255,0.85)",
				backdropFilter: "blur(8px)",
				borderRadius: "12px",
				padding: "6px",
				boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
			}}>
			{(Object.keys(LAYERS) as LayerKey[]).map((key) => (
				<button
					key={key}
					onClick={() => onChange(key)}
					style={{
						padding: "5px 12px",
						borderRadius: "8px",
						border: "none",
						cursor: "pointer",
						fontSize: "12px",
						fontWeight: active === key ? 600 : 400,
						background: active === key ? "#111827" : "transparent",
						color: active === key ? "#fff" : "#6b7280",
						transition: "all 0.15s ease",
						letterSpacing: "0.02em",
					}}>
					{LAYERS[key].label}
				</button>
			))}
		</div>
	);
};

const DEFAULT_CENTER: [number, number] = [-25.9655, 32.5832];

const MapComponent: FC<MapComponentProps> = ({ locations, myLocation }) => {
	const [activeLayer, setActiveLayer] = useState<LayerKey>("default");

	const friendsWithLocation: LocationWithFriend[] =
		locations?.filter(
			(f): f is LocationWithFriend => f.location !== null
		) ?? [];

	const initialCenter: [number, number] = myLocation
		? [myLocation.latitude, myLocation.longitude]
		: friendsWithLocation.length > 0
		? [
				friendsWithLocation[0].location.latitude,
				friendsWithLocation[0].location.longitude,
		  ]
		: DEFAULT_CENTER;

	const layer = LAYERS[activeLayer];

	return (
		<div style={{ position: "relative", height: "100%", width: "100%" }}>
			<MapContainer
				center={initialCenter}
				zoom={13}
				zoomControl={false}
				style={{ height: "100%", width: "100%" }}>
				<TileLayer
					key={activeLayer}
					attribution={layer.attribution}
					url={layer.url}
				/>

				<MapController
					myLocation={myLocation}
					locations={friendsWithLocation}
				/>

				{myLocation && (
					<Marker
						position={[myLocation.latitude, myLocation.longitude]}
						icon={myIcon}>
						<Popup>Você está aqui</Popup>
					</Marker>
				)}

				{friendsWithLocation.map((friend) => (
					<Marker
						key={friend.user.user_name}
						position={[
							friend.location.latitude,
							friend.location.longitude,
						]}
						icon={getAvatarIcon(
							friend.user.profile_img,
							!!friend.user.online
						)}>
						<Popup>
							<div className="popup-card location-online">
								<strong>{friend.user.user_name}</strong>
								<br />
								Precisão: {friend.location.accuracy.toFixed(
									0
								)}{" "}
								m
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>

			{/* Custom layer selector — outside MapContainer to avoid Leaflet event conflicts */}
			<LayerSelector
				active={activeLayer}
				onChange={setActiveLayer}
			/>
		</div>
	);
};

export default MapComponent;
