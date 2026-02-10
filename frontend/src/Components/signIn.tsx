import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSign from "../hooks/useSign";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const formsChema = z.object({
	email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
	password: z
		.string()
		.nonempty("Palavra-passe é obrigatória")
		.min(8, "Muito curta")
		.max(12, "Muito longa")
		.regex(/[!@#$%&*?]/, {
			message: "Deve conter pelo menos um símbolo",
		}),
	session: z.coerce.boolean().optional(),
});

type SignInForm = z.infer<typeof formsChema>;

export default function SignIn() {
	const [loading, setLoading] = useState<boolean>(false);
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const passwordElementRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();
	const { signIn } = useSign();

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
			if (response.message === "logged in") {
				navigate("/");
			} else if (response.message === "Invalid credentials") {
				setError("email", {
					message: "Email ou palavra-passe inválidos",
				});
				setError("password", {
					message: "Email ou palavra-passe inválidos",
				});
			}
		});
	};

	const setVisible = () => {
		setPasswordVisible(!passwordVisible);
		passwordElementRef.current?.focus();
	};

	const renderButtons = () => {
		return (
			<svg
				role="button"
				tabIndex={0}
				onClick={setVisible}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setVisible();
					}
				}}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-label={
					passwordVisible
						? "Ocultar palavra-passe"
						: "Mostrar palavra-passe"
				}
				strokeWidth={1}
				stroke="currentColor"
				className="size-4 absolute top-1/2 right-2 -translate-y-1/2">
				{passwordVisible ? (
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
					/>
				) : (
					<>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
					</>
				)}
			</svg>
		);
	};

	useEffect(() => {
		document.title = "Início de sessão";
	}, []);

	return (
		<div className="p-4 sign-in relative text-sm flex justify-center flex-col items-center">
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
				<div className="w-full mb-3">
					<button className="flex justify-center cursor-pointer text-sm w-full rounded-md font-medium items-center border-2  border-gray-200 p-2 gap-2">
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

								{renderButtons()}
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
