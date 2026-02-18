import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className="sign h-dvh flex items-center flex-col gap-4 justify-center">
			<h1 className="font-semibold text-xl">Rota não encontrata.</h1>
			<Link
				className="text-gray-500 font-medium"
				to={"/map"}
				replace>
				Voltar
			</Link>
		</div>
	);
}
