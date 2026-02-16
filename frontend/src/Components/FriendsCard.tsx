import type { friendsResponseSql } from "../types";
import DropDown from "./DropDown";

export default function FriendsCard({
	type,
	friendType,
	dropDownProps,
}: {
	type: string;
	friendType: friendsResponseSql[];
	dropDownProps: {
		option: string;
		action:
			| ((friendId: number) => void)
			| ((friendId: number) => Promise<void>);
	}[];
}) {
	return (
		<>
			<div className="px-4 mb-4 text-blue-400 text-[12px] font-semibold">
				<p>
					{type} • {friendType.length}
				</p>
			</div>

			<div className="px-4">
				{friendType.map((friend, index) => {
					return (
						<div
							className={`min-h-2 ${
								friend.online
									? "bg-green-200 hover:bg-green-300"
									: "bg-blue-50 hover:bg-blue-100"
							}  gap-1 transition-all my-3 flex items-center p-3 py-6 rounded-lg cursor-pointer`}
							key={index}>
							<div className="flex active-avatar overflow-hidden rounded-full items-center">
								<img
									src={`/Avatars/avatar (${friend.profile_img}).png`}
									className="w-14 aspect-square"
								/>
							</div>

							<div className="flex-1 w-full ml-1 font-semibold text-gray-600 justify-center flex items-start flex-col text-[12px]">
								<p>{friend.user_name}</p>
								{friend.online ? (
									<p className="text-green-700 ml-1.5 font-semibold">
										Online
									</p>
								) : (
									""
								)}
							</div>

							<DropDown
								friendId={friend.other_user_id}
								values={dropDownProps}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
}
