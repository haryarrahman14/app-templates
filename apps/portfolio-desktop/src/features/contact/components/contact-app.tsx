import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRightIcon, SendIcon } from "lucide-react";
import { type ReactNode, useId } from "react";
import { useForm } from "react-hook-form";
import { sendContactMessageMutation } from "@/features/contact/api/mutations";
import {
	type ContactMessage,
	contactMessageSchema,
} from "@/features/contact/schemas/contact-message";

const EMPTY: ContactMessage = { name: "", email: "", subject: "", message: "" };

function Row({
	label,
	htmlFor,
	error,
	children,
}: {
	label: string;
	htmlFor?: string;
	error?: string;
	children: ReactNode;
}) {
	return (
		<div className="border-foreground/5 border-b px-5">
			<div className="flex min-h-11 items-center gap-3">
				<label htmlFor={htmlFor} className="w-16 shrink-0 text-muted-foreground text-sm">
					{label}
				</label>
				<div className="min-w-0 flex-1">{children}</div>
			</div>
			{error && (
				<p role="alert" className="-mt-1 pb-2 pl-[76px] text-destructive text-xs">
					{error}
				</p>
			)}
		</div>
	);
}

const fieldClass =
	"h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/60";

/** A mail-compose window. Validates with zod; sending is simulated in api/mutations.ts. */
export function ContactApp({
	to,
	ownerName,
	links,
}: {
	to: string;
	ownerName: string;
	/** Other ways to reach the owner, shown under the To line. */
	links: { label: string; href: string }[];
}) {
	const id = useId();
	const form = useForm<ContactMessage>({
		resolver: zodResolver(contactMessageSchema),
		defaultValues: EMPTY,
	});
	const { errors } = form.formState;
	const send = useMutation({
		...sendContactMessageMutation,
		onSuccess: (_result, values) => {
			toast.success(`Thanks, ${values.name.split(" ")[0]}`, {
				description: `This form doesn't send yet. Please write to ${to}.`,
			});
			form.reset(EMPTY);
		},
		onError: () => toast.error("Couldn't send that. Please try again."),
	});

	return (
		<form
			noValidate
			onSubmit={form.handleSubmit((values) => send.mutate(values))}
			className="flex h-full flex-col"
		>
			<div className="flex h-12 shrink-0 items-center justify-between gap-3 border-foreground/5 border-b px-4">
				<p className="font-semibold">New message</p>
				<Button type="submit" size="sm" className="rounded-full px-4" disabled={send.isPending}>
					{send.isPending ? <Spinner /> : <SendIcon />}
					{send.isPending ? "Sending" : "Send"}
				</Button>
			</div>
			<div className="border-foreground/5 border-b px-5">
				<div className="flex min-h-11 items-center gap-3">
					<span className="w-16 shrink-0 text-muted-foreground text-sm">To</span>
					<a
						href={`mailto:${to}`}
						className="rounded-full bg-tint/12 px-2.5 py-0.5 text-sm text-tint-text"
					>
						{to}
					</a>
				</div>
			</div>
			{links.length > 0 && (
				<div className="border-foreground/5 border-b px-5">
					<div className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 py-2">
						<span className="w-16 shrink-0 text-muted-foreground text-sm">Or</span>
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-0.5 text-sm text-tint-text hover:underline"
							>
								{link.label}
								<ArrowUpRightIcon className="size-3.5" />
							</a>
						))}
					</div>
				</div>
			)}
			<Row label="Name" htmlFor={`${id}-name`} error={errors.name?.message}>
				<input
					id={`${id}-name`}
					autoComplete="name"
					placeholder="Your name"
					aria-invalid={!!errors.name}
					className={fieldClass}
					{...form.register("name")}
				/>
			</Row>
			<Row label="From" htmlFor={`${id}-email`} error={errors.email?.message}>
				<input
					id={`${id}-email`}
					type="email"
					autoComplete="email"
					placeholder="you@example.com"
					aria-invalid={!!errors.email}
					className={fieldClass}
					{...form.register("email")}
				/>
			</Row>
			<Row label="Subject" htmlFor={`${id}-subject`} error={errors.subject?.message}>
				<input
					id={`${id}-subject`}
					placeholder="What's it about?"
					aria-invalid={!!errors.subject}
					className={cn(fieldClass, "font-medium")}
					{...form.register("subject")}
				/>
			</Row>
			<div className="flex min-h-0 flex-1 flex-col px-5 py-4">
				<label htmlFor={`${id}-message`} className="sr-only">
					Message
				</label>
				<textarea
					id={`${id}-message`}
					placeholder={`Hi ${ownerName.split(" ")[0]}, I’m working on…`}
					aria-invalid={!!errors.message}
					className="min-h-32 w-full flex-1 resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground/60"
					{...form.register("message")}
				/>
				{errors.message && (
					<p role="alert" className="pt-2 text-destructive text-xs">
						{errors.message.message}
					</p>
				)}
			</div>
		</form>
	);
}
