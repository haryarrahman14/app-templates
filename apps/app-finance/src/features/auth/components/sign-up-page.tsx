import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useSignUp } from "@/features/auth/api/mutations";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { PasswordInput } from "@/features/auth/components/password-input";
import { type SignUpInput, signUpSchema } from "@/features/auth/schemas/auth";

export function SignUpPage() {
	const navigate = useNavigate();
	const signUp = useSignUp();
	const form = useForm<SignUpInput>({
		resolver: zodResolver(signUpSchema),
		defaultValues: { name: "", email: "", password: "", confirm: "", terms: false },
	});

	const onSubmit = form.handleSubmit((values) =>
		signUp.mutate(values, {
			onSuccess: () => {
				toast.success("Sample account created");
				navigate({ to: "/", replace: true });
			},
			onError: () => toast.error("Could not create the sample account. Try again."),
		}),
	);

	return (
		<AuthShell
			title="Create your account"
			description="A sample account with an invented portfolio, ready to explore."
			footer={
				<>
					Already have an account?{" "}
					<Link
						to="/sign-in"
						className="font-medium text-foreground underline-offset-4 hover:underline"
					>
						Sign in
					</Link>
				</>
			}
		>
			<Form {...form}>
				<form onSubmit={onSubmit} className="grid gap-4" noValidate>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full name</FormLabel>
								<FormControl>
									<Input autoComplete="name" placeholder="Ava Lindqvist" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
								<FormLabel>Password</FormLabel>
								<FormControl>
									<PasswordInput autoComplete="new-password" {...field} />
								</FormControl>
								<FormDescription>At least 8 characters, including a number.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirm"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm password</FormLabel>
								<FormControl>
									<PasswordInput autoComplete="new-password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="terms"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-start gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(v) => field.onChange(v === true)}
											className="mt-0.5"
										/>
									</FormControl>
									<FormLabel className="font-normal leading-snug">
										I understand this is a template with invented data, not a real brokerage.
									</FormLabel>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" size="lg" className="mt-2 h-10" disabled={signUp.isPending}>
						{signUp.isPending ? <Spinner /> : null}
						{signUp.isPending ? "Creating account…" : "Continue"}
					</Button>
				</form>
			</Form>
		</AuthShell>
	);
}
