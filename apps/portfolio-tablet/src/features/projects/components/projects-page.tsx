import { Button } from "@repo/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Mail } from "lucide-react";
import { MasterDetail, SidebarLabel, SidebarRow } from "@/components/kit/master-detail";
import { Chip, PageBody } from "@/components/kit/page";
import { Placeholder } from "@/components/kit/placeholder";
import { projectsQuery } from "@/features/projects/api/queries";
import type { Project } from "@/features/projects/schemas/project";
import type { AppViewProps } from "@/lib/apps";

export function ProjectsPage({ itemId, onItemChange, openApp }: AppViewProps) {
	const { data: projects } = useSuspenseQuery(projectsQuery);
	const selected = projects.find((p) => p.slug === itemId) ?? projects[0];

	return (
		<MasterDetail
			backLabel="Projects"
			hasSelection={itemId !== undefined}
			onBack={() => onItemChange(undefined)}
			sidebar={
				<>
					<SidebarLabel>{projects.length} projects</SidebarLabel>
					<div className="space-y-1">
						{projects.map((project) => (
							<SidebarRow
								key={project.slug}
								active={selected?.slug === project.slug}
								onClick={() => onItemChange(project.slug)}
								icon={
									<Placeholder
										swatch={project.swatch}
										className="size-10 shrink-0 rounded-[11px]"
									/>
								}
								title={project.title}
								subtitle={`${project.year} · ${project.category}`}
							/>
						))}
					</div>
				</>
			}
			detail={
				selected ? <ProjectDetail project={selected} onContact={() => openApp("contact")} /> : null
			}
		/>
	);
}

function ProjectDetail({ project, onContact }: { project: Project; onContact: () => void }) {
	return (
		<article key={project.slug} className="@container/detail">
			<Placeholder
				swatch={project.swatch}
				label={`Cover for ${project.title}`}
				className="mx-4 mt-4 flex h-56 items-end rounded-[22px] p-6 @2xl/md:mx-8 @2xl/md:mt-6 @2xl/md:h-72"
			>
				<div className="relative">
					<p className="font-medium text-[13px] opacity-80">
						{project.category} · {project.year}
					</p>
					<h2 className="font-semibold text-[32px] leading-tight tracking-tight">
						{project.title}
					</h2>
				</div>
			</Placeholder>
			<PageBody className="max-w-none px-4 pt-6 @2xl:pt-6">
				<p className="mb-1 font-medium text-[13px] text-tint-text">{project.tagline}</p>
				<p className="mb-6 text-[18px] leading-snug tracking-tight">{project.summary}</p>

				{project.metrics.length > 0 ? (
					<dl className="mb-8 grid grid-cols-2 gap-3 @lg/detail:grid-cols-3">
						{project.metrics.map((metric) => (
							<div
								key={metric.label}
								className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-soft"
							>
								<dt className="text-[12.5px] text-muted-foreground">{metric.label}</dt>
								<dd className="font-semibold text-[22px] tracking-tight">{metric.value}</dd>
							</div>
						))}
					</dl>
				) : null}

				<div className="mb-8 grid gap-6 @2xl/detail:grid-cols-[1fr_14rem]">
					<ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/85 leading-relaxed marker:text-tint-text">
						{project.bullets.map((bullet) => (
							<li key={bullet}>{bullet}</li>
						))}
					</ul>
					<aside className="space-y-5 text-[14px]">
						<div>
							<h3 className="mb-1.5 font-medium text-[12px] text-muted-foreground uppercase tracking-[0.08em]">
								Status
							</h3>
							<p>{project.status}</p>
						</div>
						<div>
							<h3 className="mb-2 font-medium text-[12px] text-muted-foreground uppercase tracking-[0.08em]">
								Stack
							</h3>
							<div className="flex flex-wrap gap-1.5">
								{project.stack.map((item) => (
									<Chip key={item}>{item}</Chip>
								))}
							</div>
						</div>
						{project.links.length > 0 ? (
							<div>
								<h3 className="mb-1.5 font-medium text-[12px] text-muted-foreground uppercase tracking-[0.08em]">
									Live
								</h3>
								{project.links.map((link) => (
									<a
										key={link.url}
										href={link.url}
										target="_blank"
										rel="noreferrer"
										className="flex items-center gap-1 break-all font-medium text-tint-text"
									>
										{link.label}
										<ArrowUpRight className="size-3.5 shrink-0" />
									</a>
								))}
							</div>
						) : null}
					</aside>
				</div>

				{project.gallery.length > 0 ? (
					<>
						<h3 className="mb-3 font-medium text-[12px] text-muted-foreground uppercase tracking-[0.08em]">
							Screenshots
						</h3>
						<div className="mb-8 grid items-start gap-3 @lg/detail:grid-cols-2">
							{project.gallery.map((shot) => (
								<figure
									key={shot.src}
									className={shot.kind === "phone" ? "mx-auto w-1/2" : undefined}
								>
									<img
										src={shot.src}
										alt={shot.alt}
										loading="lazy"
										style={{ aspectRatio: shot.ratio }}
										className="w-full rounded-2xl border border-border/50 bg-secondary object-cover"
									/>
									<figcaption className="mt-2 text-[13px] text-muted-foreground">
										{shot.caption}
									</figcaption>
								</figure>
							))}
						</div>
					</>
				) : null}

				<div className="flex flex-wrap gap-2">
					<Button onClick={onContact}>
						<Mail />
						Get in touch
					</Button>
				</div>
			</PageBody>
		</article>
	);
}
