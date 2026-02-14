import { useState } from "react";

export default function Map() {
	const [friendsExpanded, setFriendsExpanded] = useState(false);

	const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

	const friendsBtnHandler = () => {
		setFriendsExpanded(!friendsExpanded);
	};

	return (
		<div className="relative h-dvh">
			<div className="fixed top-3 w-full px-4 z-10">
				<div className="relative">
					<input
						type="text"
						name="find"
						id="find"
						autoComplete="off"
						placeholder="Encontre um amigo..."
						aria-label="Search for a friend by name"
						className={`find border-2 transition-colors font-semibold bg-white 
					border-gray-300  w-full p-2 py-5 h-5 text-[12px] pl-4 rounded-lg`}
					/>

					<div className="absolute top-1/2 right-2.5 -translate-y-1/2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-5">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div
				className={`content flex ${
					isMobile ? "h-dvh " : "h-screen "
				}flex-col`}>
				<div className="map bg-indigo-500 flex-1"></div>

				<div
					className={`friends bg-white ${
						friendsExpanded ? "h-6" : "friends-h"
					} mb-10 -translate-y-5 rounded-tl-3xl rounded-tr-2xl transition-all`}>
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
				</div>
			</div>
		</div>
	);
}
