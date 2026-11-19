import { cn } from "@repo/ui/lib/cn";
import { ChartNoAxesColumn, Images, NotebookPen, Route, Wrench } from "lucide-react";
import { WidgetLabel, WidgetShell } from "@/features/widgets/components/widget-shell";

export function StatsWidget({
	stats,
	onOpen,
}: {
	stats: { items: { label: string; value: string }[] };
	onOpen: () => void;
}) {
	return (
		<WidgetShell label="Key figures. Open Experience" onOpen={onOpen}>
			<WidgetLabel icon={ChartNoAxesColumn}>In numbers</WidgetLabel>
			<dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 @xl:grid-cols-4">
				{stats.items.map((item, i) => (
					<div key={item.label} className={cn(i >= 2 && "hidden @xl:block")}>
						<dd className="font-semibold text-[26px] leading-none tracking-tight tabular-nums @xl:text-[30px]">
							{item.value}
						</dd>
						<dt className="mt-1 line-clamp-2 text-[12.5px] text-muted-foreground leading-snug">
							{item.label}
						</dt>
					</div>
				))}
			</dl>
		</WidgetShell>
	);
}

/** The latest roles, newest first. */
export function ExperienceWidget({
	roles,
	onOpen,
}: {
	roles: { company: string; title: string; years: string }[];
	onOpen: () => void;
}) {
	return (
		<WidgetShell label="Experience. Open Experience" onOpen={onOpen}>
			<WidgetLabel icon={Route}>Experience</WidgetLabel>
			<ul className="space-y-1.5">
				{roles.slice(0, 3).map((role) => (
					<li key={role.company} className="flex items-baseline gap-2 text-[13.5px] leading-snug">
						<span className="shrink-0 font-semibold">{role.company}</span>
						<span className="min-w-0 flex-1 truncate text-muted-foreground">{role.title}</span>
						<span className="shrink-0 text-[12px] text-muted-foreground tabular-nums">
							{role.years}
						</span>
					</li>
				))}
			</ul>
		</WidgetShell>
	);
}

export function NotesStackWidget({
	notes,
	onOpen,
}: {
	notes: { id: string; title: string; date: string; excerpt: string }[];
	onOpen: () => void;
}) {
	const [top, ...rest] = notes;
	return (
		<WidgetShell label={`Notes: ${top?.title ?? "open Notes"}`} onOpen={onOpen}>
			<WidgetLabel icon={NotebookPen} className="text-muted-foreground">
				Notes
			</WidgetLabel>
			<div className="relative mt-2 flex-1">
				{rest
					.slice(0, 2)
					.reverse()
					.map((note, i, arr) => {
						const depth = arr.length - i;
						return (
							<div
								key={note.id}
								aria-hidden
								className="absolute inset-x-0 top-0 h-full rounded-2xl border border-border/60 bg-card shadow-soft"
								style={{
									transform: `translateY(${depth * -7}px) scale(${1 - depth * 0.06})`,
									opacity: 1 - depth * 0.25,
								}}
							/>
						);
					})}
				{top ? (
					<div className="absolute inset-0 rounded-2xl border border-border/60 bg-card px-3.5 py-3 shadow-soft">
						<p className="truncate font-semibold text-[14px]">{top.title}</p>
						<p className="mt-0.5 line-clamp-2 text-[12.5px] text-muted-foreground leading-snug">
							<span className="text-foreground/70">{top.date}</span> {top.excerpt}
						</p>
					</div>
				) : null}
			</div>
		</WidgetShell>
	);
}

export function SkillsWidget({ skills, onOpen }: { skills: string[]; onOpen: () => void }) {
	return (
		<WidgetShell label="Skills and tools. Open About" onOpen={onOpen}>
			<WidgetLabel icon={Wrench}>Skills & tools</WidgetLabel>
			<ul className="flex min-h-0 flex-1 flex-wrap content-start gap-1.5 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
				{skills.map((skill) => (
					<li key={skill} className="rounded-full bg-shade/6 px-2.5 py-1 font-medium text-[12px]">
						{skill}
					</li>
				))}
			</ul>
		</WidgetShell>
	);
}

export function GalleryWidget({
	items,
	onOpen,
}: {
	items: { id: string; src: string; alt: string }[];
	onOpen: () => void;
}) {
	return (
		<WidgetShell label="Gallery: screenshots of the work" onOpen={onOpen}>
			<WidgetLabel icon={Images} className="text-muted-foreground">
				Gallery
			</WidgetLabel>
			<div className="grid min-h-0 flex-1 grid-cols-3 gap-1.5">
				{items.slice(0, 3).map((item, i) => (
					<img
						key={item.id}
						src={item.src}
						alt=""
						loading="lazy"
						className={cn(
							"h-full min-h-0 w-full rounded-xl bg-secondary object-cover object-top transition-transform duration-500 ease-sheet",
							i === 1 && "group-hover/widget:-translate-y-1",
						)}
					/>
				))}
			</div>
		</WidgetShell>
	);
}
