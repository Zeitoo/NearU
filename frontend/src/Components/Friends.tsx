export default function Friends() {
	const friends = [
		{
			name: "João Silva",
			avatar: "Avatars/avatar (1).png",
			status: "online",
		},
		{
			name: "Maria Santos",
			avatar: "Avatars/avatar (2).png",
			status: "offline",
		},
		{
			name: "João Silva",
			avatar: "Avatars/avatar (3).png",
			status: "online",
		},
		{
			name: "Maria Santos",
			avatar: "Avatars/avatar (22).png",
			status: "offline",
		},
		{
			name: "João Silva",
			avatar: "Avatars/avatar (14).png",
			status: "online",
		},
		{
			name: "Maria Santos",
			avatar: "Avatars/avatar (25).png",
			status: "offline",
		},
	];

	return (
		<div className="pb-20">
			<header className="flex justify-between border-b-gray-300 border-b p-3 px-4 items-center">
				<h1 className="text-2xl text-indigo-500 font-semibold">
					Friends
				</h1>

				<button className="bg-indigo-200 p-2.5 flex justify-center items-center rounded-[200px]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.8}
						stroke="rgb(11, 139, 224)"
						className="size-5">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
						/>
					</svg>
				</button>
			</header>

			<div className="my-5 px-3 relative text-blue-500">
				<input
					type="text"
					name="find"
					id="find"
					autoComplete="off"
					placeholder="Procure um amigo..."
					aria-label="Search for a friend by name"
					className={`find transition-colors border-indigo-100 border-2 bg-indigo-100 font-semibold 
					 w-full p-2 py-6 h-5 text-[12px] pl-4 rounded-lg`}
				/>

				<button className="absolute top-1/2 right-5.5 -translate-y-1/2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.6}
						stroke="currentColor"
						className="size-5">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</button>
			</div>

			<div className="px-4 mb-4 text-blue-400 text-[12px] font-semibold">
				<p>
					ONLINE •{" "}
					{
						friends.filter((element) => element.status != "offline")
							.length
					}
				</p>
			</div>

			<div className="px-4">
				{friends
					.filter((element) => element.status != "offline")
					.map((friend, index) => {
						return (
							<div
								className="h-22 bg-blue-50 hover:bg-blue-100 gap-1 transition-all my-3 flex items-center p-3 py-6 rounded-lg cursor-pointer"
								key={index}>
								<div className="flex active-avatar overflow-hidden rounded-full items-center">
									<img
										src={friend.avatar}
										className="w-14 aspect-square"
									/>
								</div>

								<div className="flex-1 w-full ml-1 font-semibold text-gray-600 items-center flex text-[12px]">
									<p>{friend.name}</p>
								</div>

								<button className="text-blue-600">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6 18 18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						);
					})}
			</div>

			<div className="px-4 mb-4 text-gray-600 text-[12px] font-semibold">
				<p>
					OFFLINE •{" "}
					{
						friends.filter((element) => element.status == "offline")
							.length
					}
				</p>
			</div>

			<div className="px-4">
				{friends
					.filter((element) => element.status == "offline")
					.map((friend, index) => {
						return (
							<div
								className="h-22 bg-gray-50 hover:bg-gray-100 gap-1 transition-all my-3 flex items-center p-3 py-6 rounded-lg cursor-pointer"
								key={index}>
								<div className="flex active-avatar overflow-hidden rounded-full items-center">
									<img
										src={friend.avatar}
										className="w-14 aspect-square"
									/>
								</div>

								<div className="flex-1 ml-1 w-full font-semibold items-center flex text-gray-700 text-[12px]">
									<p>{friend.name}</p>
								</div>

								<button className="text-gray-600">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6 18 18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						);
					})}
			</div>
		</div>
	);
}
