import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { TextField } from "@/components/kit/form-fields";
import { AuthHeading } from "@/features/auth/components/auth-layout";
import { type SignIn, signInSchema } from "@/features/auth/schemas/auth";
import { safeNext, signIn } from "@/lib/session";

export function SignInPage() {
	const navigate = useNavigate();
	const { next } = useSearch({ from: "/_auth" });
	const form = useForm<SignIn>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "robin@fernhill.example.com", password: "" },
	});

	async function onSubmit(values: SignIn) {
		await signIn(values);
		navigate({ href: safeNext(next), replace: true });
	}

	return (
		<>
			<AuthHeading title="Welcome back" description="Sign in to your workspace." />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
					<TextField
						control={form.control}
						name="email"
						label="Email"
						type="email"
						autoComplete="email"
					/>
					<div className="flex flex-col gap-1.5">
						<TextField
							control={form.control}
							name="password"
							label="Password"
							type="password"
							autoComplete="current-password"
							placeholder="At least 8 characters"
						/>
						<Link
							to="/forgot-password"
							className="self-end text-muted-foreground text-xs hover:text-foreground"
						>
							Forgot password?
						</Link>
					</div>
					<p className="rounded-xl bg-muted px-3 py-2 text-muted-foreground text-xs">
						Sample workspace: any password of 8+ characters works.
					</p>
					<Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? <Spinner /> : null}
						Continue
					</Button>
					<Button
						type="button"
						variant="outline"
						size="lg"
						onClick={() => toast("SSO is not part of the sample")}
					>
						<KeyRound /> Continue with SSO
					</Button>
				</form>
			</Form>
			<p className="mt-5 text-center text-muted-foreground text-sm">
				New here?{" "}
				<Link to="/sign-up" className="font-medium text-primary hover:underline">
					Create an account
				</Link>
			</p>
		</>
	);
}
