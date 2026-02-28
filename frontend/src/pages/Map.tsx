import { useState, useEffect } from "react";

import type { outletContextType } from "../types";
import { useOutletContext } from "react-router-dom";
import MapComponent from "../Components/MapComponent";
import LocationControl from "../Components/LocationControl";
export default function Map() {
	const [friendsExpanded, setFriendsExpanded] = useState(false);

	const {
		startTracking,
		locations,
		myLocation,
		setFriends,
		Friends,
		stopTracking,
		isSharing,
		locLoading
	} = useOutletContext<outletContextType>();

	const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

	const friendsBtnHandler = () => {
		setFriendsExpanded(!friendsExpanded);
	};

	useEffect(() => {
		document.title = "Mapa";
	}, []);

	return (
		<div className="relative h-dvh">
			<div
				className={`content flex  ${
					isMobile ? "h-dvh " : "h-screen "
				}flex-col md:flex-row`}>
				<div className="map relative z-0 md:order-2 bg-indigo-500 flex-1">
					<MapComponent
						locations={locations}
						myLocation={myLocation}
					/>
				</div>

				<div
					className={`border border-gray-400 friends-selector relative z-30 md:order-1 bg-white ${
						friendsExpanded ? "h-60 friendExpanded" : "h-8"
					} mb-10  rounded-tl-3xl md:rounded-tl-0 -top-5 md:top-0 rounded-tr-2xl md:rounded-tr-0 md:left-22 transition-all md:h-full md:rounded-tl-none`}>
					<button
						onTouchStart={() => {
							if (isMobile) {
								friendsBtnHandler();
							}
						}}
						onClick={() => {
							if (!isMobile) {
								friendsBtnHandler();
							}
						}}
						className={`w-full flex pointer-cursor items-center md:hidden justify-center bg-transparent h-5`}>
						<div className="bg-gray-300 h-1.5 w-12 rounded-lg"></div>
					</button>

					<div className="max-h-full px-3 pb-10 pt-0 md:pt-5 ">
						<LocationControl
						setFriends={setFriends}
						locLoading={locLoading}
						isSharing={isSharing}
							myLocation={myLocation}
							locations={locations}
							Friends={Friends}
							startTracking={startTracking}
							stopTracking={stopTracking}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
