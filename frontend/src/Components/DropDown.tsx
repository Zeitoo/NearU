interface DropValue {
	option: string;
	action: (friendId: number) => void;
}

interface DropDownProps {
	values: DropValue[];
	friendId: number
}

export default function DropDown({ values, friendId }: DropDownProps) {
	return (
		<div className="drop-down h-8 relative text-[12px] aspect-square">
			{values.length > 1 ? (
				<div className="absolute options z-10 rounded-2xl overflow-hidden bg-white flex flex-col justify-start items-start font-semibold gap-0.5 p-1 border-2 border-gray-200 bottom-4 right-3">
					{values.map((element, index) => {
						return (
							<button
								key={`${element} . ${index}`}
								className={`transition-colors w-full text-start bg-white hover:bg-gray-200 cursor-pointer py-2 p-8 
                        ${index === 0 ? "rounded-t-xl" : ""} 

                        ${index === values.length - 1 ? "rounded-b-xl" : ""}
                        `}
								onClick={() => element.action(friendId)}>
								{element.option}
							</button>
						);
					})}
				</div>
			) : (
				""
			)}

			<button className="flex z-0 absolute justify-center items-center w-full h-full">
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
						d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
					/>
				</svg>
			</button>
		</div>
	);
}
