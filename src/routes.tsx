import type { ReactNode } from "react";
import { Route, useLocation, Routes as Routing, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/utils/contexts/auth";

import { useAuth } from "@/utils/hooks/use-auth";
import { useFeatureFlag } from "@/utils/hooks/use-featureFlag";

import { Signin } from "@/modules/core/signin";
import { Signup } from "@/modules/core/signup";
import { ForgotPassword } from "@/modules/core/forgotPassword";

interface GuardProps {
	children: ReactNode;
}

export default function Routes() {
	const location = useLocation();
	const { permitSignup } = useFeatureFlag();

	const Guard: React.FC<GuardProps> = ({ children }) => {
		const { authenticated } = useAuth();

		if (!authenticated) {
			return <Navigate to={"/"} />;
		}
		return <>{children}</>;
	};

	return (
		<AuthProvider>
			<AnimatePresence mode="wait">
				<Routing key={location.pathname} location={location}>
					<Route path="/signin" element={<Signin />} />

					{permitSignup && <Route path="/signup" element={<Signup />} />}

					<Route path="/forgot-password" element={<ForgotPassword />} />

					<Route path="/protected" element={<Guard>Hello World Protected</Guard>} />

					<Route
						path="*"
						element={
							<div className="flex flex-col gap-2 items-center justify-center h-screen text-black">
								<span className="text-bold uppercase">No content found</span>
							</div>
						}
					/>
				</Routing>
			</AnimatePresence>
		</AuthProvider>
	);
}
