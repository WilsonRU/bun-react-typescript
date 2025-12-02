import { type ReactNode, createContext } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextType {
	authenticated: boolean;
	user: Account;
	signin: (email: string, password: string) => void;
	signup: (email: string, password: string, name: string) => void;
	forgotPassword: (email: string) => void;
	logout: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { post } = new httpClient();
	const navigate = useNavigate();

	const { setInitialData, clearUser, hasToken, getUser } = userStore();

	const signin = async (email: string, password: string) => {
		await post("core/login", { email, password })
			.then((response) => {
				setInitialData({
					id: response.user.id,
					name: response.user.name,
					email: response.user.email,
					token: response.token,
				});
				navigate("/dashboard");
			})
			.catch(async (err) => {
				const httpErr = await err.response.json();
				toast.error(httpErr.message);
			});
	};

	const signup = async (email: string, password: string, name: string) => {
		await post("core/signup", { email, password, name })
			.then((response) => {
				toast.success(response.message);
				navigate("/");
			})
			.catch(async (err) => {
				const httpErr = await err.response.json();
				toast.error(httpErr.message);
			});
	};

	const forgotPassword = async (email: string) => {
		await post("core/forgot-password", { email })
			.then((response) => {
				toast(response.message);
				navigate("/");
			})
			.catch(async (err) => {
				const httpErr = await err.response.json();
				toast.error(httpErr.message);
			});
	};

	const logout = () => {
		clearUser();
		navigate("/");
	};

	return (
		<AuthContext.Provider
			value={{
				authenticated: hasToken,
				user: getUser as Account,
				signin,
				signup,
				forgotPassword,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
