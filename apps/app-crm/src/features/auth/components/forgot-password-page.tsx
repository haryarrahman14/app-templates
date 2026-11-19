import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { Spinner } from "@repo/ui/components/spinner";
import { Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "@/components/kit/form-fields";
import { AuthHeading } from "@/features/auth/components/auth-layout";
import { type ForgotPassword, forgotPasswordSchema } from "@/features/auth/schemas/auth";

export function ForgotPasswordPage() {
	const [sentTo, setSentTo] = useState<string | null>(null);
	const form = useForm<ForgotPassword>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	async function onSubmit(values: ForgotPassword) {
		// ▶ Real auth: call your provider's "send reset link" endpoint here.
		await new Promise((resolve) => setTimeout(resolve, 700));
		setSentTo(values.email);
	}

	if (sentTo) {
		return (
			<div className="flex flex-col items-center gap-3 text-center">
				<span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
					<MailCheck className="size-5" />
				</span>
				<h1 className="font-semibold text-xl">Check your inbox</h1>
				<p className="text-muted-foreground text-sm">
					If an account exists for {sentTo}, a reset link is on its way. This is a sample, so no
					email is sent.
				</p>
				<Button asChild className="mt-2 w-full" size="lg">
					<Link to="/reset-password">Open the reset page</Link>
				</Button>
				<Link to="/sign-in" className="text-muted-foreground text-sm hover:text-foreground">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<>
			<AuthHeading
				title="Forgot your password?"
				description="Enter your email and we will send you a reset link."
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
					<TextField
						control={form.control}
						name="email"
						label="Email"
						type="email"
						autoComplete="email"
					/>
					<Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? <Spinner /> : null}
						Send reset link
					</Button>
				</form>
			</Form>
			<p className="mt-5 text-center text-muted-foreground text-sm">
				Remembered it?{" "}
				<Link to="/sign-in" className="font-medium text-primary hover:underline">
					Sign in
				</Link>
			</p>
		</>
	);
}
