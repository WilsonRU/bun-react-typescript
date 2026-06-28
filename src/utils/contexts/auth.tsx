import { createContext, type ReactNode, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

import { AUTH_SESSION_EXPIRED_EVENT, HttpClient } from "@/lib/http-client";
import { userStore } from "@/utils/store/user-store";

interface AuthProviderProps {
	children: ReactNode;
}

interface Account {
	id: number;
	email: string;
	name: string;
}

interface AuthContextType {
	authenticated: boolean;
	user: Account | null;
	signin: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string, name: string) => Promise<void>;
	forgotPassword: (email: string) => Promise<void>;
	logout: () => void;
}

const accountSchema = z.object({
	id: z.number(),
	email: z.email(),
	name: z.string(),
});

const authResponseSchema = z.object({
	message: z.string().optional(),
	token: z.string().min(1),
	user: accountSchema,
});

const messageResponseSchema = z.object({
	message: z.string().optional(),
});

type AuthResponse = z.infer<typeof authResponseSchema>;
type MessageResponse = z.infer<typeof messageResponseSchema>;

export const AuthContext = createContext<AuthContextType>({
	authenticated: false,
	user: null,
	signin: async () => {},
	signup: async () => {},
	forgotPassword: async () => {},
	logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const httpClient = useMemo(() => new HttpClient(), []);
	const navigate = useNavigate();

	const { setInitialData, clear, hasToken, getUser } = userStore();

	useEffect(() => {
		const handleSessionExpired = () => {
			toast.error("Sua sessao expirou. Faca login novamente.");
			navigate("/signin", { replace: true });
		};

		window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

		return () => {
			window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
		};
	}, [navigate]);

	const handleError = async (err: unknown) => {
		try {
			if (err && typeof err === "object" && "response" in err) {
				const response = err.response as Response | undefined;
				const httpErr = (await response?.json()) as MessageResponse | undefined;
				toast.error(httpErr?.message || "Erro inesperado");
				return;
			}

			toast.error("Erro inesperado");
		} catch {
			toast.error("Falha ao conectar com o servidor");
		}
	};

	const signin = async (email: string, password: string) => {
		try {
			const response = authResponseSchema.parse(await httpClient.post<AuthResponse>("core/login", { email, password }));
			setInitialData({
				id: response.user.id,
				name: response.user.name,
				email: response.user.email,
				token: response.token,
			});
			navigate("/dashboard");
		} catch (err) {
			await handleError(err);
		}
	};

	const signup = async (email: string, password: string, name: string) => {
		try {
			const response = messageResponseSchema.parse(
				await httpClient.post<MessageResponse>("core/signup", { email, password, name }),
			);
			toast.success(response.message || "Conta criada com sucesso");
			navigate("/signin");
		} catch (err) {
			await handleError(err);
		}
	};

	const forgotPassword = async (email: string) => {
		try {
			const response = messageResponseSchema.parse(
				await httpClient.post<MessageResponse>("core/forgot-password", { email }),
			);
			toast.success(response.message || "Enviamos as instrucoes para o seu email");
			navigate("/signin");
		} catch (err) {
			await handleError(err);
		}
	};

	const logout = () => {
		navigate("/signin");
		clear();
	};

	const contextValue: AuthContextType = {
		authenticated: hasToken(),
		user: getUser(),
		signin,
		signup,
		forgotPassword,
		logout,
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
