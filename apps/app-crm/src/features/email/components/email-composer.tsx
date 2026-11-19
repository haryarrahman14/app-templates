import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { FileText, Maximize2, Minus, PenLine, Send, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { useLogActivity } from "@/features/activities/api/mutations";
import { RecipientInput } from "@/features/email/components/recipient-input";
import { EMAIL_TEMPLATES, type EmailTemplate } from "@/features/email/constants/templates";
import { emailDraftSchema } from "@/features/email/schemas/email";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { peopleQuery } from "@/features/people/api/queries";
import { setUi, useUi } from "@/lib/ui-state";

type Errors = Partial<Record<"to" | "subject" | "body", string>>;

const CLOSED = { open: false, minimized: false, to: [] as string[], subject: "" };

/** Floating bottom-right composer. Open it from anywhere with `openComposer(to, subject)`. */
export function EmailComposer() {
	const composer = useUi((state) => state.composer);
	const { data: people = [] } = useQuery({ ...peopleQuery, enabled: composer.open });
	const logActivity = useLogActivity();
	const onboarding = useOnboarding();
	const reduceMotion = useReducedMotion();
	const ids = { to: useId(), subject: useId(), body: useId() };

	const [to, setTo] = useState<string[]>([]);
	const [subject, setSubject] = useState("");
	const [body, setBody] = useState("");
	const [errors, setErrors] = useState<Errors>({});
	const [sending, setSending] = useState(false);

	// A fresh openComposer() call (new `to` array) starts a new draft with its prefill.
	useEffect(() => {
		if (!composer.open) return;
		setTo(composer.to);
		setSubject(composer.subject);
		setBody("");
		setErrors({});
	}, [composer.open, composer.to, composer.subject]);

	const setMinimized = (minimized: boolean) =>
		setUi((state) => ({ composer: { ...state.composer, minimized } }));
	const close = () => setUi({ composer: CLOSED });

	function applyTemplate(template: EmailTemplate) {
		const first = people.find((person) => person.email === to[0]);
		const firstName = first?.firstName ?? "there";
		setSubject(template.subject);
		setBody(template.body.replaceAll("{{firstName}}", firstName));
		setErrors({});
	}

	async function send() {
		const parsed = emailDraftSchema.safeParse({ to, subject, body });
		if (!parsed.success) {
			const next: Errors = {};
			for (const issue of parsed.error.issues) {
				const key = issue.path[0] as keyof Errors;
				next[key] ??=
					key === "to" && issue.path.length > 1
						? "One of the addresses is not valid"
						: issue.message;
			}
			setErrors(next);
			return;
		}
		setSending(true);
		// ▶ Real email: post the draft to your mail provider here.
		await new Promise((resolve) => setTimeout(resolve, 700));
		const recipient = people.find((person) => parsed.data.to.includes(person.email));
		if (recipient) {
			logActivity.mutate({
				type: "email",
				summary: `Emailed: ${parsed.data.subject}`,
				detail: parsed.data.body,
				record: { type: "person", id: recipient.id },
				silent: true,
			});
		}
		onboarding.complete("email");
		toast.success("Email sent", {
			description: recipient ? `Logged on ${recipient.firstName} ${recipient.lastName}` : undefined,
		});
		setSending(false);
		close();
	}

	const transition = { duration: reduceMotion ? 0 : 0.18, ease: [0.32, 0.72, 0, 1] as const };
	const offset = reduceMotion ? 0 : 16;

	return (
		<AnimatePresence>
			{composer.open && composer.minimized ? (
				<motion.button
					key="pill"
					type="button"
					onClick={() => setMinimized(false)}
					initial={{ opacity: 0, y: offset }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: offset }}
					transition={transition}
					className="glass fixed right-4 bottom-4 z-40 flex h-11 max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full px-4 font-medium text-sm shadow-float outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:right-6 md:bottom-6"
					aria-label="Restore the email draft"
				>
					<PenLine className="size-4 text-primary" />
					<span className="truncate">{subject || "New message"}</span>
					<Maximize2 className="size-3.5 text-muted-foreground" />
				</motion.button>
			) : null}
			{composer.open && !composer.minimized ? (
				<motion.section
					key="panel"
					role="dialog"
					aria-label="New message"
					initial={{ opacity: 0, y: offset, scale: reduceMotion ? 1 : 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: offset, scale: reduceMotion ? 1 : 0.98 }}
					transition={transition}
					onKeyDown={(event) => {
						if (event.key === "Escape") {
							event.stopPropagation();
							setMinimized(true);
						}
					}}
					className="fixed inset-x-2 bottom-2 z-40 flex max-h-[min(80dvh,640px)] flex-col overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-float md:inset-x-auto md:right-6 md:bottom-6 md:w-[440px]"
				>
					<header className="flex items-center gap-1 border-b bg-muted/50 py-1.5 pr-1.5 pl-4 backdrop-blur-xl">
						<h2 className="flex-1 truncate font-medium text-sm">{subject || "New message"}</h2>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={() => setMinimized(true)}
							aria-label="Minimise"
						>
							<Minus />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={close}
							aria-label="Close and discard"
						>
							<X />
						</Button>
					</header>

					<form
						className="flex min-h-0 flex-1 flex-col"
						onSubmit={(event) => {
							event.preventDefault();
							void send();
						}}
						noValidate
					>
						<div className="border-b px-4">
							<div className="flex items-start gap-2">
								<span className="pt-2 text-muted-foreground text-sm">To</span>
								<RecipientInput
									value={to}
									onChange={(next) => {
										setTo(next);
										setErrors((current) => ({ ...current, to: undefined }));
									}}
									people={people}
									invalid={Boolean(errors.to)}
									describedBy={errors.to ? ids.to : undefined}
								/>
							</div>
							{errors.to ? (
								<p id={ids.to} className="pb-2 text-destructive text-xs">
									{errors.to}
								</p>
							) : null}
						</div>
						<div className="border-b px-4">
							<label htmlFor={`${ids.subject}-input`} className="sr-only">
								Subject
							</label>
							<input
								id={`${ids.subject}-input`}
								value={subject}
								onChange={(event) => {
									setSubject(event.target.value);
									setErrors((current) => ({ ...current, subject: undefined }));
								}}
								placeholder="Subject"
								aria-invalid={Boolean(errors.subject) || undefined}
								aria-describedby={errors.subject ? ids.subject : undefined}
								className="h-10 w-full bg-transparent font-medium text-sm outline-none placeholder:font-normal placeholder:text-muted-foreground"
							/>
							{errors.subject ? (
								<p id={ids.subject} className="pb-2 text-destructive text-xs">
									{errors.subject}
								</p>
							) : null}
						</div>
						<label htmlFor={ids.body} className="sr-only">
							Message
						</label>
						<textarea
							id={ids.body}
							value={body}
							onChange={(event) => setBody(event.target.value)}
							placeholder="Write your message…"
							className="min-h-40 flex-1 resize-none bg-transparent px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground md:min-h-56"
						/>
						<footer className="flex items-center gap-2 border-t px-3 py-2.5">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button type="button" variant="ghost" size="sm">
										<FileText /> Templates
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" side="top" className="w-56 rounded-xl">
									<DropdownMenuLabel className="text-muted-foreground text-xs">
										Insert a template
									</DropdownMenuLabel>
									{EMAIL_TEMPLATES.map((template) => (
										<DropdownMenuItem key={template.id} onSelect={() => applyTemplate(template)}>
											{template.name}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
							<Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={close}>
								Discard
							</Button>
							<Button type="submit" size="sm" disabled={sending} className={cn("min-w-20")}>
								{sending ? <Spinner /> : <Send />}
								{sending ? "Sending" : "Send"}
							</Button>
						</footer>
					</form>
				</motion.section>
			) : null}
		</AnimatePresence>
	);
}
