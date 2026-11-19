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
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Textarea } from "@repo/ui/components/textarea";
import { cn } from "@repo/ui/lib/cn";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Mail, MapPin, Send, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { Group, GroupRow, PageBody, PageHeader } from "@/components/kit/page";
import { sendContactMessage } from "@/features/contact/api/mutations";
import { contactInfoQuery } from "@/features/contact/api/queries";
import {
	type ContactMessage,
	contactMessageSchema,
	TOPICS,
} from "@/features/contact/schemas/contact";
import type { AppViewProps } from "@/lib/apps";

const EMPTY: ContactMessage = { name: "", email: "", topic: "New project", message: "" };

export function ContactPage(_: AppViewProps) {
	const { data: info } = useSuspenseQuery(contactInfoQuery);
	const form = useForm<ContactMessage>({
		resolver: zodResolver(contactMessageSchema),
		defaultValues: EMPTY,
	});
	const send = useMutation({
		mutationFn: sendContactMessage,
		onSuccess: ({ firstName }) => {
			toast.success(`Thanks, ${firstName}. Message sent.`, {
				description: "This is a demo: nothing was actually sent.",
			});
			form.reset(EMPTY);
		},
	});

	return (
		<div className="h-full overflow-y-auto">
			<PageBody className="max-w-2xl">
				<PageHeader title="Say hello" description="Tell me about the thing you're building." />
				<Form {...form}>
					<form
						noValidate
						onSubmit={form.handleSubmit((values) => send.mutate(values))}
						className="mb-8 space-y-5 rounded-[22px] border border-border/60 bg-card/80 p-5 shadow-soft @xl:p-6"
					>
						<div className="grid gap-5 @xl:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												autoComplete="name"
												placeholder="Your name"
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
						</div>
						<FormField
							control={form.control}
							name="topic"
							render={({ field }) => (
								<FormItem>
									<FormLabel>About</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{TOPICS.map((topic) => (
												<button
													key={topic}
													type="button"
													aria-pressed={field.value === topic}
													onClick={() => field.onChange(topic)}
													className={cn(
														"rounded-full border px-3.5 py-1.5 font-medium text-[13.5px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
														field.value === topic
															? "border-transparent bg-tint text-tint-foreground"
															: "border-border bg-background/60 hover:bg-shade/5",
													)}
												>
													{topic}
												</button>
											))}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Message</FormLabel>
									<FormControl>
										<Textarea
											rows={6}
											placeholder="What are you working on, and where could I help?"
											className="min-h-36 resize-y"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-wrap items-center justify-between gap-3 pt-1">
							<p className="text-[12.5px] text-muted-foreground">
								Demo form: nothing is sent anywhere. Use email for a real message.
							</p>
							<Button type="submit" size="lg" disabled={send.isPending} className="px-4">
								{send.isPending ? <Spinner /> : <Send />}
								{send.isPending ? "Sending…" : "Send message"}
							</Button>
						</div>
					</form>
				</Form>

				<Group title="Other ways">
					<GroupRow
						label={
							<span className="flex items-center gap-3">
								<Mail className="size-4 text-tint-text" /> Email
							</span>
						}
					>
						<a href={`mailto:${info.email}`} className="truncate text-[14px] text-tint-text">
							{info.email}
						</a>
					</GroupRow>
					<GroupRow
						label={
							<span className="flex items-center gap-3">
								<MapPin className="size-4 text-tint-text" /> {info.location}
							</span>
						}
					/>
					<GroupRow
						label={
							<span className="flex items-center gap-3">
								<Sparkles className="size-4 text-tint-text" /> {info.availability}
							</span>
						}
					/>
					{info.links.map((link) => (
						<a
							key={link.url}
							href={link.url}
							target="_blank"
							rel="noreferrer"
							className="flex min-h-12 items-center justify-between gap-4 px-4 py-3 text-[14.5px] hover:bg-shade/3"
						>
							<span className="flex items-center gap-3">
								<ArrowUpRight className="size-4 text-tint-text" /> {link.label}
							</span>
							<span className="truncate text-[14px] text-muted-foreground">{link.handle}</span>
						</a>
					))}
				</Group>
			</PageBody>
		</div>
	);
}
