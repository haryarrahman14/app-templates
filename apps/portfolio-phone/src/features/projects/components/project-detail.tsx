import { cn } from "@repo/ui/lib/cn";
import { Check, Globe, Images, SearchX, Share } from "lucide-react";
import { AppScreen } from "@/components/kit/app-screen";
import { InsetRow, InsetSection } from "@/components/kit/inset-list";
import { ProjectArt } from "@/features/projects/components/project-art";
import type { Project } from "@/features/projects/schemas/project";
import { usePhoneNav } from "@/lib/phone-nav";
import { useShareLink } from "@/lib/share";

export function ProjectDetail({ project }: { project: Project | undefined }) {
	const nav = usePhoneNav();
	const share = useShareLink();
	const back = { label: "Projects", onClick: nav.back };

	if (!project) {
		return (
			<AppScreen title="Not found" back={back} largeTitle={false}>
				<div className="flex flex-col items-center px-8 pt-24 text-center">
					<SearchX className="size-10 text-muted-foreground" />
					<p className="mt-3 font-semibold text-[17px]">This project moved</p>
					<p className="mt-1 text-[14px] text-muted-foreground">
						The link may be old. Every project is in the list.
					</p>
				</div>
			</AppScreen>
		);
	}

	const cover = project.gallery.find((shot) => shot.kind === "web");

	return (
		<AppScreen
			title={project.name}
			back={back}
			largeTitle={false}
			trailing={
				<button
					type="button"
					aria-label={`Share ${project.name}`}
					onClick={() => share(project.name, "projects", project.slug)}
					className="grid size-9 place-items-center rounded-lg text-tint-text outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
				>
					<Share className="size-[19px]" />
				</button>
			}
		>
			<div className="flex flex-col gap-7">
				<div className="mx-4 overflow-hidden rounded-[22px] shadow-soft">
					{cover ? (
						<img
							src={cover.src}
							alt={cover.alt}
							className="aspect-[16/10] w-full bg-foreground/[0.04] object-cover object-top"
						/>
					) : (
						<ProjectArt project={project} className="h-44" />
					)}
				</div>
				<header className="-mt-2 px-5">
					<p className="font-medium text-[12.5px] text-tint-text uppercase tracking-wide">
						{project.kind} · {project.period}
					</p>
					<h1 className="mt-0.5 font-bold text-[28px] leading-tight tracking-[-0.02em]">
						{project.name}
					</h1>
					<p className="mt-2 text-[15px] text-foreground/80 leading-relaxed">{project.summary}</p>
				</header>

				{project.metrics.length ? (
					<div
						className={cn(
							"mx-4 grid gap-2",
							project.metrics.length === 1
								? "grid-cols-1"
								: project.metrics.length === 2
									? "grid-cols-2"
									: "grid-cols-3",
						)}
					>
						{project.metrics.map((metric) => (
							<div
								key={metric.label}
								className="rounded-[14px] bg-(--grouped-card) px-3 py-3 shadow-[0_0_0_0.5px_var(--grouped-line)]"
							>
								<p className="font-semibold text-[19px] tabular-nums tracking-tight">
									{metric.value}
								</p>
								<p className="text-[12px] text-muted-foreground leading-tight">{metric.label}</p>
							</div>
						))}
					</div>
				) : null}

				<InsetSection header="Details">
					<InsetRow label="Kind" value={project.kind} />
					<InsetRow label="Status" value={project.status} />
					<InsetRow label="Period" value={project.period} />
					{project.links.map((link) => (
						<InsetRow
							key={link.href}
							icon={Globe}
							iconBackground="#007AFF"
							label={link.label}
							href={link.href}
						/>
					))}
				</InsetSection>

				<InsetSection header="Stack">
					<div className="flex flex-wrap gap-1.5 px-4 py-3.5">
						{project.stack.map((item) => (
							<span
								key={item}
								className="rounded-full bg-tint/10 px-2.5 py-1 font-medium text-[13px] text-tint-text"
							>
								{item}
							</span>
						))}
					</div>
				</InsetSection>

				<InsetSection header="Highlights">
					{project.highlights.map((line) => (
						<InsetRow
							key={line}
							leading={
								<span className="grid size-5 shrink-0 place-items-center self-start rounded-full bg-tint/12 text-tint-text mt-3">
									<Check className="size-3" strokeWidth={3} />
								</span>
							}
							label={<span className="whitespace-normal">{line}</span>}
						/>
					))}
				</InsetSection>

				{project.gallery.length ? (
					<>
						<section>
							<h2 className="mb-2 px-8 font-medium text-[12.5px] text-muted-foreground uppercase tracking-wide">
								Gallery
							</h2>
							<div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1">
								{project.gallery.map((shot) => (
									<figure
										key={shot.src}
										className={cn(
											"shrink-0 snap-start",
											shot.kind === "phone" ? "w-[38%]" : "w-[82%]",
										)}
									>
										<img
											src={shot.src}
											alt={shot.alt}
											loading="lazy"
											className={cn(
												"w-full rounded-[18px] bg-foreground/[0.04] object-cover object-top shadow-soft",
												shot.kind === "phone" ? "aspect-[9/16]" : "aspect-[16/10]",
											)}
										/>
										<figcaption className="mt-1.5 px-1 text-[12.5px] text-muted-foreground leading-snug">
											{shot.caption}
										</figcaption>
									</figure>
								))}
							</div>
						</section>

						<InsetSection>
							<InsetRow icon={Images} label="All shots" onClick={() => nav.open("photos")} />
						</InsetSection>
					</>
				) : null}
			</div>
		</AppScreen>
	);
}
