import { AnimatePresence } from "framer-motion";
import { lazy, type ReactNode, Suspense } from "react";
import { Navigate, Route, Routes as Routing, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { AuthProvider } from "@/utils/contexts/auth";
import { useAuth } from "@/utils/hooks/use-auth";
import { useFeatureFlag } from "@/utils/hooks/use-featureFlag";

const Dashboard = lazy(() => import("@/modules/user/dashboard").then((module) => ({ default: module.Dashboard })));
const ForgotPassword = lazy(() =>
	import("@/modules/auth/forgotPassword").then((module) => ({ default: module.ForgotPassword })),
);
const NotFound = lazy(() => import("@/modules/errors/not-found").then((module) => ({ default: module.NotFound })));
const Signin = lazy(() => import("@/modules/auth/signin").then((module) => ({ default: module.Signin })));
const Signup = lazy(() => import("@/modules/auth/signup").then((module) => ({ default: module.Signup })));

interface GuardProps {
	children: ReactNode;
}

export default function Routes() {
	const location = useLocation();
	const { permitSignup } = useFeatureFlag();

	const Guard: React.FC<GuardProps> = ({ children }) => {
		const { authenticated } = useAuth();

		if (!authenticated) {
			return <Navigate to="/signin" replace />;
		}
		return <>{children}</>;
	};

	return (
		<AuthProvider>
			<Suspense
				fallback={
					<div className="flex min-h-screen items-center justify-center">
						<Spinner />
					</div>
				}
			>
				<AnimatePresence mode="wait">
					<Routing key={location.pathname} location={location}>
						<Route path="/" element={<Navigate to="/signin" replace />} />

						<Route path="/signin" element={<Signin />} />

						{permitSignup && <Route path="/signup" element={<Signup />} />}

						<Route path="/forgot-password" element={<ForgotPassword />} />

						<Route
							path="/dashboard"
							element={
								<Guard>
									<Dashboard />
								</Guard>
							}
						/>

						<Route
							path="/protected"
							element={
								<Guard>
									<Dashboard />
								</Guard>
							}
						/>

						<Route path="*" element={<NotFound />} />
					</Routing>
				</AnimatePresence>
			</Suspense>
		</AuthProvider>
	);
}
