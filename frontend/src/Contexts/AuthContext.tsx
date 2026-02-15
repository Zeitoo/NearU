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
	logout: () => Promise<void>;
	logged: boolean;
	accessTokenRef:  React.RefObject<string | null>
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { user, setUser } = useUser();
	const [loading, setLoading] = useState(true);
	const accessTokenRef = useRef<string | null>(null);
	const [logged, setLogged] = useState<boolean>(false);
	const isRefreshingRef = useRef(false);
	const refreshPromiseRef = useRef<Promise<any> | null>(null);
	const hasInitializedRef = useRef(false); // Previne double mount do Strict Mode

	const setAccessToken = useCallback((token: string | null) => {
		accessTokenRef.current = token;
	}, []);

	const logout = useCallback(async () => {
		try {
			await api.post("/api/auth/logout");
		} catch (error) {
			console.error("Erro ao fazer logout:", error);
		} finally {
			setAccessToken(null);
			setUser(null);
			refreshPromiseRef.current = null;
			isRefreshingRef.current = false;
		}
	}, [setAccessToken, setUser]);

	// Função centralizada de refresh que evita chamadas duplicadas
	const refreshAccessToken = useCallback(async () => {
		// Se já está fazendo refresh, retorna a promise existente
		if (refreshPromiseRef.current) {
			return refreshPromiseRef.current;
		}

		// Cria uma nova promise de refresh
		refreshPromiseRef.current = (async () => {
			try {
				const res = await api.get("/api/auth/refresh");
				const { access_token, user } = res.data;

				setAccessToken(access_token);
				setUser(user);

				const message = res.data.message as string;

				if (
					!window.location.pathname.includes("login") &&
					message.includes("login")
				) {
					console.log("redirecting...");
					window.location.href = "login";
				} else if (res.status === 200) {
					setLogged(true);
				}
				return { access_token, user };
			} catch (error) {
				setAccessToken(null);
				setUser(null);
				throw error;
			} finally {
				// Limpa a promise após completar
				refreshPromiseRef.current = null;
			}
		})();

		return refreshPromiseRef.current;
	}, [setAccessToken, setUser]);

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
						// Usa a função centralizada que previne múltiplos refresh
						const { access_token } = await refreshAccessToken();

						// Atualiza o header da requisição original
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${access_token}`;
						}

						return api(originalRequest);
					} catch (refreshError) {
						// Se o refresh falhar, faz logout
						await logout();
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			}
		);

		return () => {
			api.interceptors.response.eject(responseInterceptor);
		};
	}, [refreshAccessToken, logout]);

	/* ========= AUTO REFRESH AO INICIAR ========= */
	useEffect(() => {
		// Previne execução duplicada no Strict Mode
		if (hasInitializedRef.current) {
			return;
		}

		hasInitializedRef.current = true;

		const initAuth = async () => {
			try {
				await refreshAccessToken();
			} catch (error) {
				console.error("Erro ao inicializar auth:", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// Cleanup: reseta a flag se o componente desmontar
		return () => {
			// Não resetar no Strict Mode para evitar re-inicialização
			// hasInitializedRef.current = false;
		};
	}, [refreshAccessToken]);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				logout,
				logged,
				accessTokenRef
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
