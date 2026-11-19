import { Button } from "@repo/ui/components/button";
import { ThemeToggle } from "@repo/ui/components/theme-toggle";
import { ArrowUpRight, FileDown, Hand, Mail } from "lucide-react";

type PanelProps = {
	owner: {
		name: string;
		headline: string;
		pitch: string;
		email: string;
		/** In his words; empty hides the line. */
		availability: string;
	};
	projects: { slug: string; name: string; tagline: string }[];
	onDownloadCv: () => void;
	onOpenProject: (slug: string) => void;
};

/**
 * The text beside the phone: who this is, how to reach them, and a plain project list.
 * Everything here is server-rendered, so search engines and screen readers get the real
 * content; on phone widths it stays in the HTML but is visually hidden.
 */
export function DevicePanel({ owner, projects, onDownloadCv, onOpenProject }: PanelProps) {
	return (
		<aside className="max-sm:sr-only sm:w-full sm:max-w-[400px] lg:max-w-[320px]">
			{owner.availability ? (
				<div className="flex items-center gap-2 text-[13px] text-muted-foreground">
					<span className="size-2 rounded-full bg-[#34C759] shadow-[0_0_0_3px_#34C75933]" />
					{owner.availability}
				</div>
			) : null}
			<h1 className="mt-3 font-semibold text-[34px] leading-[1.05] tracking-[-0.03em]">
				{owner.name}
			</h1>
			<p className="mt-1 font-medium text-[17px] text-tint-text tracking-tight">{owner.headline}</p>
			<p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{owner.pitch}</p>

			<div className="mt-5 flex flex-wrap items-center gap-2">
				<Button asChild size="lg" className="rounded-full px-4">
					<a href={`mailto:${owner.email}`}>
						<Mail /> Email me
					</a>
				</Button>
				<Button size="lg" variant="outline" className="rounded-full px-4" onClick={onDownloadCv}>
					<FileDown /> Download CV
				</Button>
				<ThemeToggle />
			</div>

			<p className="mt-6 flex items-center gap-2 text-[13px] text-muted-foreground">
				<Hand className="size-4 text-tint-text" />
				Tap around; it works. Swipe, long-press, or use the arrow keys.
			</p>

			<nav aria-label="Projects" className="mt-8 border-border/60 border-t pt-5">
				<h2 className="font-medium text-[12px] text-muted-foreground uppercase tracking-wide">
					Selected work
				</h2>
				<ul className="mt-2 flex flex-col">
					{projects.map((project) => (
						<li key={project.slug}>
							<a
								href={`/?app=projects&id=${project.slug}`}
								onClick={(event) => {
									if (event.metaKey || event.ctrlKey || event.shiftKey) return;
									event.preventDefault();
									onOpenProject(project.slug);
								}}
								className="group -mx-2 flex items-baseline gap-3 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring/50"
							>
								<span className="font-medium text-[14px]">{project.name}</span>
								<span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
									{project.tagline}
								</span>
								<ArrowUpRight className="size-3.5 shrink-0 self-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
							</a>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
