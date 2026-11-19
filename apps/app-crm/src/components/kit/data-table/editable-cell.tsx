import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { cn } from "@repo/ui/lib/cn";
import { Pencil } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Click (or Enter) to edit text in place. Enter or blur saves, Escape cancels.
 * `validate` returns an error message to keep the editor open.
 */
export function EditableTextCell({
	value,
	onSave,
	label,
	placeholder = "Empty",
	validate,
	className,
	inputType = "text",
}: {
	value: string;
	onSave: (value: string) => void;
	label: string;
	placeholder?: string;
	validate?: (value: string) => string | null;
	className?: string;
	inputType?: "text" | "email" | "number";
}) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editing) inputRef.current?.select();
	}, [editing]);

	const commit = () => {
		const next = draft.trim();
		const problem = validate?.(next) ?? null;
		if (problem) {
			setError(problem);
			return;
		}
		setEditing(false);
		setError(null);
		if (next !== value) onSave(next);
	};

	if (editing) {
		return (
			<div className="relative">
				<input
					ref={inputRef}
					type={inputType}
					aria-label={label}
					aria-invalid={Boolean(error)}
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onBlur={commit}
					onKeyDown={(event) => {
						if (event.key === "Enter") commit();
						if (event.key === "Escape") {
							setDraft(value);
							setError(null);
							setEditing(false);
						}
					}}
					className="-mx-2 h-8 w-[calc(100%+1rem)] rounded-lg border border-ring bg-background px-2 text-sm outline-none ring-3 ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
				/>
				{error ? (
					<p
						role="alert"
						className="absolute top-full left-0 z-10 mt-1 rounded-md bg-destructive px-2 py-0.5 text-destructive-foreground text-xs"
					>
						{error}
					</p>
				) : null}
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={(event) => {
				event.stopPropagation();
				setDraft(value);
				setEditing(true);
			}}
			aria-label={`Edit ${label}`}
			className={cn(
				"group/edit -mx-2 flex h-8 w-[calc(100%+1rem)] min-w-0 items-center gap-1.5 rounded-lg px-2 text-left outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
				className,
			)}
		>
			<span className={cn("truncate", !value && "text-muted-foreground")}>
				{value || placeholder}
			</span>
			<Pencil className="ml-auto size-3 shrink-0 opacity-0 transition group-hover/edit:opacity-50 group-focus-visible/edit:opacity-50" />
		</button>
	);
}

/** A cell that shows `children` (e.g. a pill) and opens a menu of options to change it. */
export function EditableSelectCell({
	value,
	options,
	onSave,
	label,
	children,
}: {
	value: string;
	options: readonly { value: string; label: string }[];
	onSave: (value: string) => void;
	label: string;
	children: ReactNode;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={`Change ${label}`}
				className="-mx-1.5 inline-flex h-8 items-center rounded-lg px-1.5 outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted"
			>
				{children}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="min-w-40 rounded-xl">
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(next) => next !== value && onSave(next)}
				>
					{options.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value}>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
