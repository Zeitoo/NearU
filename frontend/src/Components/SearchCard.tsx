import DropDown from "./DropDown";
import type { friendsResponseSql } from "../types";

export default function SearchCard({
	friendType,
	dropDownProps,
	caso,
}: {
	caso: string;
	type: string;
	friendType: friendsResponseSql;
	dropDownProps: {
		option: string;
		action:
			| ((friendId: number) => void)
			| ((friendId: number) => Promise<void>);
	}[];
}) {
	return (
		<>
			<div className="px-4">
				<div
					className={`min-h-2 gap-1 transition-all my-3 flex items-center p-3 py-6 rounded-lg cursor-pointer ${
						caso == "amigo" ? "bg-blue-50 hover:bg-blue-100 border border-gray-300" : ""
					}
					${
						caso == "bloqueado" ? "bg-red-100" : ""
					}
					${
						(caso == "enviado" || caso == "pedido") ? "bg-green-50 " : ""
					}
					${
						caso == "none" ? "lg:bg-white  bg-blue-50 hover:bg-blue-100" : ""
					}
					`}>
					<div className="flex active-avatar relative  rounded-full items-center">
						<img
							src={`/Avatars/avatar (${friendType.profile_img}).png`}
							className="w-14 aspect-square rounded-full "
						/>

						{friendType.online ? (
							<div className="w-3  absolute right-0.5 bottom-0.5 aspect-square bg-green-500 rounded-full"></div>
						) : (
							""
						)}
					</div>

					<div className="flex-1 w-full ml-1 font-semibold text-gray-600 items-center flex text-[12px]">
						<p>{friendType.user_name}</p>
					</div>

					<DropDown
						friendId={friendType.id}
						values={dropDownProps}
					/>
				</div>
			</div>
		</>
	);
}
