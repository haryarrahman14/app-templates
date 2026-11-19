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
import { type ForgotPasswordInput, forgotPasswordSchema } from "@/features/auth/schemas/auth";

export function ForgotPasswordForm() {
	const reset = useRequestPasswordReset();
	const form = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	if (reset.isSuccess) {
		return (
			<div className="space-y-6 text-center">
				<span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
					<MailCheckIcon className="size-6" />
				</span>
				<div className="space-y-2">
					<h1 className="font-semibold text-2xl tracking-tight">Check your inbox</h1>
					<p className="text-muted-foreground">
						If an account exists for{" "}
						<span className="font-medium text-foreground">{reset.data}</span>, a reset link is on
						its way. (Sample: no email is sent.)
					</p>
				</div>
				<Button variant="outline" asChild className="w-full">
					<Link to="/sign-in">Back to sign in</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="font-semibold text-3xl tracking-tight">Reset your password</h1>
				<p className="text-muted-foreground">Enter your email and we'll send you a link.</p>
			</div>
			<Form {...form}>
				<form
					noValidate
					onSubmit={form.handleSubmit((values) => reset.mutate(values))}
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
					<Button type="submit" className="h-10 w-full" disabled={reset.isPending}>
						{reset.isPending ? <Spinner /> : null}
						{reset.isPending ? "Sending…" : "Continue"}
					</Button>
				</form>
			</Form>
			<Link
				to="/sign-in"
				className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
			>
				<ArrowLeftIcon className="size-4" /> Back to sign in
			</Link>
		</div>
	);
}
