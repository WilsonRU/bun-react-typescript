import z from "zod";
import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/hooks/use-auth";

const fromScheme = z.object({
	email: z.email().min(1, "Email is required"),
});

type FormData = z.infer<typeof fromScheme>;

export function ForgotPassword() {
	const navigate = useNavigate();

	const { forgotPassword } = useAuth();

	const { register, handleSubmit, formState } = useForm<FormData>();

	function handleSend(data: FormData) {
		forgotPassword(data.email);
	}

	return (
		<RootLayout>
			<div className="flex flex-col justify-center items-center h-screen">
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>Forgot your Password</CardTitle>
						<CardAction>
							<Button variant="link" className="cursor-pointer" onClick={() => navigate("/signin")}>
								Sign in
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<form id="form-signin" onSubmit={handleSubmit(handleSend)}>
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" placeholder="m@example.com" required {...register("email")} />
								</div>
							</div>
						</form>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button
							type="submit"
							className="w-full cursor-pointer"
							form="form-signin"
							disabled={formState.isSubmitting}
						>
							{formState.isLoading ? <Spinner /> : "Recover Password"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</RootLayout>
	);
}
