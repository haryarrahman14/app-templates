import { cn } from "@repo/ui/lib/cn";
import { X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { z } from "zod";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { fullName, type Person } from "@/features/people/schemas/person";

const isEmail = (value: string) => z.email().safeParse(value).success;

/** Chips for recipients, with autocomplete over people records. Free-typed emails are allowed. */
export function RecipientInput({
	value,
	onChange,
	people,
	invalid,
	describedBy,
}: {
	value: string[];
	onChange: (next: string[]) => void;
	people: Person[];
	invalid?: boolean;
	describedBy?: string;
}) {
	const [text, setText] = useState("");
	const [active, setActive] = useState(0);
	const [focused, setFocused] = useState(false);
	const listId = useId();

	const byEmail = useMemo(() => new Map(people.map((person) => [person.email, person])), [people]);
	const suggestions = useMemo(() => {
		const needle = text.trim().toLowerCase();
		if (!needle) return [];
		return people
			.filter(
				(person) =>
					!value.includes(person.email) &&
					`${fullName(person)} ${person.email}`.toLowerCase().includes(needle),
			)
			.slice(0, 5);
	}, [people, text, value]);

	const add = (email: string) => {
		if (!value.includes(email)) onChange([...value, email]);
		setText("");
		setActive(0);
	};

	const commitText = () => {
		const candidate = text.trim().replace(/,$/, "");
		if (isEmail(candidate)) add(candidate);
	};

	const open = focused && suggestions.length > 0;

	return (
		<div className="relative flex-1">
			<div className="flex flex-wrap items-center gap-1 py-1">
				{value.map((email) => {
					const person = byEmail.get(email);
					return (
						<span
							key={email}
							className="inline-flex h-6 items-center gap-1 rounded-full bg-muted py-0.5 pr-1 pl-1 text-xs"
						>
							{person ? <InitialsAvatar name={fullName(person)} size="xs" /> : null}
							<span className="max-w-40 truncate pl-0.5">{person ? fullName(person) : email}</span>
							<button
								type="button"
								onClick={() => onChange(value.filter((item) => item !== email))}
								className="rounded-full p-0.5 text-muted-foreground outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
								aria-label={`Remove ${person ? fullName(person) : email}`}
							>
								<X className="size-3" />
							</button>
						</span>
					);
				})}
				<input
					value={text}
					onChange={(event) => {
						const next = event.target.value;
						if (next.endsWith(",")) {
							const candidate = next.slice(0, -1).trim();
							if (isEmail(candidate)) {
								add(candidate);
								return;
							}
						}
						setText(next);
						setActive(0);
					}}
					onFocus={() => setFocused(true)}
					onBlur={() => {
						setFocused(false);
						commitText();
					}}
					onKeyDown={(event) => {
						if (event.key === "ArrowDown" && open) {
							event.preventDefault();
							setActive((index) => (index + 1) % suggestions.length);
						} else if (event.key === "ArrowUp" && open) {
							event.preventDefault();
							setActive((index) => (index - 1 + suggestions.length) % suggestions.length);
						} else if (event.key === "Enter") {
							event.preventDefault();
							const pick = open ? suggestions[active] : undefined;
							if (pick) add(pick.email);
							else commitText();
						} else if (event.key === "Backspace" && !text && value.length) {
							onChange(value.slice(0, -1));
						}
					}}
					placeholder={value.length ? "" : "Name or email"}
					aria-label="To"
					aria-invalid={invalid || undefined}
					aria-describedby={describedBy}
					role="combobox"
					aria-expanded={open}
					aria-controls={listId}
					aria-autocomplete="list"
					aria-activedescendant={open ? `${listId}-${active}` : undefined}
					className="h-7 min-w-32 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
				/>
			</div>
			{open ? (
				<div
					id={listId}
					role="listbox"
					className="absolute top-full left-0 z-10 mt-1 w-full max-w-80 overflow-hidden rounded-xl border bg-popover p-1 shadow-float"
				>
					{suggestions.map((person, index) => (
						<div
							key={person.id}
							id={`${listId}-${index}`}
							role="option"
							tabIndex={-1}
							aria-selected={index === active}
							// Keep focus in the input while picking with the mouse.
							onMouseDown={(event) => {
								event.preventDefault();
								add(person.email);
							}}
							onMouseEnter={() => setActive(index)}
							className={cn(
								"flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
								index === active && "bg-muted",
							)}
						>
							<InitialsAvatar name={fullName(person)} size="sm" />
							<span className="min-w-0">
								<span className="block truncate">{fullName(person)}</span>
								<span className="block truncate text-muted-foreground text-xs">{person.email}</span>
							</span>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}
