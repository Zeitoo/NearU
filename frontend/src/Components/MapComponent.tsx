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

/* ================================ Props ================================ */
interface MapComponentProps {
	locations: locations[] | null;
	myLocation: LocationState | null;
}

/* ================================ Layers ================================ */
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

/* ================================ Icon Cache ================================ */
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

/* ================================ My Location Icon ================================ */
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

/* ================================ Types ================================ */
type LocationWithFriend = locations & { location: LocationState };

/* ================================ MapController ================================ */
interface MapControllerProps {
	myLocation: LocationState | null;
	locations: LocationWithFriend[];
}

const MapController: FC<MapControllerProps> = ({ myLocation, locations }) => {
	const map = useMap();
	const hasFlownToUser = useRef(false);

	useEffect(() => {
		if (myLocation && !hasFlownToUser.current) {
			map.flyTo([myLocation.latitude, myLocation.longitude], 15, {
				duration: 1.5,
			});
			hasFlownToUser.current = true;
		} else if (myLocation) {
			map.panTo([myLocation.latitude, myLocation.longitude], {
				animate: true,
				duration: 0.5,
			});
		}
	}, [myLocation, map]);

	useEffect(() => {
		if (!myLocation && locations.length > 0) {
			const bounds = L.latLngBounds(
				locations.map((f) => [
					f.location.latitude,
					f.location.longitude,
				])
			);
			map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
		}
	}, [locations, myLocation, map]);

	return null;
};

/* ================================ Layer Selector ================================ */
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

/* ================================ Component ================================ */
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
