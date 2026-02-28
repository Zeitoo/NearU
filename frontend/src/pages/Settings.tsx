import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import AvatarSelector from "../Components/AvatarSelector";
import { useUser } from "../hooks/useUser";
import { useOutletContext } from "react-router-dom";
import type { outletContextType } from "../types";

export default function Settings() {
	const [editMode, setEditMode] = useState<boolean>(false);
	const { user } = useUser();

	const { stopTracking, isSharing } = useOutletContext<outletContextType>();

	const [selectedAvatar, setselectedAvatar] = useState<number>(
		user?.profile_img || 1
	);

	const parentClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		const target = e.currentTarget as HTMLElement;
		const childs = target.querySelectorAll("input");
		Array.from(childs).forEach((element) => element.click());
	};

	useEffect(() => {
		document.title = "Configurações";
	});

	return (
		<div className="settings select-none border border-gray-400 flex flex-col text-sm md:ml-22 pb-20 md:pb-5 bg-gray-100 md:justify-center md:items-center">
			<header className="flex justify-center p-2.5 border-b border-gray-300 md:hidden">
				<h1 className="font-medium text-md text-gray-600">
					configurações
				</h1>
			</header>

			<div className="md:pl-5 md:flex md:flex-col md:justify-center md:items-center w-full md:pr-8 md:mt-12 px-8 md:pb-0 pb-10">
				<div className="hidden clamping md:block ml-12">
					<h2 className="text-xl">Perfil publico</h2>
					<p>Como voce aparece para outras pessoas</p>
				</div>
				<div
					className={`profile clamping  rounded-xl  ${
						editMode
							? ""
							: "md:bg-white md:justify-start border-gray-100 border"
					} flex justify-center  mt-5 md:ml-10`}>
					<div className="relative ">
						{editMode ? (
							<img
								className="aspect-square w-35 rounded-[100px] overflow-hidden select-none"
								src={`/Avatars/avatar (${selectedAvatar}).png`}
								alt="Imagem de perfil"
							/>
						) : (
							<div className="md:flex md:p-5 items-center md:gap-10">
								<img
									className="aspect-square w-35 rounded-[100px] overflow-hidden select-none"
									src={`/Avatars/avatar (${user?.profile_img}).png`}
									alt="Imagem de perfil"
								/>

								<div className="hidden md:block mt-5 text-center md:text-justify">
									<p className="font-semibold text-lg">
										{user?.user_name}
									</p>
									<p className="text-gray-700 mt-5 mb-2">
										{user?.email_address}
									</p>
									<p className="text-gray-400 font-medium">
										{user?.phone_number}
									</p>

									<button
										onClick={() => setEditMode(!editMode)}
										className="p-5 py-2 bg-indigo-100 font-semibold text-indigo-500 hover:bg-indigo-200 mt-5 hover:text-indigo-600 rounded-lg">
										Editar perfil
									</button>
								</div>
								<div
									onClick={(e) => {
										e.stopPropagation();
										setEditMode(true);
									}}
									className="flex md:hidden bottom-0 right-0 bg-indigo-300 absolute z-10 w-9 rounded-[100px] justify-center items-center aspect-square">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="white"
										className="size-4">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
										/>
									</svg>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="h-full w-full flex-1 md:flex md:flex-col md:justify-center md:items-center">
					{editMode ? (
						""
					) : (
						<div className="block  md:hidden">
							<div className="flex justify-center my-5">
								<button
									onClick={() => setEditMode(!editMode)}
									className="p-5 py-2 bg-indigo-100 font-semibold text-indigo-500 hover:bg-indigo-200 hover:text-indigo-600 rounded-lg">
									Editar perfil
								</button>
							</div>

							<div className="mt-5 text-center">
								<p className="font-semibold">
									{user?.user_name}
								</p>
								<p className="text-gray-700">
									{user?.email_address}
								</p>
								<p className="text-gray-400 font-medium">
									{user?.phone_number}
								</p>
							</div>
						</div>
					)}

					{editMode ? (
						<AvatarSelector
							setEditMode={setEditMode}
							selectedAvatar={selectedAvatar}
							modeSetter={setEditMode}
							avatarsetter={setselectedAvatar}
						/>
					) : (
						<div className="appear clamping w-full md:pl-5 mt-8 ">
							<h2 className="text-gray-600 font-semibold md:ml-2">
								Configurações de privacidade
							</h2>
							<div className="md:bg-white md:p-5 md:mt-2 md:rounded-lg border border-gray-100">
								<div
									onClick={parentClickHandler}
									className="flex w-full justify-between mt-2 p-3 py-4 rounded-lg bg-indigo-100 hover:bg-indigo-200 cursor-pointer">
									<div className="flex items-center justify-center text-indigo-800 p-2.5 rounded-sm bg-indigo-300">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.2}
											stroke="currentColor"
											className="size-4">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
											/>
										</svg>
									</div>

									<div className="h-full text-[12px] ml-2 w-full flex-1 flex justify-center flex-col">
										<p className="font-semibold">
											Modo Fantasma
										</p>
										<p className="text-gray-600">
											Congelar localização para todos
										</p>
									</div>

									<label className="flex items-center cursor-pointer">
										<input
											onClick={(e) => {
												e.stopPropagation();
												if (isSharing) {
													stopTracking();
												}
											}}
											readOnly
											checked={!isSharing}
											type="checkbox"
											id="ghost-mode"
											name="ghost-mode"
											className="switch"
										/>
									</label>
								</div>
							</div>

							<h2 className="text-gray-600 my-4 font-semibold md:ml-2">
								Notificações
							</h2>

							<div className="md:mt-4 md:bg-white md:p-5 md:rounded-lg border border-gray-100">
								<div className="border w-full overflow-hidden cursor-pointer border-gray-300 rounded-lg  ">
									<div
										onClick={parentClickHandler}
										className="w-full border-b-gray-400 transition-all hover:bg-gray-100 flex p-2">
										<div className="p-2">
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
													d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
												/>
											</svg>
										</div>

										<div className="flex-1 w-full items-center flex text-[12px]">
											<p>Pedidos de amizade</p>
										</div>
										<label className="flex items-center cursor-pointer">
											<input
												onClick={(e) => {
													e.stopPropagation();
												}}
												defaultChecked
												type="checkbox"
												name="amizade"
												id="amizade"
												className="switch"
											/>
										</label>
									</div>
								</div>
							</div>

							<h2 className="text-gray-600 my-4 font-semibold md:ml-2">
								Gerenciamento da conta
							</h2>

							<div className="md:bg-white md:p-6 md:rounded-lg border border-gray-100">
								<div className="border overflow-hidden w-full border-gray-300 rounded-lg ">
									<NavLink
										to="/passwordchange"
										className="w-full border-b transition-all hover:bg-gray-100 border-b-gray-400 flex p-2">
										<div className="p-2">
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
													d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
												/>
											</svg>
										</div>

										<div className="flex-1 w-full items-center flex text-[12px]">
											<p>Alterar palavra-passe</p>
										</div>
										<div className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-4">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
												/>
											</svg>
										</div>
									</NavLink>
									<NavLink
										to="assitencia"
										className="w-full transition-all hover:bg-gray-100 flex p-2">
										<div className="p-2">
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
													d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
												/>
											</svg>
										</div>

										<div className="flex-1 text-[12px] w-full flex items-center">
											<p>Centro de ajuda</p>
										</div>
										<div className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-4">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
												/>
											</svg>
										</div>
									</NavLink>
								</div>
							</div>

							<div className="border bg-red-100 mt-9 overflow-hidden w-full border-gray-300 rounded-lg ">
								<NavLink
									to="/logout"
									className="w-full border-b transition-all  hover:bg-red-200 border-b-gray-400 flex items-center justify-center gap-2 p-4">
									<div className="">
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
												d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
											/>
										</svg>
									</div>

									<p className="font-semibold">
										Terminar sessão
									</p>
								</NavLink>
								<NavLink
									to="/deleteaccount"
									className="w-full inline-block transition-all hover:bg-red-300 p-4">
									<p className="text-[12px] text-center">
										Apagar conta
									</p>
								</NavLink>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
