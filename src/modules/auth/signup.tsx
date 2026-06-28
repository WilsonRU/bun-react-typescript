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
	email: z.email("Invalid email"),
	password: z.string().min(3, "Password must be at least 3 characters"),
	name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must have at most 100 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function Signup() {
	const navigate = useNavigate();
	const { signup } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	async function handleSend(data: FormData) {
		await signup(data.email, data.password, data.name);
	}

	return (
		<RootLayout>
			<div className="flex flex-col justify-center items-center h-screen">
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>Create your account</CardTitle>
						<CardAction>
							<Button variant="link" className="cursor-pointer" onClick={() => navigate("/signin")}>
								Sign in
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<form id="form-signup" onSubmit={handleSubmit(handleSend)}>
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										type="text"
										placeholder="Happy man"
										aria-invalid={Boolean(errors.name)}
										aria-describedby={errors.name ? "name-error" : undefined}
										{...register("name")}
									/>
									{errors.name && (
										<p id="name-error" className="text-destructive text-sm">
											{errors.name.message}
										</p>
									)}
								</div>
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
								<div className="grid gap-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="****"
										aria-invalid={Boolean(errors.password)}
										aria-describedby={errors.password ? "password-error" : undefined}
										{...register("password")}
									/>
									{errors.password && (
										<p id="password-error" className="text-destructive text-sm">
											{errors.password.message}
										</p>
									)}
								</div>
							</div>
						</form>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full cursor-pointer" form="form-signup" disabled={isSubmitting}>
							{isSubmitting ? <Spinner /> : "Sign Up"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</RootLayout>
	);
}
