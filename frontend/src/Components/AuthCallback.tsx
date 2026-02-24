import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useUser } from "../hooks/useUser";
interface serverResponse {
	message: string;
	user: any;
}

function AuthCallback() {
	const [searchParams] = useSearchParams();
	const Navigate = useNavigate();
	const { setUser } = useUser();
	const { accessTokenRef, setLogged, setLoading } = useAuth();

	const getUser = async (access_token: string) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/user/`,
				{
					method: "POST",
					body: JSON.stringify({
						access_token,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const message = (await response.json()) as serverResponse;
			if (message.message.includes("succe")) {
				setUser(message.user);
				setLogged(true);
				setTimeout(() => {
					Navigate("/map");
					setTimeout(() => {
						setLoading(false);
					}, 200);
				}, 1000);
			}
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		const accessToken = searchParams.get("token");

		if (!accessToken) {
			console.error("Token não encontrado na URL");
			return;
		}
		const token = accessToken;

		accessTokenRef.current = accessToken;
		getUser(token);
	}, [searchParams]);

	return (
		<div className="sign flex h-screen items-center justify-center flex-col">
			<div className="loadere loader-black w-20"></div>
		</div>
	);
}

export default AuthCallback;
