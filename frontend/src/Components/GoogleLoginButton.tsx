function GoogleLoginButton () {
	const handleLogin = () => {
		// Redireciona o usuário para o backend iniciar o OAuth
		window.location.href = `${
			import.meta.env.VITE_API_URL
		}/api/auth/google`;
	};

	return (
		<button
			onClick={handleLogin}
			className="flex justify-center cursor-pointer text-sm w-full rounded-md font-medium items-center border-2  border-gray-200 p-2 gap-2">
			<img
				className="w-5"
				src="/google_icon.svg"
				alt="Google icon"
			/>
			<p>Entrar com o Google</p>
		</button>
	);
};

export default GoogleLoginButton;
