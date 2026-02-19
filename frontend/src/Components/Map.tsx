import { useState } from "react";

import type { outletContextType } from "../types";
import { useOutletContext } from "react-router-dom";
import MapComponent from "./MapComponent";
import LocationControl from "./LocationControl";
export default function Map() {
	const [friendsExpanded, setFriendsExpanded] = useState(false);

	const { startTracking, locations, myLocation, Friends } =
		useOutletContext<outletContextType>();

	const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

	const friendsBtnHandler = () => {
		setFriendsExpanded(!friendsExpanded);
	};

	return (
		<div className="relative h-dvh">
			<div
				className={`content flex ${
					isMobile ? "h-dvh " : "h-screen "
				}flex-col`}>
				<div className="map relative z-0 bg-indigo-500 flex-1">
					<MapComponent
						locations={locations}
						myLocation={myLocation}
					/>
				</div>

				<div
					className={`friends-selector relative z-30 bg-white ${
						friendsExpanded ? "h-60 friendExpanded" : "h-8"
					} mb-10  rounded-tl-3xl -top-2 rounded-tr-2xl transition-all`}>
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
						className={`w-full flex pointer-cursor items-center justify-center bg-transparent h-5`}>
						<div className="bg-gray-300 h-1.5 w-12 rounded-lg"></div>
					</button>

					<div className="max-h-full px-3 pb-10 pt-0 ">
						<LocationControl
							Friends={Friends}
							startTracking={startTracking}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
