import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSign from "../hooks/useSign";

import { useNavigate } from "react-router-dom";
import { passChangeschema } from "../utils/zod";
import type { passChangeForm } from "../utils/zod";

export default function PasswordChange() {
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();
	const { changePass } = useSign();

	const form = useForm({
		resolver: zodResolver(passChangeschema),
	});

	const { register, handleSubmit, formState, setError } = form;
	const { errors } = formState;

	const onSubmit = (data: passChangeForm) => {
		setLoading(true);
		changePass(data).then((response) => {
			setLoading(false);
			console.log(response.message);
			const message = response.message as string;
			if (message.includes("Suce")) {
				navigate("/logout");
			} else if (message.includes("err")) {
				setError("actual", {
					message: "Palavra-passe incorrecta.",
				});
			} else {
			}
		});
	};

	useEffect(() => {
		document.title = "Mudança de palavra-passe";
	}, []);

	return (
		<div className="p-4 h-dvh sign w-dvw sign-in relative text-sm flex justify-center flex-col items-center">
			<div className="w-90 rounded-lg h-100 bg-white z-10 p-5 py-0 flex justify-center flex-col items-center">
				<div className="my-5 w-full">
					<h1 className="text-xl mb-3 font-semibold">
						Mudança de palavra-passe
					</h1>
					<p className="text-gray-500">
						Preencha os campos abaixo para alterar a sua
						palavra-passe.
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
								Palavra-passe actual
							</label>
							<div className="relative ">
								<input
									type="text"
									{...register("actual")}
									placeholder="Palavra-passe actual"
									id="password"
									aria-label="Palavra-passe"
									autoComplete="current-password"
									className={`password border-2 transition-colors ${
										errors.actual?.message
											? "border-red-300"
											: "border-gray-300 "
									} w-full p-2 py-5 rounded-sm h-5 text-[12px]`}
								/>
							</div>
							<p className="error">{errors.actual?.message}</p>
						</div>

						<div className="flex my-2 gap-1 flex-col">
							<label
								className="ml-1 text-[11px]"
								htmlFor="password">
								Palavra-passe nova
							</label>
							<div className="relative ">
								<input
									type="text"
									{...register("newPass")}
									placeholder="Palavra-passe nova"
									id="password"
									aria-label="Palavra-passe"
									autoComplete="new-password"
									className={`password border-2 transition-colors ${
										errors.newPass?.message
											? "border-red-300"
											: "border-gray-300 "
									} w-full p-2 py-5 rounded-sm h-5 text-[12px]`}
								/>
							</div>
							<p className="error">{errors.newPass?.message}</p>
						</div>
						<div className="w-full mt-4 flex gap-3">
							<button
								type="button"
								onClick={() => {
									if (!loading) {
										navigate("/settings");
									}
								}}
								className="w-full flex justify-center items-center cursor-pointer transition-colors hover:bg-red-400 bg-red-300 p-1 py-2 rounded-sm font-semibold text-black">
								{loading ? (
									<div>
										<div className="loader loader-white"></div>
									</div>
								) : (
									<span>Cancelar</span>
								)}
							</button>
							<button
								type="submit"
								className="w-full flex justify-center items-center cursor-pointer transition-colors hover:bg-green-400 bg-green-300 p-1 py-2 rounded-sm font-semibold text-black">
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
		</div>
	);
}
