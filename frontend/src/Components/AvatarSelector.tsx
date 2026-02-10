type AvatarSelectorProps = {
	value: string;
	onChange: (value: string) => void;
};

function AvatarSelector({ value, onChange }: AvatarSelectorProps) {
	const avatars = Array(46).fill("d");

	return (
		<div className="flex gap-2">
			{avatars.map((avatar, index) => (
				<button
					type="button"
					key={index + avatar}
					onClick={() => onChange(avatar)}
					className={`border-2 rounded-full ${
						value === avatar
							? "border-indigo-500"
							: "border-transparent"
					}`}>
					<img
						src={`Avatar/avatar (${index + 1}).png`}
						className="w-12 h-12 rounded-full"
					/>
				</button>
			))}
		</div>
	);
}

export default AvatarSelector;
