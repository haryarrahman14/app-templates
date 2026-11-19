import { Button } from "@repo/ui/components/button";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Avatar } from "@/components/kit/avatar";
import { WidgetShell } from "@/features/widgets/components/widget-shell";
import type { Swatch } from "@/lib/palette";

export function ProfileWidget({
	profile,
	onOpen,
	onWork,
	onContact,
}: {
	profile: { name: string; initials: string; role: string; pitch: string; location: string };
	onOpen: () => void;
	onWork: () => void;
	onContact: () => void;
}) {
	return (
		<WidgetShell label={`About ${profile.name}`} onOpen={onOpen} contentClassName="p-5 @md:p-6">
			<div className="flex items-center gap-3">
				<Avatar initials={profile.initials} className="size-14 text-[19px]" />
				<div className="min-w-0">
					<h1 className="truncate font-semibold text-[22px] leading-tight tracking-tight">
						{profile.name}
					</h1>
					<p className="truncate text-[13.5px] text-muted-foreground">{profile.role}</p>
				</div>
			</div>
			<p className="mt-4 line-clamp-4 text-[15px] text-foreground/80 leading-relaxed @md:text-[16px]">
				{profile.pitch}
			</p>
			<p className="mt-2 flex items-center gap-1 text-[12.5px] text-muted-foreground">
				<MapPin className="size-3.5" />
				{profile.location}
			</p>
			<div className="pointer-events-auto relative z-10 mt-auto flex gap-2 pt-3">
				<Button onClick={onWork} className="h-9 rounded-full px-4">
					See work
					<ArrowRight />
				</Button>
				<Button
					variant="outline"
					onClick={onContact}
					className="h-9 rounded-full bg-background/60 px-4"
				>
					Contact
				</Button>
			</div>
		</WidgetShell>
	);
}

export function FeaturedProjectWidget({
	project,
	onOpen,
}: {
	project: {
		title: string;
		summary: string;
		category: string;
		year: string;
		swatch: Swatch;
		metrics: { label: string; value: string }[];
	};
	onOpen: () => void;
}) {
	return (
		<WidgetShell
			label={`Featured project: ${project.title}`}
			onOpen={onOpen}
			className="border-0"
			contentClassName="p-5 text-white @md:p-6"
			background={
				<div
					aria-hidden
					className="absolute inset-0 bg-teal-deep transition-transform duration-500 ease-sheet group-hover/widget:scale-[1.03]"
				/>
			}
		>
			<span className="inline-flex w-fit items-center gap-1 rounded-full bg-aqua px-2.5 py-1 font-semibold text-[11.5px] text-teal-deep">
				<Star className="size-3 fill-teal-deep" />
				Featured
			</span>
			<div className="mt-auto">
				<p className="text-[12.5px] text-aqua">
					{project.category} · {project.year}
				</p>
				<h2 className="font-semibold text-[26px] leading-tight tracking-tight">{project.title}</h2>
				<p className="mt-1 line-clamp-2 text-[14px] text-white/85">{project.summary}</p>
				<div className="mt-3 flex flex-wrap gap-1.5">
					{project.metrics.slice(0, 3).map((m) => (
						<span
							key={m.label}
							className="rounded-full bg-white/12 px-2.5 py-1 font-medium text-[12px]"
						>
							<b className="font-semibold">{m.value}</b> {m.label.toLowerCase()}
						</span>
					))}
				</div>
			</div>
		</WidgetShell>
	);
}
