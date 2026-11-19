import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useAsk } from "@/features/home/api/mutations";
import { type Ask, askSchema } from "@/features/home/schemas/meeting";
import { hrefLink } from "@/lib/href-link";

const SUGGESTIONS = [
	"Which software companies need a follow-up?",
	"Show me Brightloom",
	"Deals closing this month",
];

/** "Ask anything": a stub that matches records by keyword. Swap useAsk's mutationFn for a model call. */
export function AskBox() {
	const id = useId();
	const ask = useAsk();
	const reduce = useReducedMotion();
	const form = useForm<Ask>({ resolver: zodResolver(askSchema), defaultValues: { question: "" } });
	const error = form.formState.errors.question?.message;

	const submit = form.handleSubmit((values) => ask.mutate(values.question));

	return (
		<div className="grid gap-3">
			<form
				onSubmit={submit}
				className={cn(
					"rounded-2xl border bg-card p-3 shadow-soft transition focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
					error && "border-destructive",
				)}
				noValidate
			>
				<label htmlFor={id} className="sr-only">
					Ask anything about your records
				</label>
				<textarea
					id={id}
					rows={2}
					placeholder="Ask anything… e.g. which customers have not heard from us in a month?"
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${id}-error` : undefined}
					{...form.register("question")}
					onKeyDown={(event) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							submit();
						}
					}}
					className="w-full resize-none bg-transparent px-1 text-[15px] outline-none placeholder:text-muted-foreground"
				/>
				<div className="flex items-center gap-2">
					<span className="flex items-center gap-1.5 text-muted-foreground text-xs">
						<Sparkles className="size-3.5 text-primary" /> Sample assistant
					</span>
					{error ? (
						<span id={`${id}-error`} className="text-destructive text-xs">
							{error}
						</span>
					) : null}
					<Button
						type="submit"
						size="icon-sm"
						className="ml-auto rounded-full"
						disabled={ask.isPending}
						aria-label="Ask"
					>
						{ask.isPending ? <Spinner /> : <ArrowUp />}
					</Button>
				</div>
			</form>
			{!ask.data && !ask.isPending ? (
				<div className="flex flex-wrap gap-2">
					{SUGGESTIONS.map((suggestion) => (
						<button
							key={suggestion}
							type="button"
							onClick={() => {
								form.setValue("question", suggestion);
								ask.mutate(suggestion);
							}}
							className="rounded-full border bg-background px-3 py-1 text-muted-foreground text-xs outline-none transition hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
						>
							{suggestion}
						</button>
					))}
				</div>
			) : null}
			<AnimatePresence>
				{ask.data ? (
					<motion.div
						initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="relative grid gap-3 rounded-2xl border bg-muted/60 p-4"
						aria-live="polite"
					>
						<Button
							variant="ghost"
							size="icon-xs"
							className="absolute top-2 right-2"
							aria-label="Dismiss answer"
							onClick={() => {
								ask.reset();
								form.reset();
							}}
						>
							<X />
						</Button>
						<p className="pr-6 text-sm">{ask.data.text}</p>
						{ask.data.links.length ? (
							<div className="flex flex-wrap gap-2">
								{ask.data.links.map((link) => (
									<Link
										key={link.href}
										{...hrefLink(link.href)}
										className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-sm outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
									>
										<span className="text-muted-foreground text-xs">{link.type}</span>
										{link.label}
									</Link>
								))}
							</div>
						) : null}
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
