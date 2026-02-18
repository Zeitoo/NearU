type Coordinates = {
	latitude: number;
	longitude: number;
};

function toRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}

export function calculateDistance(
	pointA: Coordinates,
	pointB: Coordinates
): number {
	const R = 6371; // Raio médio da Terra em km

	const lat1 = toRadians(pointA.latitude);
	const lon1 = toRadians(pointA.longitude);
	const lat2 = toRadians(pointB.latitude);
	const lon2 = toRadians(pointB.longitude);

	const deltaLat = lat2 - lat1;
	const deltaLon = lon2 - lon1;

	const a =
		Math.sin(deltaLat / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = R * c;

	return distance; // distância em quilômetros
}
