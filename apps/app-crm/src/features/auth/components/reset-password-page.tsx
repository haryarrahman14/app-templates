import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { TextField } from "@/components/kit/form-fields";
import { AuthHeading } from "@/features/auth/components/auth-layout";
import { type ResetPassword, resetPasswordSchema } from "@/features/auth/schemas/auth";

export function ResetPasswordPage() {
	const navigate = useNavigate();
	const form = useForm<ResetPassword>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { password: "", confirm: "" },
	});

	async function onSubmit() {
		// ▶ Real auth: send the new password with the token from the reset link.
		await new Promise((resolve) => setTimeout(resolve, 700));
		toast.success("Password updated. Sign in with your new password.");
		navigate({ to: "/sign-in" });
	}

	return (
		<>
			<AuthHeading
				title="Set a new password"
				description="Choose something you have not used before."
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
					<TextField
						control={form.control}
						name="password"
						label="New password"
						type="password"
						autoComplete="new-password"
						placeholder="At least 8 characters"
					/>
					<TextField
						control={form.control}
						name="confirm"
						label="Confirm new password"
						type="password"
						autoComplete="new-password"
					/>
					<Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? <Spinner /> : null}
						Update password
					</Button>
				</form>
			</Form>
			<p className="mt-5 text-center text-muted-foreground text-sm">
				<Link to="/sign-in" className="hover:text-foreground">
					Back to sign in
				</Link>
			</p>
		</>
	);
}
