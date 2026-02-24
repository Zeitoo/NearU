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
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================================ Props ================================ */
interface MapComponentProps {
  locations: locations[] | null;
  myLocation: LocationState | null;
}

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
        className: isOnline ? "avatar-marker online" : "avatar-marker",
      })
    );
  }
  return iconCache.get(key)!;
};

/* ================================ My Location Icon ================================ */
const myIcon = new L.DivIcon({
  html: `<div style="background:#4f46e5;color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)">Você</div>`,
  className: "online",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

/* ================================ Types ================================ */
// Friends that are guaranteed to have a location
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
        locations.map((f) => [f.location.latitude, f.location.longitude])
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  }, [locations, myLocation, map]);

  return null;
};

/* ================================ Component ================================ */
const DEFAULT_CENTER: [number, number] = [-25.9655, 32.5832]; // Maputo fallback

const MapComponent: FC<MapComponentProps> = ({ locations, myLocation }) => {
  // Filter out friends without a location — guarantees location is non-null downstream
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

  return (
    <MapContainer
      center={initialCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Reactive map controller */}
      <MapController myLocation={myLocation} locations={friendsWithLocation} />

      {/* My location */}
      {myLocation && (
        <Marker
          position={[myLocation.latitude, myLocation.longitude]}
          icon={myIcon}
        >
          <Popup>Você está aqui</Popup>
        </Marker>
      )}

      {/* Friends — only those with a valid location */}
      {friendsWithLocation.map((friend) => (
        <Marker
          key={friend.user.user_name}
          position={[friend.location.latitude, friend.location.longitude]}
          icon={getAvatarIcon(friend.user.profile_img, !!friend.user.online)}
        >
          <Popup>
            <div className="popup-card">
              <strong>{friend.user.user_name}</strong>
              <br />
              Precisão:{" "}
              {friend.location.accuracy.toFixed(0)} m
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
