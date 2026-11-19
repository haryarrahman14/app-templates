import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	ArrowUpRightIcon,
	BriefcaseBusinessIcon,
	GitBranchIcon,
	NotebookPenIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { widgetsQuery } from "@/features/desktop/api/queries";
import { formatShortDate } from "@/lib/format";
import { useNow } from "@/lib/use-now";
import { useWindows } from "@/lib/window-store";

function Widget({
	label,
	onClick,
	href,
	children,
	className,
}: {
	label: string;
	onClick?: () => void;
	/** An outside link, opened in a new tab. */
	href?: string;
	children: ReactNode;
	className?: string;
}) {
	const body = (
		<>
			<p className="mb-2 font-semibold text-[10.5px] text-muted-foreground uppercase tracking-[0.14em]">
				{label}
			</p>
			{children}
		</>
	);
	const base = cn("glass block w-full rounded-2xl p-4 text-left shadow-soft", className);
	const lift = "transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99]";
	if (href) {
		return (
			<a href={href} target="_blank" rel="noreferrer" className={cn(base, lift)}>
				{body}
			</a>
		);
	}
	return onClick ? (
		<button type="button" onClick={onClick} className={cn(base, lift)}>
			{body}
		</button>
	) : (
		<section className={base}>{body}</section>
	);
}

/** Right-hand widget column. Each widget that looks clickable opens the related app. */
export function Widgets({
	location,
	timeZone,
	latestNote,
	className,
}: {
	location: string;
	timeZone: string;
	latestNote?: { title: string; date: string };
	className?: string;
}) {
	const { data } = useSuspenseQuery(widgetsQuery);
	const { open } = useWindows();
	const now = useNow();

	const time = now?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
	const day = now?.toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		timeZone,
	});

	return (
		<aside aria-label="Widgets" className={cn("flex flex-col gap-3", className)}>
			<Widget label="Availability" onClick={() => open("contact")}>
				<div className="flex items-center gap-2">
					<span className="relative flex size-2.5">
						<span className="absolute inset-0 animate-ping rounded-full bg-green/60" />
						<span className="relative size-2.5 rounded-full bg-green" />
					</span>
					<p className="font-semibold">{data.availability.title}</p>
				</div>
				{data.availability.detail && (
					<p className="mt-1 text-muted-foreground text-sm leading-snug">
						{data.availability.detail}
					</p>
				)}
				<p className="mt-2 inline-flex items-center gap-1 font-medium text-sm text-tint-text">
					Get in touch
					<ArrowUpRightIcon className="size-3.5" />
				</p>
			</Widget>

			<Widget label={`Local time · ${location.split(",")[0]}`}>
				<p className="font-semibold text-4xl tracking-tight tabular-nums" suppressHydrationWarning>
					{time ?? "--:--"}
				</p>
				<p className="text-muted-foreground text-sm">{day ?? " "}</p>
			</Widget>

			{data.latestRole && (
				<Widget label="Latest role" onClick={() => open("experience")}>
					<div className="flex items-center gap-3">
						<span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-green text-white">
							<BriefcaseBusinessIcon className="size-4.5" />
						</span>
						<div className="min-w-0">
							<p className="font-medium text-sm leading-snug">{data.latestRole.title}</p>
							<p className="text-muted-foreground text-xs">
								{data.latestRole.company} · {data.latestRole.period}
							</p>
						</div>
					</div>
				</Widget>
			)}

			{latestNote && (
				<Widget label="Latest note" onClick={() => open("notes")}>
					<div className="flex items-center gap-3">
						<span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-yellow text-graphite">
							<NotebookPenIcon className="size-4.5" />
						</span>
						<div className="min-w-0">
							<p className="truncate font-medium text-sm">{latestNote.title}</p>
							<p className="text-muted-foreground text-xs">{formatShortDate(latestNote.date)}</p>
						</div>
					</div>
				</Widget>
			)}

			{data.github && (
				<Widget label="GitHub" href={data.github.url}>
					<div className="flex items-center gap-3">
						<span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-graphite text-white">
							<GitBranchIcon className="size-4.5" />
						</span>
						<div className="min-w-0">
							<p className="inline-flex items-center gap-1 font-medium text-sm">
								{data.github.handle}
								<ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
							</p>
							<p className="text-muted-foreground text-xs">
								{data.github.contributions.toLocaleString("en-GB")} contributions,{" "}
								{data.github.period}
							</p>
						</div>
					</div>
				</Widget>
			)}

			<Widget label="In numbers" onClick={() => open("experience")}>
				<dl className="grid grid-cols-3 gap-2">
					{data.stats.map((stat) => (
						<div key={stat.label}>
							<dt className="sr-only">{stat.label}</dt>
							<dd className="font-semibold text-lg tracking-tight">{stat.value}</dd>
							<dd className="text-[11px] text-muted-foreground leading-tight">{stat.label}</dd>
						</div>
					))}
				</dl>
			</Widget>
		</aside>
	);
}
