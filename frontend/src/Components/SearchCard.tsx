import DropDown from "./DropDown";
interface User {
	id: number;
	phone_number: string;
	user_name: string;
	email_address: string;
	profile_img: number;
}

export default function SearchCard({
	type,
	friendType,
	dropDownProps,
}: {
	type: string;
	friendType: User;
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
				<div className="min-h-2 bg-blue-50 hover:bg-blue-100 gap-1 transition-all my-3 flex items-center p-3 py-6 rounded-lg cursor-pointer">
					<div className="flex active-avatar overflow-hidden rounded-full items-center">
						<img
							src={`/Avatars/avatar (${friendType.profile_img}).png`}
							className="w-14 aspect-square"
						/>
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
