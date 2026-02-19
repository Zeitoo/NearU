import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSign from "../hooks/useSign";

import { useNavigate } from "react-router-dom";
import { deleteAccountchema } from "../utils/zod";
import type { deleteAccountForm } from "../utils/zod";

export default function DeleteAccount() {
	const [loading, setLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);

	const navigate = useNavigate();
	const { deleteAccount } = useSign();

	const form = useForm({
		resolver: zodResolver(deleteAccountchema),
	});

	const { register, handleSubmit, formState, setError } = form;
	const { errors } = formState;

	const onSubmit = (data: deleteAccountForm) => {
		setLoading(true);
		deleteAccount(data).then((response) => {
			setLoading(false);
			const message = response.message as string;
			if (message.includes("esso")) {
				setSuccess(true);
				setTimeout(() => {
					navigate("/logout");
				}, 4000);
			} else if (message.includes("err")) {
				setError("password", {
					message: "Palavra-passe incorrecta.",
				});
			}
		});
	};

	useEffect(() => {
		document.title = "Eliminação da conta";
	}, []);

	return (
		<div className="p-4 h-dvh sign w-dvw sign-in relative text-sm flex justify-center flex-col items-center">
			{success ? (
				<div className="bg-white border-2 border-gray-300 flex flex-col items-center w-80 p-5 rounded-lg font-semibold">
					<div
						className={`inline-flex border rounded-full
								bg-green-400 text-white justify-center mb-3`}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-9">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
							/>
						</svg>
					</div>

					<p className="text-gray-700 text-justify">
						A sua conta foi apagada com sucesso. Voce sera
						redireccionado para a pagina de login brevemente.{" "}
					</p>
				</div>
			) : (
				<>
					<div className="w-90 rounded-lg h-80 bg-white z-10 p-5 py-0 flex justify-center flex-col items-center">
						<div className="my-5 w-full">
							<h1 className="text-xl mb-3 font-semibold">
								Eliminar conta
							</h1>
							<p className="text-gray-500 text-justify">
								Insira a sua palavra-passe para prosegguir com a
								eliminação da conta.
							</p>
						</div>

						<div className="w-full">
							<form
								onSubmit={handleSubmit(onSubmit)}
								noValidate>
								<div className="flex my-2 gap-1 flex-col">
									<label
										className="ml-1 text-[11px]"
										htmlFor="password">
										Palavra-passe
									</label>
									<div className="relative ">
										<input
											type="text"
											{...register("password")}
											placeholder="Palavra-passe"
											id="password"
											aria-label="Palavra-passe"
											autoComplete="current-password"
											className={`password border-2 transition-colors ${
												errors.password?.message
													? "border-red-300"
													: "border-gray-300 "
											} w-full p-2 py-5 rounded-sm h-5 text-[12px]`}
										/>
									</div>
									<p className="error">
										{errors.password?.message}
									</p>
								</div>

								<div className="w-full mt-4 flex gap-3">
									<button
										type="button"
										onClick={() => {
											if (!loading) {
												navigate("/settings");
											}
										}}
										className="w-full flex justify-center items-center cursor-pointer transition-colors hover:bg-green-400 bg-green-300 p-1 py-2 rounded-sm font-semibold text-black">
										{loading ? (
											<div>
												<div className="loader loader-white"></div>
											</div>
										) : (
											<span>Cancelar</span>
										)}
									</button>
									<button
										className="w-full flex justify-center items-center cursor-pointer transition-colors hover:bg-red-400 bg-red-300 p-1 py-2 rounded-sm font-semibold text-black"
										type="submit">
										{loading ? (
											<div>
												<div className="loader loader-white"></div>
											</div>
										) : (
											<span>Prosseguir</span>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
