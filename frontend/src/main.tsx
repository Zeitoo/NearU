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
import Map from "./Components/Map.tsx";
import Friends from "./Components/Friends.tsx";
import Settings from "./Components/Settings.tsx";
import { AuthProvider } from "./Contexts/AuthContext.tsx";
import UserProvider from "./Contexts/UserContext.tsx";
import Logout from "./Components/Logout.tsx";
import { ProtectedRoute } from "./Components/Protected.tsx";
import PasswordReset from "./Components/PasswordReset.tsx";
import PasswordChange from "./Components/PasswordChange.tsx";
import NotFound from "./Components/NotFound.tsx";
import DeleteAccount from "./Components/DeleteAccount.tsx";
import AuthCallback from "./Components/AuthCallback.tsx";
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={<App />}>
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
				path="map"
				element={
					<ProtectedRoute>
						<Map />
					</ProtectedRoute>
				}
			/>
			<Route
				path="friends"
				element={
					<ProtectedRoute>
						<Friends />
					</ProtectedRoute>
				}
			/>
			<Route
				path="settings"
				element={
					<ProtectedRoute>
						<Settings />
					</ProtectedRoute>
				}
			/>
			<Route
				path="logout"
				element={<Logout />}
			/>
			<Route
				path="signout"
				element={<Logout />}
			/>
			<Route
				path="passwordchange"
				element={<PasswordChange />}
			/>
			<Route
				path="passwordreset"
				element={<PasswordReset />}
			/>
			<Route
				path="deleteaccount"
				element={<DeleteAccount />}
			/>

			<Route
				path="auth/callback"
				element={<AuthCallback />}
			/>

			<Route
				path="*"
				element={<NotFound />}
			/>
		</Route>
	)
);

createRoot(document.getElementById("root")!).render(
	<UserProvider>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</UserProvider>
);
