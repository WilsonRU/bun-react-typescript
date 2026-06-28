import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/utils/hooks/use-auth";

const formSchema = z.object({
	email: z.email("Invalid email").min(1, "Email is required"),
});

type FormData = z.infer<typeof formSchema>;

export function ForgotPassword() {
	const navigate = useNavigate();

	const { forgotPassword } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	async function handleSend(data: FormData) {
		await forgotPassword(data.email);
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
						<form id="form-forgot-password" onSubmit={handleSubmit(handleSend)}>
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										aria-invalid={Boolean(errors.email)}
										aria-describedby={errors.email ? "email-error" : undefined}
										{...register("email")}
									/>
									{errors.email && (
										<p id="email-error" className="text-destructive text-sm">
											{errors.email.message}
										</p>
									)}
								</div>
							</div>
						</form>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full cursor-pointer" form="form-forgot-password" disabled={isSubmitting}>
							{isSubmitting ? <Spinner /> : "Recover Password"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</RootLayout>
	);
}
