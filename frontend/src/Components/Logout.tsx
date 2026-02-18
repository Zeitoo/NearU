import { useNavigate } from "react-router-dom";
import { api } from "../auth/auth";
import { useEffect } from "react";

export default function Logout() {
	const navigate = useNavigate();
	useEffect(() => {
		try {
			setTimeout(() => {
				api.delete("/api/auth/logout")
					.then((res) => {
						if (res.status === 200) {
							navigate("/login");
						}
					})
					.catch(() => navigate("/login"));
			}, 2000);
		} catch (error) {
			console.log(error);
		}
	}, []);

	return (
		<div className="sign p-4 flex flex-col justify-center h-screen gap-4 items-start">
			<h1 className="font-semibold text-2xl">Fim da sessão.</h1>
			<p className="">Terminando a sessão, ate breve...</p>
			<div className="loader loader-blue self-center scale-180 mt-10"></div>
		</div>
	);
}
