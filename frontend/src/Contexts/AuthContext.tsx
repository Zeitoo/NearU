import {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
	useCallback,
} from "react";
import type { ReactNode } from "react";
import { api } from "../auth/auth";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { useUser } from "../hooks/useUser";
import type { User } from "../types";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	logged: boolean;
	accessTokenRef: React.RefObject<string | null>;
	setLogged: React.Dispatch<React.SetStateAction<boolean>>;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refreshAccessToken: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { user, setUser } = useUser();
	const [loading, setLoading] = useState(true);
	const accessTokenRef = useRef<string | null>(null);
	const [logged, setLogged] = useState<boolean>(false);
	const refreshPromiseRef = useRef<Promise<any> | null>(null);
	const hasInitializedRef = useRef(false);

	const setAccessToken = useCallback((token: string | null) => {
		accessTokenRef.current = token;
	}, []);

	const logoutAndRedirect = useCallback(() => {
		setAccessToken(null);
		setUser(null);
		setLogged(false);

		if (!window.location.pathname.includes("/login")) {
			window.location.href = "/login";
		}
	}, [setAccessToken, setUser]);

	const refreshAccessToken = useCallback(async () => {
		if (refreshPromiseRef.current) {
			return refreshPromiseRef.current;
		}

		refreshPromiseRef.current = (async () => {
			try {
				const res = await api.get("/api/auth/refresh");
				const { access_token, user } = res.data;

				setAccessToken(access_token);
				setUser(user);
				setLogged(true);

				return { access_token, user };
			} catch (error) {
				console.log("Refresh falhou:", error);

				const axiosError = error as AxiosError;

				// 🚨 Só redireciona se o refresh deu 401
				if (axiosError.response?.status === 401) {
					logoutAndRedirect();
				}

				return null;
			} finally {
				refreshPromiseRef.current = null;
			}
		})();

		return refreshPromiseRef.current;
	}, [setAccessToken, setUser, logoutAndRedirect]);

	/* ========= REQUEST INTERCEPTOR ========= */
	useEffect(() => {
		const requestInterceptor = api.interceptors.request.use((config) => {
			if (accessTokenRef.current) {
				config.headers = config.headers ?? {};
				config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
			}
			return config;
		});

		return () => {
			api.interceptors.request.eject(requestInterceptor);
		};
	}, []);

	/* ========= RESPONSE INTERCEPTOR ========= */
	useEffect(() => {
		const responseInterceptor = api.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as AxiosRequestConfig & {
					_retry?: boolean;
				};

				const isRefreshRequest =
					originalRequest?.url?.includes("/api/auth/refresh");

				// 🚨 Se o próprio refresh deu 401 → já tratamos no refreshAccessToken
				if (isRefreshRequest) {
					console.log("Erro no refresh:", error);
					return Promise.resolve(null);
				}

				// 🔁 Se outra request deu 401 → tenta refresh
				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;

					const result = await refreshAccessToken();

					if (result?.access_token) {
						originalRequest.headers = originalRequest.headers ?? {};
						originalRequest.headers.Authorization = `Bearer ${result.access_token}`;
						return api(originalRequest);
					}
				}

				console.log("Erro de request:", error);
				return Promise.resolve(null);
			}
		);

		return () => {
			api.interceptors.response.eject(responseInterceptor);
		};
	}, [refreshAccessToken]);

	/* ========= AUTO REFRESH AO INICIAR ========= */
	useEffect(() => {
		if (window.location.href.includes("auth")) return;
		if (hasInitializedRef.current) return;

		hasInitializedRef.current = true;

		const initAuth = async () => {
			await refreshAccessToken();
			setLoading(false);
		};

		initAuth();
	}, [refreshAccessToken]);

	return (
		<AuthContext.Provider
			value={{
				refreshAccessToken,
				user,
				loading,
				setLoading,
				logged,
				accessTokenRef,
				setLogged,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		console.log("useAuth usado fora de AuthProvider");
		return null as any;
	}
	return context;
}
