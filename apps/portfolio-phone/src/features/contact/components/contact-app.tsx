import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
	BriefcaseBusiness,
	CircleCheck,
	Globe2,
	type LucideIcon,
	Mail,
	SquareCode,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { AppScreen } from "@/components/kit/app-screen";
import { InsetRow, InsetSection } from "@/components/kit/inset-list";
import { sendContactMessageMutation } from "@/features/contact/api/mutations";
import { contactInfoQuery } from "@/features/contact/api/queries";
import type { ContactInfo } from "@/features/contact/schemas/contact-info";
import {
	CONTACT_TOPICS,
	type ContactMessage,
	contactMessageSchema,
} from "@/features/contact/schemas/contact-message";
import { usePhoneNav } from "@/lib/phone-nav";

const LINK_ICONS: Record<ContactInfo["links"][number]["kind"], LucideIcon> = {
	github: SquareCode,
	linkedin: BriefcaseBusiness,
	email: Mail,
};

const fieldClass =
	"w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70";

export function ContactApp() {
	const { data: info } = useSuspenseQuery(contactInfoQuery);
	const nav = usePhoneNav();
	const send = useMutation({
		...sendContactMessageMutation,
		onSuccess: (result) =>
			toast("Demo form: nothing was sent", {
				description: `Thanks, ${result.name}. To reach me, use ${info.email}.`,
			}),
		onError: () => toast.error("Couldn't send that. Try email instead."),
	});

	const form = useForm<ContactMessage>({
		resolver: zodResolver(contactMessageSchema),
		defaultValues: { name: "", email: "", topic: "Project", message: "" },
	});

	const submit = form.handleSubmit((values) => send.mutate(values));

	return (
		<AppScreen title="Contact" subtitle={info.intro} back={{ label: "Home", onClick: nav.back }}>
			{send.isSuccess ? (
				<div className="mx-4 flex flex-col items-center rounded-[20px] bg-(--grouped-card) px-6 py-10 text-center shadow-[0_0_0_0.5px_var(--grouped-line)]">
					<CircleCheck className="size-12 text-tint-text" strokeWidth={1.6} />
					<p className="mt-3 font-semibold text-[19px] tracking-tight">Thanks, {send.data.name}</p>
					<p className="mt-1 text-[14px] text-muted-foreground">
						This form is a demo, so nothing was sent. Email reaches me at{" "}
						<a
							href={`mailto:${info.email}`}
							className="text-tint-text underline underline-offset-2"
						>
							{info.email}
						</a>
						.
					</p>
					<button
						type="button"
						onClick={() => {
							form.reset();
							send.reset();
						}}
						className="mt-5 rounded-full bg-tint/10 px-4 py-2 font-medium text-[14px] text-tint-text outline-none hover:bg-tint/15 focus-visible:ring-2 focus-visible:ring-ring/50"
					>
						Send another
					</button>
				</div>
			) : (
				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-6">
						<InsetSection header="About you">
							{(["name", "email"] as const).map((name) => (
								<FormField
									key={name}
									control={form.control}
									name={name}
									render={({ field }) => (
										<FormItem className="flex items-center gap-3 border-(--grouped-line) border-b py-0 pl-4 last:border-b-0">
											<FormLabel className="w-16 shrink-0 font-normal text-[15px] text-foreground">
												{name === "name" ? "Name" : "Email"}
											</FormLabel>
											<FormControl>
												<input
													{...field}
													type={name === "email" ? "email" : "text"}
													autoComplete={name}
													placeholder={name === "name" ? "Ada Example" : "you@example.com"}
													className={cn(fieldClass, "h-11 pr-4")}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							))}
						</InsetSection>
						<FieldErrors names={["name", "email"]} form={form} />

						<FormField
							control={form.control}
							name="topic"
							render={({ field }) => (
								<FormItem className="px-4">
									<FormLabel className="mb-1.5 px-4 font-medium text-[12.5px] text-muted-foreground uppercase tracking-wide">
										Topic
									</FormLabel>
									<fieldset
										aria-label="Topic"
										className="min-w-0 grid grid-cols-3 gap-1 rounded-[11px] bg-foreground/[0.06] p-[3px]"
									>
										{CONTACT_TOPICS.map((topic) => (
											<button
												key={topic}
												type="button"
												aria-pressed={field.value === topic}
												onClick={() => field.onChange(topic)}
												className={cn(
													"rounded-[8px] py-1.5 font-medium text-[13.5px] outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring/50",
													field.value === topic
														? "bg-(--grouped-card) shadow-[0_1px_3px_#0000001f]"
														: "text-muted-foreground hover:text-foreground",
												)}
											>
												{topic}
											</button>
										))}
									</fieldset>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem className="px-4">
									<FormLabel className="mb-1.5 px-4 font-medium text-[12.5px] text-muted-foreground uppercase tracking-wide">
										Message
									</FormLabel>
									<FormControl>
										<textarea
											{...field}
											rows={5}
											placeholder="What would you like to talk about?"
											className={cn(
												fieldClass,
												"resize-none rounded-[14px] bg-(--grouped-card) px-4 py-3 leading-relaxed shadow-[0_0_0_0.5px_var(--grouped-line)] aria-invalid:shadow-[0_0_0_1px_var(--destructive)]",
											)}
										/>
									</FormControl>
									<div className="flex justify-between gap-3 px-4">
										<FormMessage className="text-[12.5px]" />
										<span className="ml-auto text-[12px] text-muted-foreground tabular-nums">
											{field.value.length}/1000
										</span>
									</div>
								</FormItem>
							)}
						/>

						<div className="px-4">
							<button
								type="submit"
								disabled={send.isPending}
								className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-tint font-semibold text-[16px] text-tint-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:opacity-60"
							>
								{send.isPending ? <Spinner className="size-4" /> : null}
								{send.isPending ? "Sending…" : "Send message"}
							</button>
							<p className="mt-2 text-center text-[12px] text-muted-foreground">
								Demo form: nothing leaves your browser.
							</p>
						</div>
					</form>
				</Form>
			)}

			<InsetSection header="Other ways" className="mt-7">
				{info.links.map((link) => (
					<InsetRow
						key={link.href}
						icon={LINK_ICONS[link.kind]}
						label={link.label}
						value={link.handle}
						href={link.href}
					/>
				))}
				<InsetRow icon={Globe2} iconBackground="#007AFF" label="Time zone" value={info.timezone} />
			</InsetSection>
		</AppScreen>
	);
}

/** Errors for fields inside an inset group show under the whole group, like a settings footer. */
function FieldErrors({
	names,
	form,
}: {
	names: (keyof ContactMessage)[];
	form: ReturnType<typeof useForm<ContactMessage>>;
}) {
	const errors = names
		.map((name) => form.formState.errors[name]?.message)
		.filter((message): message is string => Boolean(message));
	if (!errors.length) return null;
	return (
		<ul className="-mt-4 px-8 text-[12.5px] text-destructive" role="alert">
			{errors.map((message) => (
				<li key={message}>{message}</li>
			))}
		</ul>
	);
}
