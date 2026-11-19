import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Spinner } from "@repo/ui/components/spinner";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useSignIn } from "@/features/auth/api/mutations";
import { SAMPLE_ACCOUNT, type SignInInput, signInSchema } from "@/features/auth/schemas/auth";

export function SignInForm({ next }: { next: string }) {
	const router = useRouter();
	const signIn = useSignIn();
	const form = useForm<SignInInput>({
		resolver: zodResolver(signInSchema),
		defaultValues: { email: "", password: "" },
	});

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="font-semibold text-3xl tracking-tight">Welcome back</h1>
				<p className="text-muted-foreground">Sign in to pick up where you left off.</p>
			</div>
			<Form {...form}>
				<form
					noValidate
					onSubmit={form.handleSubmit((values) =>
						signIn.mutate(values, {
							// `next` is a same-site path with its search, validated by the route.
							onSuccess: () => router.history.push(next),
						}),
					)}
					className="space-y-4"
				>
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
										placeholder="you@company.com"
										className="h-10"
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
										className="text-link text-sm underline underline-offset-2"
									>
										Forgot password?
									</Link>
								</div>
								<FormControl>
									<Input
										type="password"
										autoComplete="current-password"
										className="h-10"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="h-10 w-full" disabled={signIn.isPending}>
						{signIn.isPending ? <Spinner /> : null}
						{signIn.isPending ? "Signing in…" : "Continue"}
					</Button>
					<Button
						type="button"
						variant="outline"
						className="h-10 w-full"
						onClick={() => {
							form.setValue("email", SAMPLE_ACCOUNT.email, { shouldValidate: true });
							form.setValue("password", SAMPLE_ACCOUNT.password, { shouldValidate: true });
						}}
					>
						Fill in the sample account
					</Button>
				</form>
			</Form>
			<p className="text-center text-muted-foreground text-sm">
				New here?{" "}
				<Link to="/sign-up" className="font-medium text-link underline underline-offset-2">
					Create an account
				</Link>
			</p>
		</div>
	);
}
