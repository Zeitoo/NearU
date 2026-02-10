import React, { useEffect, useState, useRef, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MuiTelInput } from "mui-tel-input";
import useSign from "../hooks/useSign";
import { useNavigate } from "react-router-dom";

const signupSchema = z.object({
	name: z
		.string()
		.nonempty("Nome é obrigatório")
		.min(3, "Mínimo de 3 caracteres")
		.max(50, "Máximo de 50 caracteres")
		.regex(/^[A-Za-zÀ-ÿ\s'-]+$/, "Nome inválido"),
	phone: z
		.string()
		.nonempty("Obrigatório")
		.refine((v) => /^\+[1-9]\d{1,14}$/.test(v.replaceAll(" ", "")), {
			message: "Número inválido",
		}),

	email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
	password: z
		.string()
		.nonempty("Palavra-passe é obrigatória")
		.min(8, "Muito curta")
		.max(12, "Muito longa")
		.regex(/[!@#$%&*?]/, {
			message: "Deve conter pelo menos um símbolo",
		}),
	avatar: z.number(),
});

type SignUpForm = z.infer<typeof signupSchema>;

export default function SignUp() {
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const passwordElementRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState<boolean>(false);

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
			if (response.message === "registered") {
				navigate("/login");
			} else if (response.message === "already exists") {
				setError("email", { message: "Email já existe" });
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
				tabIndex={0}
				onClick={() => setVisible()}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setVisible();
					}
				}}
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
		document.title = "Criar conta";
	}, []);

	const PhoneInput = useMemo(() => {
		return React.memo(function PhoneInput({
			value,
			onChange,
			onBlur,
			error,
			helperText,
		}: {
			value: string;
			onChange: (v: string) => void;
			onBlur: () => void;
			error: boolean;
			helperText?: string;
		}) {
			const [localValue, setLocalValue] = useState<string>(value ?? "");
			const timerRef = useRef<number | null>(null);

			useEffect(() => {
				if ((value ?? "") !== localValue) {
					setLocalValue(value ?? "");
				}
			}, [value]);

			useEffect(() => {
				return () => {
					if (timerRef.current) {
						clearTimeout(timerRef.current);
					}
				};
			}, []);

			const handleLocalChange = (v: string) => {
				setLocalValue(v);

				if (timerRef.current) {
					clearTimeout(timerRef.current);
				}
				timerRef.current = window.setTimeout(() => {
					onChange(v);
					timerRef.current = null;
				}, 300);
			};

			const handleBlur = () => {
				if (timerRef.current) {
					clearTimeout(timerRef.current);
					timerRef.current = null;
				}
				onChange(localValue);
				onBlur();
			};

			const slotProps = useMemo(
				() => ({
					input: {
						autoComplete: "tel",
						"aria-label": "Telefone",
						inputProps: {
							maxLength: 25,
							minLength: 2,
						},
					},
				}),
				[]
			);

			const sx = useMemo(
				() => ({
					"& .MuiOutlinedInput-root": {
						minHeight: "20px",
						paddingTop: "0px",
						paddingLeft: "8px",
						paddingBottom: "0px",
					},
					"& .MuiTelInput-Flag": {
						fontSize: "16px",
					},
					"& .MuiInputBase-input": {
						padding: "12px",
						fontSize: "13px",
					},
					"& .MuiFormHelperText-root": {
						margin: "8px 1px 0px 2px",
						fontSize: "11px",
						opacity: 0.7,
					},
				}),
				[]
			);

			return (
				<MuiTelInput
					value={localValue}
					onChange={handleLocalChange}
					onBlur={handleBlur}
					defaultCountry="MZ"
					label="Telefone"
					slotProps={slotProps}
					error={error}
					helperText={helperText}
					sx={sx}
				/>
			);
		});
	}, []);

	return (
		<div className="p-3 sign-up relative text-sm flex justify-center flex-col items-center">
			<div className="w-90 rounded-lg bg-white z-10 p-5 flex justify-center flex-col items-center">
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

								{renderButtons()}
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
