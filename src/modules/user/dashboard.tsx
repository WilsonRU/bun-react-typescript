import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/utils/hooks/use-auth";

export function Dashboard() {
	const { logout, user } = useAuth();

	return (
		<RootLayout>
			<div className="flex min-h-screen items-center justify-center">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Dashboard</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="font-medium">{user?.name || "Authenticated user"}</p>
							{user?.email && <p className="text-muted-foreground text-sm">{user.email}</p>}
						</div>
						<Button type="button" variant="outline" onClick={logout}>
							Sign out
						</Button>
					</CardContent>
				</Card>
			</div>
		</RootLayout>
	);
}
