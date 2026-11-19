import { Button } from "@repo/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useToggleFavourite } from "@/features/workspace/api/mutations";
import { favouritesQuery } from "@/features/workspace/api/queries";
import type { RecordRef } from "@/lib/records";

/** Page frame for a record: header on top, tabs on the left, properties on the right. */
export function RecordShell({
	header,
	panel,
	children,
}: {
	header: ReactNode;
	panel: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="flex min-h-[calc(100dvh-3.5rem)] flex-col lg:flex-row">
			<div className="min-w-0 flex-1">
				<div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-8">
					{header}
					<details className="group rounded-2xl border bg-card p-4 shadow-soft lg:hidden">
						<summary className="cursor-pointer list-none font-medium text-sm outline-none focus-visible:underline">
							<span className="group-open:hidden">Show details</span>
							<span className="hidden group-open:inline">Hide details</span>
						</summary>
						<div className="mt-4">{panel}</div>
					</details>
					{children}
				</div>
			</div>
			<aside
				aria-label="Properties"
				className="hidden w-80 shrink-0 border-l bg-muted/20 lg:block xl:w-88"
			>
				<div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto p-5">{panel}</div>
			</aside>
		</div>
	);
}

/** Inline-editable record title. Enter saves, Escape cancels. */
export function EditableTitle({
	value,
	onSave,
	label,
}: {
	value: string;
	onSave: (value: string) => void;
	label: string;
}) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value);
	const ref = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (editing) ref.current?.select();
	}, [editing]);

	const commit = () => {
		setEditing(false);
		const next = draft.trim();
		if (next && next !== value) onSave(next);
		else setDraft(value);
	};

	if (editing) {
		return (
			<input
				ref={ref}
				aria-label={label}
				value={draft}
				onChange={(event) => setDraft(event.target.value)}
				onBlur={commit}
				onKeyDown={(event) => {
					if (event.key === "Enter") commit();
					if (event.key === "Escape") {
						setDraft(value);
						setEditing(false);
					}
				}}
				className="-mx-2 w-full rounded-lg bg-muted px-2 font-semibold text-2xl tracking-tight outline-none ring-3 ring-ring/40"
			/>
		);
	}
	return (
		<button
			type="button"
			onClick={() => {
				setDraft(value);
				setEditing(true);
			}}
			aria-label={`Rename ${label}`}
			className="-mx-2 max-w-full truncate rounded-lg px-2 text-left font-semibold text-2xl tracking-tight outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
		>
			{value}
		</button>
	);
}

export function FavouriteButton({ record, label }: { record: RecordRef; label: string }) {
	const favourites = useQuery(favouritesQuery).data ?? [];
	const toggle = useToggleFavourite();
	const active = favourites.some((item) => item.type === record.type && item.id === record.id);
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-pressed={active}
					aria-label={active ? "Remove from favourites" : "Add to favourites"}
					onClick={() => toggle.mutate({ ...record, label })}
				>
					<Star className={cn(active && "fill-cat-yellow text-cat-yellow")} />
				</Button>
			</TooltipTrigger>
			<TooltipContent>{active ? "Remove from favourites" : "Add to favourites"}</TooltipContent>
		</Tooltip>
	);
}

export function PanelSection({
	title,
	children,
	action,
}: {
	title: string;
	children: ReactNode;
	action?: ReactNode;
}) {
	return (
		<section className="grid gap-2">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
					{title}
				</h2>
				{action}
			</div>
			{children}
		</section>
	);
}

/** One label/value row in the properties panel. */
export function PropertyRow({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="grid min-h-9 grid-cols-[7rem_1fr] items-center gap-2 text-sm">
			<span className="text-muted-foreground">{label}</span>
			<div className="min-w-0">{children}</div>
		</div>
	);
}
