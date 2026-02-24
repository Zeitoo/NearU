// ProtectedRoute.tsx
import { useAuth } from "../Contexts/AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="fixed protector flex justify-center items-center  top-0 left-0 h-screen w-full ">
				<div className="loadere loader-black w-20"></div>
			</div>
		);
	}

	if (!user) {
		console.log("Protected redirecionando...");
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	return <>{children}</>;
}
