import { useEffect, useRef } from "react";
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

/* ================================
   Props
================================ */
interface MapComponentProps {
  locations: locations[] | null;
  myLocation: LocationState | null;
}

/* ================================
   Icon Cache
================================ */
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
        className: isOnline ? "avatar-marker online" : "avatar-marker",
      })
    );
  }
  return iconCache.get(key)!;
};

/* ================================
   My Location Icon
================================ */
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

/* ================================
   *** THE KEY FIX ***
   MapController lives INSIDE MapContainer
   so it can call useMap() — which is the
   only way to reactively move the map.
   MapContainer's own `center` prop is
   intentionally frozen after first render.
================================ */
interface MapControllerProps {
  myLocation: LocationState | null;
  locations: locations[] | null;
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
      // Subsequent updates: just pan softly without resetting zoom
      map.panTo([myLocation.latitude, myLocation.longitude], {
        animate: true,
        duration: 0.5,
      });
    }
  }, [myLocation, map]);

  // If no own location yet but we have friends, fit them all in view
  useEffect(() => {
    if (!myLocation && locations && locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((f) => [f.location.latitude, f.location.longitude])
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  }, [locations, myLocation, map]);

  return null; // purely behavioural, renders nothing
};

/* ================================
   Component
================================ */
const DEFAULT_CENTER: [number, number] = [-25.9655, 32.5832]; // Maputo fallback

const MapComponent: FC<MapComponentProps> = ({ locations, myLocation }) => {
  // Compute a meaningful initial center so the first render isn't always Maputo.
  // Priority: myLocation → first friend location → Maputo default
  const initialCenter: [number, number] = myLocation
    ? [myLocation.latitude, myLocation.longitude]
    : locations && locations.length > 0
    ? [locations[0].location.latitude, locations[0].location.longitude]
    : DEFAULT_CENTER;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        // Needed so the map doesn't re-mount when parent re-renders
        key="main-map"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Reactive map controller — must be inside MapContainer */}
        <MapController myLocation={myLocation} locations={locations} />

        {/* My location */}
        {myLocation && (
          <Marker
            position={[myLocation.latitude, myLocation.longitude]}
            icon={myIcon}
          >
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        {/* Friends */}
        {locations?.map((friend) => (
          <Marker
            key={friend.user.user_id}
            position={[friend.location.latitude, friend.location.longitude]}
            icon={getAvatarIcon(friend.user.profile_img, !!friend.user.online)}
          >
            <Popup>
              <div>
                <strong>{friend.user.user_name}</strong>
                <p style={{ margin: "4px 0 0" }}>
                  Precisão: {friend.location.accuracy.toFixed(0)} m
                </p>
                <p style={{ margin: "2px 0 0" }}>
                  Status: {friend.user.online ? "🟢 Online" : "⚫ Offline"}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
