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
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, MailCheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRequestPasswordReset } from "@/features/auth/api/mutations";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { type ForgotPasswordInput, forgotPasswordSchema } from "@/features/auth/schemas/auth";

export function ForgotPasswordPage() {
	const reset = useRequestPasswordReset();
	const form = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	const back = (
		<Link
			to="/sign-in"
			className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
		>
			<ArrowLeftIcon aria-hidden className="size-3.5" />
			Back to sign in
		</Link>
	);

	if (reset.isSuccess) {
		return (
			<AuthShell
				title="Check your inbox"
				description={`If an account exists for ${form.getValues("email")}, a reset link is on its way.`}
				footer={back}
			>
				<div className="flex items-start gap-3 rounded-xl bg-foreground/[0.04] p-4 text-sm">
					<MailCheckIcon aria-hidden className="mt-0.5 size-4 text-tint-ink" />
					<p className="text-muted-foreground">
						This is a template, so no email was actually sent. Connect your auth provider's reset
						endpoint in <code className="text-foreground">features/auth/api/mutations.ts</code>.
					</p>
				</div>
			</AuthShell>
		);
	}

	return (
		<AuthShell
			title="Reset your password"
			description="Enter the email you signed up with and we'll send a reset link."
			footer={back}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((v) => reset.mutate(v))}
					className="grid gap-4"
					noValidate
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
										placeholder="you@example.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" size="lg" className="mt-2 h-10" disabled={reset.isPending}>
						{reset.isPending ? <Spinner /> : null}
						{reset.isPending ? "Sending…" : "Send reset link"}
					</Button>
				</form>
			</Form>
		</AuthShell>
	);
}
