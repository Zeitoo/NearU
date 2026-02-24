import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSign from "../hooks/useSign";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import renderButton from "./hidePassword";
import { formsChema } from "../utils/zod";
import type { SignInForm } from "../utils/zod";
import { useAuth } from "../Contexts/AuthContext";
import GoogleLoginButton from "./GoogleLoginButton";

export default function SignIn() {
	const [loading, setLoading] = useState<boolean>(false);
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const passwordElementRef = useRef<HTMLInputElement>(null);

	const { setUser } = useUser();
	const navigate = useNavigate();
	const { signIn } = useSign();
	const { accessTokenRef } = useAuth();
	const form = useForm({
		resolver: zodResolver(formsChema),
	});

	const { register, handleSubmit, formState, setError } = form;
	const { errors } = formState;

	const { ref: passwordRef, ...passwordRegister } = register("password");

	const onSubmit = (data: SignInForm) => {
		setLoading(true);
		signIn(data).then((response) => {
			setLoading(false);
			console.log("Resposta do sigin:  ", "  /  . ", response);
			if (response.message.includes("sucesso")) {
				setUser(response.user);
				accessTokenRef.current = response.access_token;
				setTimeout(() => {
					navigate("/map");
				}, 2000);
			} else if (response.message === "Invalid credentials") {
				setError("email", {
					message: "Email ou palavra-passe inválidos",
				});
				setError("password", {
					message: "Email ou palavra-passe inválidos",
				});
			} else {
			}
		});
	};

	const setVisible = () => {
		setPasswordVisible(!passwordVisible);
		passwordElementRef.current?.focus();
	};

	useEffect(() => {
		document.title = "Início de sessão";
	}, []);

	return (
		<div className="p-4 h-dvh w-dvw sign-in relative text-sm flex justify-center flex-col items-center">
			<div className="w-90 rounded-lg h-120 bg-white z-10 p-5 py-0 flex justify-center flex-col items-center">
				<div className="my-5 w-full">
					<h1 className="text-2xl mb-3 font-semibold">
						Iniciar sessão
					</h1>
					<p className="text-gray-500">
						Não tem uma conta?{"  "}
						<NavLink
							className={"text-indigo-400"}
							to={"/signup"}>
							Criar conta
						</NavLink>
						.
					</p>
				</div>
				<div className="w-full sign mb-3">
					<GoogleLoginButton />
				</div>
				<div className="w-full flex gap-1 text-gray-400 font-semibold justify-center items-center">
					<hr className="w-full h-1" />
					ou
					<hr className="w-full" />
				</div>
				<div className="w-full">
					<form
						onSubmit={handleSubmit(onSubmit)}
						noValidate>
						<div className="flex gap-1 my-2 flex-col">
							<label
								className="ml-1 text-[11px]"
								htmlFor="email">
								Email
							</label>
							<input
								type="text"
								{...register("email")}
								id="email"
								placeholder="Endereço de e-mail"
								aria-label="E-mail"
								autoComplete="email"
								className={`email border-2 transition-colors ${
									errors.email?.message
										? "border-red-300"
										: "border-gray-300 "
								} w-full p-2 py-5 rounded-sm h-5 text-[12px]`}
							/>

							<p className="error">{errors.email?.message}</p>
						</div>
						<div className="flex my-2 gap-1 flex-col">
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

						<div className="flex mt-3 justify-between items-center">
							<div className="flex pl-1 gap-1 items-center">
								<input
									type="checkbox"
									id="session"
									aria-label="Lembrar sessão"
									{...register("session")}
									className="session bg-white border-2 border-gray-500"
								/>
								<label
									className="text-[12px] text-gray-500"
									htmlFor="session">
									Lembrar-me
								</label>
							</div>

							<NavLink
								className="text-[12px] text-indigo-400 font-semibold"
								to={"reset_password"}>
								Esqueceu a palavra-passe ?
							</NavLink>
						</div>

						<div className="w-full mt-4">
							<button
								type="submit"
								className="w-full flex justify-center items-center cursor-pointer transition-colors hover:bg-indigo-500 bg-indigo-400 p-1 py-2 rounded-sm font-semibold text-white">
								{loading ? (
									<div>
										<div className="loader loader-white"></div>
									</div>
								) : (
									<span>Iniciar sessão</span>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
