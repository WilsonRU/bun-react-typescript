import { Link } from "react-router-dom";
import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";

export function NotFound() {
	return (
		<RootLayout>
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
				<div className="space-y-1">
					<h1 className="font-semibold text-2xl">Page not found</h1>
					<p className="text-muted-foreground text-sm">The page you are looking for does not exist.</p>
				</div>
				<Button asChild>
					<Link to="/signin">Back to sign in</Link>
				</Button>
			</div>
		</RootLayout>
	);
}
