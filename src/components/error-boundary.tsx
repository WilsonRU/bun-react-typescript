import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		hasError: false,
	};

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Application error boundary caught an error", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<main className="flex min-h-screen items-center justify-center px-4">
					<div className="w-full max-w-md space-y-2 text-center">
						<h1 className="font-semibold text-2xl">Something went wrong</h1>
						<p className="text-muted-foreground text-sm">Please refresh the page or try again in a moment.</p>
					</div>
				</main>
			);
		}

		return this.props.children;
	}
}
