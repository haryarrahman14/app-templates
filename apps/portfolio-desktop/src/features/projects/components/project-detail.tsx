import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { ArrowUpRightIcon } from "lucide-react";
import { ProjectThumb } from "@/features/projects/components/project-thumb";
import type { Project } from "@/features/projects/schemas/project";

const heading = "mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-[0.12em]";

export function ProjectDetail({ project }: { project: Project }) {
	const facts = [
		{ label: "Status", value: project.status },
		{ label: "Company", value: project.company },
		{ label: "Client in", value: project.place },
	].filter((fact): fact is { label: string; value: string } => !!fact.value);
	const shots = project.gallery.filter((shot) => shot.src);

	return (
		<article className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-7 md:px-8">
			<header className="flex items-start gap-5">
				<ProjectThumb project={project} className="size-20 shrink-0 rounded-2xl shadow-soft" />
				<div className="min-w-0">
					<p className="text-muted-foreground text-xs uppercase tracking-[0.12em]">
						{[project.kind, project.period].filter(Boolean).join(" · ")}
					</p>
					<h1 className="mt-1 font-semibold text-2xl tracking-tight">{project.title}</h1>
					<p className="text-muted-foreground">{project.tagline}</p>
					{project.links.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-2">
							{project.links.map((link) => (
								<Button
									key={link.href}
									variant="outline"
									size="sm"
									className="rounded-full"
									asChild
								>
									<a href={link.href} target="_blank" rel="noreferrer">
										{link.label}
										<ArrowUpRightIcon />
									</a>
								</Button>
							))}
						</div>
					)}
				</div>
			</header>

			<div className="grid gap-6 md:grid-cols-[1fr_200px]">
				<div className="flex flex-col gap-4">
					{project.summary && (
						<p className="text-[15px] text-foreground/85 leading-relaxed">{project.summary}</p>
					)}
					{project.highlights.length > 0 && (
						<ul className="flex list-disc flex-col gap-1.5 pl-4 text-[15px] text-foreground/80 marker:text-foreground/30">
							{project.highlights.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					)}
				</div>
				<dl className="flex flex-col gap-3 text-sm">
					{facts.map((fact) => (
						<div key={fact.label}>
							<dt className="text-muted-foreground text-xs">{fact.label}</dt>
							<dd className="font-medium">{fact.value}</dd>
						</div>
					))}
					{project.stack.length > 0 && (
						<div>
							<dt className="mb-1 text-muted-foreground text-xs">Stack</dt>
							<dd className="flex flex-wrap gap-1">
								{project.stack.map((item) => (
									<Badge key={item} variant="secondary" className="font-normal">
										{item}
									</Badge>
								))}
							</dd>
						</div>
					)}
				</dl>
			</div>

			{project.metrics.length > 0 && (
				<section>
					<h2 className={heading}>Results</h2>
					<div className="grid gap-3 sm:grid-cols-3">
						{project.metrics.map((metric) => (
							<div key={metric.label} className="rounded-xl bg-foreground/[0.035] p-4">
								<p className="font-semibold text-2xl text-tint tracking-tight tabular-nums">
									{metric.value}
								</p>
								<p className="text-muted-foreground text-sm">{metric.label}</p>
							</div>
						))}
					</div>
				</section>
			)}

			{shots.length > 0 && (
				<section>
					<h2 className={heading}>Gallery</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{shots.map((shot, index) => {
							const tall = (shot.height ?? 0) > (shot.width ?? 1);
							return (
								<figure
									key={shot.src}
									className={index === 0 && !tall ? "sm:col-span-2" : undefined}
								>
									<div className="overflow-hidden rounded-xl bg-foreground/[0.04] shadow-[inset_0_0_0_1px_var(--border)]">
										<img
											src={shot.src}
											alt={shot.alt ?? ""}
											width={shot.width}
											height={shot.height}
											loading="lazy"
											decoding="async"
											className={tall ? "mx-auto h-auto max-h-96 w-auto" : "block h-auto w-full"}
										/>
									</div>
									<figcaption className="mt-1.5 text-muted-foreground text-xs">
										{shot.caption}
									</figcaption>
								</figure>
							);
						})}
					</div>
				</section>
			)}
		</article>
	);
}
