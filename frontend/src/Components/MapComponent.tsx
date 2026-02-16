import type { FC, CSSProperties, MouseEvent } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

/* ================================
   Fix ícones padrão do Leaflet
================================ */

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* ================================
   Tipagem dos locais
================================ */

interface Location {
	id: number;
	position: LatLngExpression;
	title: string;
	description: string;
}

/* ================================
   Ícone customizado
================================ */

const customIcon = new L.Icon({
	iconUrl:
		"data:image/svg+xml;base64," +
		btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32"
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="8"
          fill="#2563eb"
          stroke="white"
          stroke-width="3"/>
      </svg>
    `),
	iconSize: [32, 32],
	iconAnchor: [16, 16],
	popupAnchor: [0, -16],
});

/* ================================
   Dados
================================ */

const locations: Location[] = [
	{
		id: 1,
		position: [-25.9655, 32.5832],
		title: "Centro de Maputo",
		description: "Coração da cidade",
	},
	{
		id: 2,
		position: [-25.9692, 32.5731],
		title: "Marginal de Maputo",
		description: "Bela vista para o mar",
	},
	{
		id: 3,
		position: [-25.9264, 32.6056],
		title: "Costa do Sol",
		description: "Praia popular",
	},
	{
		id: 4,
		position: [-25.9896, 32.5886],
		title: "Mercado Central",
		description: "Mercado tradicional",
	},
];

/* ================================
   Estilos tipados
================================ */

const containerStyle: CSSProperties = {
	width: "100%",
	height: "100%",
	position: "relative",
};

const mapStyle: CSSProperties = {
	width: "100%",
	height: "100%",
	borderRadius: "0",
	overflow: "hidden",
};

/* ================================
   Componente Principal
================================ */

const MapComponent: FC = () => {
	return (
		<div style={containerStyle}>
			<MapContainer
				center={[-25.9655, 32.5832]}
				zoom={12}
				style={mapStyle}
				zoomControl={false}>
				<TileLayer
					url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
					attribution="&copy; OpenStreetMap contributors &copy; CARTO"
				/>

				{locations.map((location) => (
					<Marker
						key={location.id}
						position={location.position}
						icon={customIcon}>
						<Popup>
							<div>
								<h3>{location.title}</h3>
								<p>{location.description}</p>
							</div>
						</Popup>
					</Marker>
				))}

				<ZoomControl />
			</MapContainer>

			<InfoBox total={locations.length} />
		</div>
	);
};

/* ================================
   Zoom Control Tipado
================================ */

const ZoomControl: FC = () => {
	const map = useMap();

	const buttonStyle: CSSProperties = {
		width: "40px",
		height: "40px",
		background: "white",
		border: "none",
		borderRadius: "8px",
		boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
		cursor: "pointer",
		fontSize: "20px",
		fontWeight: 600,
	};

	const handleHover = (e: MouseEvent<HTMLButtonElement>, hover: boolean) => {
		e.currentTarget.style.background = hover ? "#f3f4f6" : "white";
		e.currentTarget.style.transform = hover ? "scale(1.05)" : "scale(1)";
	};

	return (
		<div
			style={{
				position: "absolute",
				bottom: "30px",
				right: "20px",
				zIndex: 1000,
				display: "flex",
				flexDirection: "column",
				gap: "8px",
			}}>
			<button
				onClick={() => map.zoomIn()}
				style={buttonStyle}
				onMouseEnter={(e) => handleHover(e, true)}
				onMouseLeave={(e) => handleHover(e, false)}>
				+
			</button>

			<button
				onClick={() => map.zoomOut()}
				style={buttonStyle}
				onMouseEnter={(e) => handleHover(e, true)}
				onMouseLeave={(e) => handleHover(e, false)}>
				−
			</button>
		</div>
	);
};

/* ================================
   Info Box tipada
================================ */

interface InfoBoxProps {
	total: number;
}

const InfoBox: FC<InfoBoxProps> = ({ total }) => (
	<div
		style={{
			position: "absolute",
			top: "80px",
			left: "20px",
			background: "white",
			padding: "16px 20px",
			borderRadius: "12px",
			boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
			zIndex: 1000,
		}}>
		<p className="text-gray-800 text-sm select-none"><span className="font-semibold ">{total}</span> Amigos partilhando</p>
	</div>
);

export default MapComponent;
