import { Button } from "@repo/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Download, GraduationCap } from "lucide-react";
import { Chip, Group, GroupRow, PageBody, PageHeader } from "@/components/kit/page";
import { experienceQuery } from "@/features/experience/api/queries";
import type { Role } from "@/features/experience/schemas/experience";
import type { AppViewProps } from "@/lib/apps";

export function ExperiencePage(_: AppViewProps) {
	const { data } = useSuspenseQuery(experienceQuery);

	return (
		<div className="h-full overflow-y-auto">
			<PageBody>
				<PageHeader
					eyebrow={data.name}
					title="Experience"
					description={data.headline}
					actions={
						<Button asChild>
							<a href={data.cv.href} download={data.cv.fileName}>
								<Download />
								Download CV
							</a>
						</Button>
					}
				/>

				<ol className="relative mb-10">
					{data.roles.map((role) => (
						<li
							key={role.company + role.start}
							className="relative grid gap-x-6 pb-8 last:pb-0 @xl/pane:grid-cols-[7rem_1fr]"
						>
							<div className="mb-2 flex items-center gap-2 @xl/pane:mb-0 @xl/pane:block @xl/pane:pt-5 @xl/pane:text-right">
								<p className="font-mono text-[12.5px] text-muted-foreground">
									{role.start} – {role.end ?? "now"}
								</p>
								{!role.end ? (
									<Chip tone="tint" className="@xl/pane:mt-1.5">
										Current
									</Chip>
								) : null}
							</div>
							<RoleCard role={role} />
						</li>
					))}
				</ol>

				<Group title="Education">
					{data.education.map((e) => (
						<GroupRow
							key={e.degree}
							label={
								<span className="flex items-start gap-3">
									<GraduationCap className="mt-0.5 size-4 shrink-0 text-tint-text" />
									<span>
										<span className="block font-medium">{e.degree}</span>
										<span className="block text-[13px] text-muted-foreground">
											{e.school} · {e.years}
										</span>
									</span>
								</span>
							}
						/>
					))}
				</Group>
			</PageBody>
		</div>
	);
}

function RoleCard({ role }: { role: Role }) {
	const [latest, ...earlier] = role.positions;
	return (
		<article className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-soft">
			<h3 className="font-semibold text-[16.5px] tracking-tight">{latest?.title}</h3>
			<p className="mb-2.5 text-[13.5px] text-muted-foreground">
				{role.companyUrl ? (
					<a
						href={role.companyUrl}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-0.5 font-medium text-tint-text"
					>
						{role.company}
						<ArrowUpRight className="size-3" />
					</a>
				) : (
					role.company
				)}
				{role.location ? ` · ${role.location}` : null}
			</p>
			{earlier.length > 0 ? (
				<ul className="mb-3 space-y-0.5 text-[13px] text-muted-foreground">
					{earlier.map((p) => (
						<li key={p.title + p.start}>
							{p.title}, {p.start} – {p.end ?? "now"}
						</li>
					))}
				</ul>
			) : null}
			<p className="mb-3 text-[14.5px] text-foreground/85 leading-relaxed">{role.summary}</p>
			{role.sections.map((section) => (
				<section key={section.title} className="mb-4">
					{role.sections.length > 1 ? (
						<h4 className="mb-1 flex flex-wrap items-center gap-2 font-semibold text-[13.5px]">
							{section.title}
							{section.ongoing ? <Chip>Ongoing</Chip> : null}
						</h4>
					) : null}
					{section.subtitle ? (
						<p className="mb-1 text-[13px] text-muted-foreground">{section.subtitle}</p>
					) : null}
					<ul className="list-disc space-y-1 pl-5 text-[14px] text-foreground/80 marker:text-tint-text">
						{section.bullets.map((b) => (
							<li key={b.text}>
								{b.text}
								{b.ongoing ? <Chip className="ml-1.5 align-middle">Ongoing</Chip> : null}
							</li>
						))}
					</ul>
				</section>
			))}
			{role.clientProjects.length > 0 ? (
				<ul className="mb-4 space-y-2.5 text-[14px]">
					{role.clientProjects.map((c) => (
						<li key={c.name}>
							<p className="font-medium">{c.name}</p>
							<p className="text-[13px] text-muted-foreground">
								{[c.country, c.period].filter(Boolean).join(" · ")}
							</p>
							<p className="text-foreground/80">{c.summary}</p>
						</li>
					))}
				</ul>
			) : null}
			<div className="flex flex-wrap gap-1.5">
				{role.tags.map((tag) => (
					<Chip key={tag}>{tag}</Chip>
				))}
			</div>
		</article>
	);
}
