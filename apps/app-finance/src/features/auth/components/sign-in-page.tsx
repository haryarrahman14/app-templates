import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useSignIn } from "@/features/auth/api/mutations";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { PasswordInput } from "@/features/auth/components/password-input";
import { type SignInInput, signInSchema } from "@/features/auth/schemas/auth";
import { safeNext } from "@/lib/session";

export function SignInPage() {
	const navigate = useNavigate();
	const { next } = useSearch({ from: "/_auth/sign-in" });
	const signIn = useSignIn();
	const form = useForm<SignInInput>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "", password: "", remember: true },
	});

	const onSubmit = form.handleSubmit((values) =>
		signIn.mutate(values, {
			onSuccess: () => {
				navigate({ href: safeNext(next), replace: true });
			},
			onError: () => toast.error("Could not start the sample session. Try again."),
		}),
	);

	return (
		<AuthShell
			title="Welcome back"
			description="Sign in to your sample workspace. Any email and an 8+ character password will do."
			footer={
				<>
					New here?{" "}
					<Link
						to="/sign-up"
						className="font-medium text-foreground underline-offset-4 hover:underline"
					>
						Create an account
					</Link>
				</>
			}
		>
			<Form {...form}>
				<form onSubmit={onSubmit} className="grid gap-4" noValidate>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										autoComplete="email"
										placeholder="you@example.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Password</FormLabel>
									<Link
										to="/forgot-password"
										className="text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline"
									>
										Forgot password?
									</Link>
								</div>
								<FormControl>
									<PasswordInput autoComplete="current-password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="remember"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={(v) => field.onChange(v === true)}
									/>
								</FormControl>
								<FormLabel className="font-normal">Keep me signed in on this device</FormLabel>
							</FormItem>
						)}
					/>
					<Button type="submit" size="lg" className="mt-2 h-10" disabled={signIn.isPending}>
						{signIn.isPending ? <Spinner /> : null}
						{signIn.isPending ? "Signing in…" : "Continue"}
					</Button>
				</form>
			</Form>
		</AuthShell>
	);
}
