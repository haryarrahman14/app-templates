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
import { Spinner } from "@repo/ui/components/spinner";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { TextField } from "@/components/kit/form-fields";
import { AuthHeading } from "@/features/auth/components/auth-layout";
import { type SignUp, signUpSchema } from "@/features/auth/schemas/auth";
import { safeNext, signIn } from "@/lib/session";

export function SignUpPage() {
	const navigate = useNavigate();
	const { next } = useSearch({ from: "/_auth" });
	const form = useForm<SignUp>({
		resolver: zodResolver(signUpSchema),
		defaultValues: { name: "", email: "", password: "", confirm: "", terms: false },
	});

	async function onSubmit(values: SignUp) {
		await signIn(values);
		navigate({ href: safeNext(next), replace: true });
	}

	return (
		<>
			<AuthHeading
				title="Create your account"
				description="Start a 14-day trial. No card needed."
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
					<TextField control={form.control} name="name" label="Full name" autoComplete="name" />
					<TextField
						control={form.control}
						name="email"
						label="Work email"
						type="email"
						autoComplete="email"
						placeholder="you@example.com"
					/>
					<TextField
						control={form.control}
						name="password"
						label="Password"
						type="password"
						autoComplete="new-password"
						placeholder="At least 8 characters"
					/>
					<TextField
						control={form.control}
						name="confirm"
						label="Confirm password"
						type="password"
						autoComplete="new-password"
					/>
					<FormField
						control={form.control}
						name="terms"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(v) => field.onChange(v === true)}
										/>
									</FormControl>
									<FormLabel className="font-normal text-muted-foreground">
										I agree to the sample terms and privacy notice
									</FormLabel>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? <Spinner /> : null}
						Create account
					</Button>
				</form>
			</Form>
			<p className="mt-5 text-center text-muted-foreground text-sm">
				Already have an account?{" "}
				<Link to="/sign-in" className="font-medium text-primary hover:underline">
					Sign in
				</Link>
			</p>
		</>
	);
}
