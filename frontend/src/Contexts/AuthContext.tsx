import { createContext, useContext, useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../auth/auth";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { useUser } from "../hooks/useUser";
import type {User} from "../types"

interface AuthContextType {
	user: User | null;
	loading: boolean;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const {user, setUser} = useUser()
	const [loading, setLoading] = useState(true);

	const accessTokenRef = useRef<string | null>(null);

	const setAccessToken = (token: string | null) => {
		accessTokenRef.current = token;
	};

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

				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;

					try {
						const res = await api.get("api/auth/refresh");
						const { access_token, user } = res.data;

						setAccessToken(access_token);
						setUser(user);

						originalRequest.headers = originalRequest.headers ?? {};
						originalRequest.headers.Authorization = `Bearer ${access_token}`;

						return api(originalRequest);
					} catch(error) {
						console.log(error);
						setAccessToken(null);
					}
				}

				return Promise.reject(error);
			}
		);

		return () => {
			api.interceptors.response.eject(responseInterceptor);
		};
	}, []);

	/* ========= AUTO REFRESH AO INICIAR ========= */
	useEffect(() => {
		const initAuth = async () => {
			try {
				const res = await api.get("api/auth/refresh");

				console.log(res);
				const { accessToken, user } = res.data;

				setAccessToken(accessToken);
				setUser(user);
			} catch {
				setAccessToken(null);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, []);

	/* ========= LOGOUT ========= */
	const logout = async () => {
		try {
			await api.post("api/auth/logout");
		} finally {
			setAccessToken(null);
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth deve ser usado dentro de AuthProvider");
	}

	return context;
}
