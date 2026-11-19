import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUp, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { AppScreen } from "@/components/kit/app-screen";
import { conversationQuery } from "@/features/messages/api/queries";
import { usePhoneNav } from "@/lib/phone-nav";

type Bubble = { id: number; from: "owner" | "visitor"; text: string };

let nextId = 0;
const bubble = (from: Bubble["from"], text: string): Bubble => ({ id: nextId++, from, text });

export function MessagesApp() {
	const { data: chat } = useSuspenseQuery(conversationQuery);
	const nav = usePhoneNav();
	const [bubbles, setBubbles] = useState<Bubble[]>(() =>
		chat.greeting.map((text) => bubble("owner", text)),
	);
	const [asked, setAsked] = useState<string[]>([]);
	const [typing, setTyping] = useState(false);
	const [draft, setDraft] = useState("");
	const end = useRef<HTMLDivElement>(null);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

	useEffect(() => () => timers.current.forEach(clearTimeout), []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll whenever the thread grows
	useEffect(() => {
		end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [bubbles.length, typing]);

	const reply = (question: string, answer: string[]) => {
		setBubbles((current) => [...current, bubble("visitor", question)]);
		setTyping(true);
		answer.forEach((text, index) => {
			timers.current.push(
				setTimeout(
					() => {
						setBubbles((current) => [...current, bubble("owner", text)]);
						if (index === answer.length - 1) setTyping(false);
					},
					700 + index * 900,
				),
			);
		});
	};

	const ask = (id: string) => {
		const item = chat.questions.find((q) => q.id === id);
		if (!item || typing) return;
		setAsked((current) => [...current, id]);
		reply(item.question, item.answer);
	};

	const send = (event: FormEvent) => {
		event.preventDefault();
		const text = draft.trim();
		if (!text || typing) return;
		setDraft("");
		const match = chat.questions.find((q) => q.question.toLowerCase() === text.toLowerCase());
		reply(text, match ? match.answer : chat.fallback);
	};

	const reset = () => {
		timers.current.forEach(clearTimeout);
		setTyping(false);
		setAsked([]);
		setBubbles(chat.greeting.map((text) => bubble("owner", text)));
	};

	const remaining = chat.questions.filter((q) => !asked.includes(q.id));

	return (
		<AppScreen
			title="Ask me"
			largeTitle={false}
			back={{ label: "Home", onClick: nav.back }}
			className="bg-background"
			trailing={
				<button
					type="button"
					onClick={reset}
					aria-label="Start over"
					className="grid size-9 place-items-center rounded-lg text-tint-text outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
				>
					<RotateCcw className="size-[18px]" />
				</button>
			}
			footer={
				<div className="border-(--grouped-line) border-t bg-background/80 pt-2 backdrop-blur-xl">
					<div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
						{(remaining.length ? remaining : chat.questions).map((q) => (
							<button
								key={q.id}
								type="button"
								onClick={() => ask(q.id)}
								disabled={typing}
								className="shrink-0 rounded-full border border-tint/30 px-3 py-1.5 font-medium text-[13px] text-tint-text outline-none transition-colors hover:bg-tint/10 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
							>
								{q.question}
							</button>
						))}
					</div>
					<form onSubmit={send} className="flex items-center gap-2 px-3 pb-2">
						<label htmlFor="chat-draft" className="sr-only">
							Message
						</label>
						<input
							id="chat-draft"
							value={draft}
							onChange={(event) => setDraft(event.target.value)}
							placeholder="Message"
							autoComplete="off"
							className="h-9 min-w-0 flex-1 rounded-full border border-(--grouped-line) bg-(--grouped-card) px-4 text-[15px] outline-none placeholder:text-muted-foreground focus-visible:border-tint/50"
						/>
						<button
							type="submit"
							aria-label="Send"
							disabled={!draft.trim() || typing}
							className="grid size-9 shrink-0 place-items-center rounded-full bg-tint text-tint-foreground outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40"
						>
							<ArrowUp className="size-[18px]" strokeWidth={2.5} />
						</button>
					</form>
				</div>
			}
		>
			<div className="flex flex-col gap-1 px-3 pt-2" aria-live="polite">
				<p className="mb-2 text-center text-[11.5px] text-muted-foreground">Today</p>
				<AnimatePresence initial={false}>
					{bubbles.map((item, index) => {
						const next = bubbles[index + 1];
						const tail = !next || next.from !== item.from;
						return (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, y: 8, scale: 0.98 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{ duration: 0.22 }}
								className={cn(
									"max-w-[78%] whitespace-pre-line px-3.5 py-2 text-[15px] leading-snug",
									item.from === "owner"
										? "self-start rounded-[18px] bg-(--bubble) text-foreground"
										: "self-end rounded-[18px] bg-tint text-tint-foreground",
									tail && (item.from === "owner" ? "rounded-bl-[6px]" : "rounded-br-[6px]"),
									tail && "mb-2",
								)}
							>
								{item.text}
							</motion.div>
						);
					})}
					{typing ? (
						<motion.div
							key="typing"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className="flex gap-1 self-start rounded-[18px] rounded-bl-[6px] bg-(--grouped) px-4 py-3 dark:bg-(--grouped-card)"
							aria-label="Typing"
						>
							{[0, 1, 2].map((dot) => (
								<motion.span
									key={dot}
									className="size-2 rounded-full bg-muted-foreground/60"
									animate={{ opacity: [0.3, 1, 0.3] }}
									transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: dot * 0.15 }}
								/>
							))}
						</motion.div>
					) : null}
				</AnimatePresence>
				<div ref={end} />
			</div>
		</AppScreen>
	);
}
