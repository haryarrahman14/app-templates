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
import { Spinner } from "@repo/ui/components/spinner";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useSignUp } from "@/features/auth/api/mutations";
import { signUpSchema } from "@/features/auth/schemas/auth";

export function SignUpForm() {
	const navigate = useNavigate();
	const signUp = useSignUp();
	const form = useForm<z.input<typeof signUpSchema>, unknown, z.output<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: { name: "", email: "", password: "", terms: false as unknown as true },
	});

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="font-semibold text-3xl tracking-tight">Create your account</h1>
				<p className="text-muted-foreground">Free for one person. Invite your team any time.</p>
			</div>
			<Form {...form}>
				<form
					noValidate
					onSubmit={form.handleSubmit((values) =>
						signUp.mutate(values, {
							onSuccess: () => navigate({ to: "/onboarding" }),
						}),
					)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full name</FormLabel>
								<FormControl>
									<Input
										autoComplete="name"
										placeholder="Ada Fernhill"
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Work email</FormLabel>
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
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" autoComplete="new-password" className="h-10" {...field} />
								</FormControl>
								<FormDescription>At least 8 characters, with a number.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="terms"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-start gap-2.5">
									<FormControl>
										<Checkbox
											checked={field.value === true}
											onCheckedChange={(value) => field.onChange(value === true)}
											className="mt-0.5"
										/>
									</FormControl>
									<FormLabel className="font-normal text-muted-foreground leading-snug">
										I agree to the sample terms and privacy notice.
									</FormLabel>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="h-10 w-full" disabled={signUp.isPending}>
						{signUp.isPending ? <Spinner /> : null}
						{signUp.isPending ? "Creating account…" : "Continue"}
					</Button>
				</form>
			</Form>
			<p className="text-center text-muted-foreground text-sm">
				Already have an account?{" "}
				<Link to="/sign-in" className="font-medium text-link underline underline-offset-2">
					Sign in
				</Link>
			</p>
		</div>
	);
}
