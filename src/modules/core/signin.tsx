import z from "zod";
import RootLayout from "@/components/root-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/hooks/use-auth";
import { useFeatureFlag } from "@/utils/hooks/use-featureFlag";

const fromScheme = z.object({
	email: z.email(),
	password: z.string().min(3),
});

type FormData = z.infer<typeof fromScheme>;

export function Signin() {
	const navigate = useNavigate();
	const { signin } = useAuth();
	const { register, handleSubmit, formState } = useForm<FormData>();
	const { permitSignup } = useFeatureFlag();

	function handleSend(data: FormData) {
		signin(data.email, data.password);
	}

	return (
		<RootLayout>
			<div className="flex justify-center items-center h-screen">
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>Login to your account</CardTitle>
						{permitSignup && (
							<CardAction>
								<Button
									variant="link"
									className="cursor-pointer"
									onClick={() => {
										navigate("/signup");
									}}
								>
									Sign Up
								</Button>
							</CardAction>
						)}
					</CardHeader>
					<CardContent>
						<form id="form-signin" onSubmit={handleSubmit(handleSend)}>
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" placeholder="m@example.com" required {...register("email")} />
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
										<Link
											to="/forgot-password"
											className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
										>
											Forgot your password?
										</Link>
									</div>
									<Input id="password" type="password" placeholder="*******" required {...register("password")} />
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
							{formState.isLoading ? <Spinner /> : "Sign In"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</RootLayout>
	);
}
