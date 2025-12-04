import { type ReactNode, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { userStore } from "@/utils/store/user-store";
import { httpClient } from "@/lib/http-client";

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

export const AuthContext = createContext<AuthContextType>({
	authenticated: false,
	user: null,
	signin: async () => {},
	signup: async () => {},
	forgotPassword: async () => {},
	logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { post } = new httpClient();
	const navigate = useNavigate();

	const { setInitialData, clear, hasToken, getUser } = userStore();

	const handleError = async (err: any) => {
		try {
			const httpErr = await err.response?.json();
			toast.error(httpErr.message || "Erro inesperado");
		} catch {
			toast.error("Falha ao conectar com o servidor");
		}
	};

	const signin = async (email: string, password: string) => {
		try {
			const response = await post("core/login", { email, password });
			setInitialData({
				id: response.user.id,
				name: response.user.name,
				email: response.user.email,
				token: response.token,
			});
			navigate("/dashboard");
		} catch (err) {
			handleError(err);
		}
	};

	const signup = async (email: string, password: string, name: string) => {
		try {
			const response = await post("core/signup", { email, password, name });
			toast.success(response.message);
			navigate("/");
		} catch (err) {
			handleError(err);
		}
	};

	const forgotPassword = async (email: string) => {
		try {
			const response = await post("core/forgot-password", { email });
			toast.success(response.message);
			navigate("/");
		} catch (err) {
			handleError(err);
		}
	};

	const logout = () => {
		navigate("/");
		clear();
	};

	const contextValue: AuthContextType = {
		authenticated: Boolean(hasToken),
		user: getUser && Object.keys(getUser).length > 0 ? (getUser as Account) : null,
		signin,
		signup,
		forgotPassword,
		logout,
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
