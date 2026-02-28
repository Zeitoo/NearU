import { api } from "../auth/auth";
import type { friendsReq, LocationState, locations } from "../types";
import { calculateDistance } from "../utils/general";

const parentClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
	e.stopPropagation();
	const target = e.currentTarget as HTMLElement;
	const childs = target.querySelectorAll("input");
	Array.from(childs).forEach((element) => element.click());
};

export default function LocationControl({
	stopTracking,
	startTracking,
	Friends,
	myLocation,
	locations,
	isSharing,
	locLoading,
	setFriends,
}: {
	stopTracking: () => void;
	startTracking: () => void;
	setFriends: React.Dispatch<React.SetStateAction<friendsReq>>;
	Friends: friendsReq;
	myLocation: LocationState | null;
	locations: locations[] | null;
	isSharing: boolean;
	locLoading: boolean;
}) {
	const locationHandler = async (
		e: React.MouseEvent<HTMLInputElement, MouseEvent>,
		viewerId: number
	) => {
		e.stopPropagation();
		startTracking;

		const target = e.target as React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		>;

		try {
			const response = await api.patch("api/locations", {
				viewerId,
				isAllowed: target.checked,
			});

			if (response.status == 200) {
				setFriends((prev) => {
					let tempFriends = prev.result.friends.map((element) => {
						if (element.other_user_id == viewerId) {
							element.isAllowed = target.checked;
							return element;
						}
						return element;
					});

					return {
						message: prev.message,
						result: {
							blocked: prev.result.blocked,
							blocked_by: prev.result.blocked_by,
							sent: prev.result.sent,
							received: prev.result.received,
							friends: tempFriends,
						},
					};
				});
			}
		} catch (error) {
			console.log("Houve um erro configurando as localizacoes");
		}
	};

	return (
		<div className="location-control scroll-none md:w-80 overflow-scroll">
			<div>
				<div
					onClick={parentClickHandler}
					className="flex w-full justify-between mt-2 p-3 py-4 rounded-lg bg-green-200">
					<div className="flex items-center justify-center text-white p-2.5 rounded-sm bg-green-300">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.8}
							stroke="currentColor"
							className="size-6">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
							/>
						</svg>
					</div>

					<div className="h-full mr-3 text-[12px] ml-2 w-full flex-1 flex justify-center flex-col">
						<p className="font-semibold">Iniciar Partilha</p>
						<p className="text-gray-600">
							Partilhar com todos os selecionados
						</p>
					</div>

					<label className="flex items-center cursor-pointer">
						{locLoading ? (
							<div>
								<div className="loader loader-blue"></div>
							</div>
						) : (
							<input
								onClick={(e) => {
									e.stopPropagation();
									if (e.currentTarget.checked) {
										startTracking();
									} else {
										stopTracking();
									}
								}}
								checked={isSharing}
								type="checkbox"
								id="ghost-mode"
								name="ghost-mode"
								className="switch"
							/>
						)}
					</label>
				</div>
			</div>
			<h1 className="font-medium my-3 text-sm px-2 text-gray-600">
				Amigos selecionados
			</h1>

			{isSharing ? (
				<p className="text-[12px] font-normal px-2 text-gray-600">
					Partilhando com{" "}
					<span className="text-black">
						{
							Friends.result.friends.filter(
								(element) => element.isAllowed
							).length
						}
					</span>{" "}
					Amigos
				</p>
			) : (
				""
			)}

			{Friends.result.friends.map((element, index) => {
				const location = locations?.filter(
					(elemento) => element.other_user_id == elemento.user.user_id
				);
				let distance = null;

				if (Array.isArray(location) && !!myLocation) {
					if (location.length > 0) {
						const friendsLatiude = location[0].location?.latitude;
						const friendsLongitude =
							location[0].location?.longitude;

						if (
							typeof friendsLatiude === "number" &&
							typeof friendsLongitude === "number"
						) {
							distance = calculateDistance(
								{
									latitude: myLocation.latitude,
									longitude: myLocation.longitude,
								},
								{
									latitude: friendsLatiude,
									longitude: friendsLongitude,
								}
							).toFixed(2);
						}
					}
				}

				return (
					<div key={`${element.other_user_id} l${index}`}>
						<div
							onClick={parentClickHandler}
							className="flex items-center w-full justify-between mt-2 p-3 py-4 rounded-lg bg-gray-50 hover:bg-gray-100">
							<div className="flex items-center justify-center text-white ">
								<img
									src={`Avatars/avatar (${element.profile_img}).png`}
									className="aspect-square w-14  bg-green-300 rounded-full"
									alt="profile img"
								/>
							</div>

							<div className="h-full text-[12px] ml-2 w-full flex-1 flex justify-center flex-col">
								<p className="font-semibold">
									{element.user_name}
								</p>
								{distance ? (
									<p className="text-gray-600">
										A {distance} Km de distancia
									</p>
								) : (
									""
								)}
							</div>

							<label className="flex items-center cursor-pointer">
								<input
									defaultChecked={element.isAllowed}
									onClick={(e) =>
										locationHandler(
											e,
											element.other_user_id
										)
									}
									type="checkbox"
									id="share-location"
									name="share-location"
									className="switch"
								/>
							</label>
						</div>
					</div>
				);
			})}
		</div>
	);
}
