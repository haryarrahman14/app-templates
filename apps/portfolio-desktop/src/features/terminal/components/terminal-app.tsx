import { useTheme } from "@repo/ui/hooks/use-theme";
import { cn } from "@repo/ui/lib/cn";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { COMMANDS, runCommand, type TerminalContext } from "@/features/terminal/utils/run-command";
import { useWindows } from "@/lib/window-store";

type Line = { id: number; kind: "input" | "output"; text: string };

const PROMPT = "guest@desktop ~ %";

/** A tiny fake shell. Commands live in utils/run-command.ts. */
export function TerminalApp(props: TerminalContext) {
	const { open } = useWindows();
	const { setTheme } = useTheme();
	const nextId = useRef(2);
	const [lines, setLines] = useState<Line[]>([
		{
			id: 0,
			kind: "output",
			text: `Last login on this desktop. Hello, I'm ${props.profile.name}.`,
		},
		{ id: 1, kind: "output", text: "Type help to see what I can do." },
	]);
	const [value, setValue] = useState("");
	const [history, setHistory] = useState<string[]>([]);
	const [cursor, setCursor] = useState<number | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const endRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll whenever a line is added
	useEffect(() => {
		endRef.current?.scrollIntoView({ block: "end" });
	}, [lines]);

	const submit = () => {
		const line = value;
		const result = runCommand(line, props);
		setValue("");
		setCursor(null);
		if (line.trim()) setHistory((items) => [...items, line]);
		if (result.effect?.type === "clear") {
			setLines([]);
			return;
		}
		const make = (kind: Line["kind"], text: string): Line => ({ id: nextId.current++, kind, text });
		setLines((current) => [
			...current,
			make("input", line),
			...result.output.map((text) => make("output", text)),
		]);
		if (result.effect?.type === "open") open(result.effect.id);
		if (result.effect?.type === "theme") setTheme(result.effect.value);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			submit();
		} else if (event.key === "ArrowUp" && history.length) {
			event.preventDefault();
			const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
			setCursor(next);
			setValue(history[next] ?? "");
		} else if (event.key === "ArrowDown" && cursor !== null) {
			event.preventDefault();
			const next = cursor + 1;
			setCursor(next >= history.length ? null : next);
			setValue(history[next] ?? "");
		} else if (event.key === "Tab") {
			event.preventDefault();
			const match = COMMANDS.find((command) => command.startsWith(value.trim()));
			if (value.trim() && match) setValue(`${match} `);
		} else if (event.key === "l" && event.ctrlKey) {
			event.preventDefault();
			setLines([]);
		}
	};

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: clicking anywhere focuses the prompt; the input itself takes keys
		// biome-ignore lint/a11y/noStaticElementInteractions: same as above
		<div
			onClick={() => inputRef.current?.focus()}
			className="h-full overflow-y-auto bg-terminal-bg p-4 font-mono text-[13px] text-terminal-fg leading-relaxed"
		>
			{lines.map((line) => (
				<p
					key={line.id}
					className={cn(
						"whitespace-pre-wrap break-words",
						line.kind === "output" && "text-terminal-muted",
					)}
				>
					{line.kind === "input" && <span className="mr-2 text-terminal-prompt">{PROMPT}</span>}
					{line.text}
				</p>
			))}
			<div ref={endRef} className="flex items-center">
				<label htmlFor="terminal-input" className="mr-2 shrink-0 text-terminal-prompt">
					{PROMPT}
				</label>
				<input
					id="terminal-input"
					ref={inputRef}
					value={value}
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={onKeyDown}
					autoComplete="off"
					autoCapitalize="off"
					spellCheck={false}
					aria-label="Terminal command"
					className="min-w-0 flex-1 bg-transparent caret-terminal-prompt outline-none"
				/>
			</div>
		</div>
	);
}
