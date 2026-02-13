import { useEffect } from "react";
import { useUser } from "../hooks/useUser";

function AvatarSelector({
	avatarsetter,
	modeSetter,
}: {
	avatarsetter: React.Dispatch<React.SetStateAction<number>>;
	modeSetter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { user } = useUser();

	useEffect(() => {
		return avatarsetter(user?.profile_img || 1);
	}, []);
	const avatars = Array(46).fill("d");

	return (
		<div className="h-full flex-1">
			<p className="font-semibold text-center mt-4">
				Escolha o seu novo avatar para o perfil
			</p>
			<div className="appear p-3 flex justify-center">
				<div className="border-2 max-h-[50vh] overflow-y-auto border-gray-300 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-4 p-4 rounded-lg place-items-center">
					{avatars.map((avatar, index) => (
						<button
							onClick={() => {
								avatarsetter((prev) => prev + 1);
							}}
							type="button"
							key={index}
							className="w-18 h-18 transition-all rounded-full border-2 border-indigo-100 hover:border-indigo-400 flex items-center justify-center">
							<img
								src={`Avatars/avatar (${index + 1}).png`}
								className="w-full h-full rounded-full object-cover"
								alt=""
							/>
						</button>
					))}
				</div>
			</div>
			<div className="flex justify-center gap-5 my-1">
				<button
					onClick={() => {
						modeSetter(false);
					}}
					className="btn bg-red-300 text-xsm  text-white font-semibold">
					Cancelar
				</button>
				<button className="btn bg-green-400 text-xsm text-white font-semibold">
					Confirmar
				</button>
			</div>
		</div>
	);
}

export default AvatarSelector;
