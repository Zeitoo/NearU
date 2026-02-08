import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	createRoutesFromElements,
	Route,
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import "./Styles/index.css";
import "./Styles/App.css";
import SignIn from "./Components/signIn.tsx";
import App from "./App.tsx";
import SignUp from "./Components/SignUp.tsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={<App />}>
			<Route
				path="/"
				element={<div>Home</div>}></Route>
			<Route
				path="login"
				element={<SignIn />}
			/>
			<Route
				path="signin"
				element={<SignIn />}
			/>
			<Route
				path="signup"
				element={<SignUp />}
			/>
			<Route
				path="*"
				element={<div>Pagina nao encontrada</div>}
			/>
		</Route>
	)
);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router}></RouterProvider>
	</StrictMode>
);
