import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "./PhoneInput";
import useSign from "../hooks/useSign";
import { useNavigate } from "react-router-dom";
import renderButton from "./hidePassword";
import modalClass from "./modal";
import { signupSchema } from "../utils/zod";
import type { SignUpForm } from "../utils/zod";

export default function SignUp() {
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const passwordElementRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [modal, setModal] = useState<string>("");

	const navigate = useNavigate();
	const { signUp } = useSign();
	const form = useForm({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			avatar: Math.floor(Math.random() * 46),
		},
	});
	const { register, control, handleSubmit, formState, setError } = form;
	const { errors } = formState;
	const { ref: passwordRef, ...passwordRegister } = register("password");

	const onSubmit = (data: SignUpForm) => {
		setLoading(true);
		signUp(data).then((response) => {
			setLoading(false);
			if (response.message === "success") {
				setModal("success");
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			} else if (response.message.includes("email")) {
				setError("email", { message: "Email já está sendo usado." });
			} else if (response.message.includes("name")) {
				setError("name", { message: "Nome de utilizador já existe." });
			} else if (response.message.includes("phone")) {
				setError("phone", {
					message: "Numero de telefone já está sendo usado.",
				});
			} else {
				setModal("error");
				setTimeout(() => {
					location.reload();
				}, 7000);
			}
		});
	};

	const setVisible = () => {
		setPasswordVisible(!passwordVisible);
		passwordElementRef.current?.focus();
	};

	useEffect(() => {
		document.title = "Criar conta";
	}, []);

	return (
		<div className="p-3 sign-up sign h-dvh w-dvw  relative text-sm flex justify-center flex-col items-center">
			<div className="w-90 rounded-lg bg-white z-10 p-5 flex justify-center flex-col items-center">
				{modalClass.signUp(modal)}
				<div className="my-5 w-full">
					<h1 className="text-2xl mb-3 font-semibold">
						Criar uma conta
					</h1>
					<p className="text-gray-500">
						Já tem uma conta?{"  "}
						<NavLink
							className={"font-semibold text-indigo-400"}
							to={"/signin"}>
							Inicie sessão
						</NavLink>
						.
					</p>
				</div>

				<div className="w-full mb-3">
					<button className="flex justify-center cursor-pointer text-sm w-full rounded-md font-medium items-center border-2 border-gray-200 p-2 gap-2">
						<img
							className="w-5"
							src="/google_icon.svg"
							alt="Google icon"
						/>
						<p>Entrar com o Google</p>
					</button>
				</div>

				<div className="w-full flex gap-1 text-gray-400 font-semibold justify-center items-center">
					<hr className="w-full h-1" />
					ou
					<hr className="w-full" />
				</div>

				<div className="w-full">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex gap-1 my-2 flex-col">
							<label
								className="ml-1 text-[11px]"
								htmlFor="name">
								Nome Completo
							</label>
							<input
								type="text"
								id="name"
								placeholder="Nome Completo"
								aria-label="given-name"
								autoComplete="given-name"
								{...register("name")}
								className={`name border-2 transition-colors ${
									errors.name?.message
										? "border-red-300"
										: "border-gray-300 "
								} w-full p-2 py-5 rounded-sm h-5 text-[12px]`}
							/>
							<p className="error">{errors.name?.message}</p>
						</div>

						<div className="flex gap-1 mt-4 flex-col">
							<Controller
								name="phone"
								control={control}
								defaultValue=" "
								render={({ field, fieldState }) => {
									const { value, onChange, onBlur } = field;
									return (
										<PhoneInput
											value={value ?? ""}
											onChange={onChange}
											onBlur={onBlur}
											error={!!fieldState.error}
											helperText={
												fieldState.error?.message
											}
										/>
									);
								}}
							/>
						</div>

						<div className="flex gap-1 my-2 flex-col">
							<label
								className="ml-1 text-[11px]"
								htmlFor="email">
								Email
							</label>
							<input
								type="text"
								id="email"
								placeholder="Endereço de e-mail"
								aria-label="E-mail"
								autoComplete="email"
								{...register("email")}
								className={`email border-2 transition-colors ${
									errors.email?.message
										? "border-red-300"
										: "border-gray-300 "
								} w-full p-2 py-5 rounded-sm h-5 text-[12px]`}
							/>
							<p className="error">{errors.email?.message}</p>
						</div>

						<div className="flex gap-1 my-2 flex-col">
							<label
								className="ml-1 text-[11px]"
								htmlFor="password">
								Palavra-passe
							</label>
							<div className="relative ">
								<input
									type={passwordVisible ? "text" : "password"}
									{...passwordRegister}
									ref={(el) => {
										passwordRef(el);
										passwordElementRef.current = el;
									}}
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

								{renderButton({
									passwordVisible,
									setVisible,
								})}
							</div>
							<p className="error">{errors.password?.message}</p>
						</div>

						<div className="w-full mt-2">
							<button
								type="submit"
								className="w-full flex justify-center items-center cursor-pointer transition-colors hover:bg-indigo-500 bg-indigo-400 p-1 py-2 rounded-sm font-semibold text-white">
								{loading ? (
									<div>
										<div className="loader loader-white"></div>
									</div>
								) : (
									<span>Criar conta</span>
								)}
							</button>
						</div>
					</form>

					<DevTool control={control} />
				</div>
			</div>
		</div>
	);
}
