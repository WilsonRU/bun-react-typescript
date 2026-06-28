import "@/global.css";

import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import Routes from "@/routes";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 30,
		},
	},
});

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<ErrorBoundary>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<Toaster />
						<Routes />
					</BrowserRouter>
				</QueryClientProvider>
			</ThemeProvider>
		</ErrorBoundary>
	</StrictMode>,
);
