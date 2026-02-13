export default class modal {
	static signUp(caso: string) {
		switch (caso) {
			case "":
				return <></>;
				break;
			default:
				return caso ? (
					<div className="modal appear-1 flex justify-center items-center fixed top-0 left-0 h-screen w-full z-100">
						<div className="bg-white border-2 border-gray-300 flex flex-col items-center w-80 p-5 rounded-lg font-semibold">
							<div
								className={`inline-flex border rounded-full ${
									caso === "success"
										? "bg-green-400 "
										: "bg-red-400"
								} text-white justify-center mb-3`}>
								{caso === "success" ? (
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
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-8 m-2">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
										/>
									</svg>
								)}
							</div>
							{caso === "success" ? (
								<p className="text-gray-700">
									A sua conta foi criada com sucesso. Voce
									sera redireccionado para a pagina de login
									brevemente.{" "}
								</p>
							) : (
								<p className="text-gray-700 text-justify">
									Houve um problema de conexao ao tentar criar
									a sua conta. Por favor, verifique a sua
									conexao a internet e tente novamente mais
									tarde.
								</p>
							)}
						</div>
					</div>
				) : (
					""
				);
		}
	}

	static signIn(caso: "error" | "") {
		switch (caso) {
			case "":
				return <></>;
			default:
				return caso ? (
					<div className="modal appear-1 flex justify-center items-center fixed top-0 left-0 h-screen w-full z-100">
						<div className="bg-white border-2 border-gray-300 flex flex-col items-center w-80 p-5 rounded-lg font-semibold">
							<div
								className={`inline-flex border rounded-full "bg-red-400" text-white justify-center mb-3`}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-8 m-2">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
									/>
								</svg>
							</div>

							<p className="text-gray-700 text-justify">
								Houve um problema de conexao ao tentar criar a
								sua conta. Por favor, verifique a sua conexao a
								internet e tente novamente mais tarde.
							</p>
						</div>
					</div>
				) : (
					""
				);
		}
	}
}
