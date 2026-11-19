import { cn } from "@repo/ui/lib/cn";
import { ArrowUpRight, MessageCircle, NotebookPen } from "lucide-react";
import type { ReactNode } from "react";
import type { HomeWidgets } from "@/features/home-screen/schemas/widgets";
import type { AppId } from "@/lib/apps";
import { COLORS, CONTENT_ICONS, colorFill } from "@/lib/icons";
import { setLaunchOrigin, usePhoneNav } from "@/lib/phone-nav";

export type HomeOwner = {
	name: string;
	initials: string;
	headline: string;
	/** In his words, e.g. "Available now · Remote or Jakarta"; empty hides the widget. */
	availability: string;
};

/** A tappable frosted widget that opens an app (and item) with the zoom transition. */
function Widget({
	app,
	id,
	label,
	className,
	children,
}: {
	app: AppId;
	id?: string;
	label: string;
	className?: string;
	children: ReactNode;
}) {
	const nav = usePhoneNav();
	return (
		<button
			type="button"
			aria-label={label}
			onClick={(event) => {
				setLaunchOrigin(event.currentTarget);
				nav.open(app, id);
			}}
			className={cn(
				"relative overflow-hidden rounded-[24px] border border-(--wall-card-border) bg-(--wall-card) p-3.5 text-left text-(--wall-card-text) shadow-soft outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
				className,
			)}
		>
			{children}
		</button>
	);
}

const caption = "block font-semibold text-[11px] uppercase tracking-wide opacity-55";

export function ProfileWidget({ owner }: { owner: HomeOwner }) {
	return (
		<Widget
			app="about"
			label={`About ${owner.name}`}
			className="col-span-4 flex items-center gap-3.5"
		>
			<span className="grid size-[64px] shrink-0 place-items-center rounded-full bg-[#EAEAEA] font-semibold text-[#121212] text-[22px] dark:bg-[#2A2A2A] dark:text-white">
				{owner.initials}
			</span>
			<span className="min-w-0 flex-1">
				<span className={caption}>Hello, I'm</span>
				<span className="block truncate font-semibold text-[19px] leading-tight tracking-tight">
					{owner.name}
				</span>
				<span className="line-clamp-2 block text-[13px] leading-snug opacity-70">
					{owner.headline}
				</span>
				<span className="mt-1.5 inline-flex items-center gap-1 font-medium text-[12.5px] text-tint-text">
					About me <ArrowUpRight className="size-3.5" />
				</span>
			</span>
		</Widget>
	);
}

export function AvailabilityWidget({ owner }: { owner: HomeOwner }) {
	const [label, ...rest] = owner.availability.split(" · ");
	return (
		<Widget app="contact" label={`${owner.availability}: contact`} className="col-span-2">
			<span className="flex items-center gap-1.5">
				<span className="size-2 shrink-0 rounded-full bg-[#34C759] shadow-[0_0_0_3px_#34C75938]" />
				<span className="font-semibold text-[14px]">{label}</span>
			</span>
			{rest.length ? (
				<span className="mt-1 line-clamp-2 block text-[12px] leading-snug opacity-65">
					{rest.join(" · ")}
				</span>
			) : null}
		</Widget>
	);
}

export function StatsWidget({ stats }: { stats: HomeWidgets["stats"] }) {
	return (
		<Widget app="experience" label="Stats: open experience" className="col-span-2 grid grid-cols-3">
			{stats.map((stat) => (
				<span key={stat.label} className="flex flex-col items-center">
					<span className="font-semibold text-[20px] tabular-nums leading-tight tracking-tight">
						{stat.value}
					</span>
					<span className="text-[10.5px] opacity-60">{stat.label}</span>
				</span>
			))}
		</Widget>
	);
}

export function FeaturedWidget({ featured }: { featured: NonNullable<HomeWidgets["featured"]> }) {
	const Icon = CONTENT_ICONS[featured.icon];
	return (
		<Widget
			app="projects"
			id={featured.projectSlug}
			label={`Featured project: ${featured.title}`}
			className="col-span-4 flex h-[184px] flex-col border-0 p-0"
		>
			<span className="absolute inset-0" style={{ background: COLORS[featured.color].fill }} />
			<span
				className="relative flex flex-1 flex-col p-4"
				style={{ color: COLORS[featured.color].glyph }}
			>
				<span className="flex items-center justify-between">
					<span className="font-semibold text-[11px] uppercase tracking-wide opacity-85">
						Featured project
					</span>
					<span className="grid size-9 place-items-center rounded-[11px] bg-white/20">
						<Icon className="size-5" />
					</span>
				</span>
				<span className="mt-auto font-semibold text-[22px] tracking-tight">{featured.title}</span>
				<span className="line-clamp-2 text-[13px] leading-snug opacity-90">{featured.blurb}</span>
			</span>
		</Widget>
	);
}

export function NoteWidget({ note }: { note: NonNullable<HomeWidgets["latestNote"]> }) {
	return (
		<Widget
			app="notes"
			id={note.noteSlug}
			label={`Latest note: ${note.title}`}
			className="col-span-4 flex gap-3"
		>
			<span
				className="grid size-10 shrink-0 place-items-center rounded-[12px]"
				style={colorFill("yellow")}
			>
				<NotebookPen className="size-5" />
			</span>
			<span className="min-w-0">
				<span className={caption}>Latest note</span>
				<span className="block font-semibold text-[15px] leading-snug tracking-tight">
					{note.title}
				</span>
				<span className="line-clamp-2 text-[12.5px] leading-snug opacity-65">{note.excerpt}</span>
			</span>
		</Widget>
	);
}

export function AskWidget({ prompt }: { prompt: string }) {
	return (
		<Widget app="messages" label="Ask me anything" className="col-span-4 flex items-center gap-3">
			<span
				className="grid size-10 shrink-0 place-items-center rounded-full"
				style={colorFill("orange")}
			>
				<MessageCircle className="size-5" />
			</span>
			<span className="min-w-0 flex-1 text-[14px] leading-snug">{prompt}</span>
			<ArrowUpRight className="size-4 shrink-0 opacity-50" />
		</Widget>
	);
}
