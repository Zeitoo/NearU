import { Link } from "react-router-dom";

export default function PasswordReset() {
	return (
		<div className="flex flex-col justify-center items-center h-dvh gap-4">
			<p>Feature nao disponivel por enquanto</p>
			<Link
				className="text-gray-500 font-medium"
				to={"/login"}
				replace>
				Voltar
			</Link>
		</div>
	);
}
