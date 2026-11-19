import { useSuspenseQuery } from "@tanstack/react-query";
import { Share } from "lucide-react";
import { AppScreen } from "@/components/kit/app-screen";
import { InsetRow, InsetSection } from "@/components/kit/inset-list";
import { PushView } from "@/components/kit/push-view";
import { projectsQuery } from "@/features/projects/api/queries";
import { ProjectArt } from "@/features/projects/components/project-art";
import { ProjectDetail } from "@/features/projects/components/project-detail";
import { usePhoneNav } from "@/lib/phone-nav";
import { useShareLink } from "@/lib/share";

export function ProjectsApp() {
	const { data: projects } = useSuspenseQuery(projectsQuery);
	const nav = usePhoneNav();
	const share = useShareLink();
	const project = nav.id ? projects.find((p) => p.slug === nav.id) : undefined;
	const featured = projects.find((p) => p.featured) ?? projects[0];
	const featuredCover = featured?.gallery.find((shot) => shot.kind === "web");

	return (
		<PushView viewKey={nav.id ?? "list"} depth={nav.id ? 1 : 0}>
			{nav.id ? (
				<ProjectDetail project={project} />
			) : (
				<AppScreen
					title="Projects"
					subtitle={`${projects.length} projects · ${projects.filter((p) => p.status === "Live").length} live`}
					back={{ label: "Home", onClick: nav.back }}
					trailing={
						<button
							type="button"
							aria-label="Share this list"
							onClick={() => share("Projects", "projects")}
							className="grid size-9 place-items-center rounded-lg text-tint-text outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
						>
							<Share className="size-[19px]" />
						</button>
					}
				>
					<div className="flex flex-col gap-7">
						{featured ? (
							<button
								type="button"
								onClick={() => nav.open("projects", featured.slug)}
								className="mx-4 overflow-hidden rounded-[20px] bg-(--grouped-card) text-left shadow-[0_0_0_0.5px_var(--grouped-line)] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.985]"
							>
								{featuredCover ? (
									<img
										src={featuredCover.src}
										alt={featuredCover.alt}
										className="aspect-[16/9] w-full bg-foreground/[0.04] object-cover object-top"
									/>
								) : (
									<ProjectArt project={featured} className="h-40" />
								)}
								<div className="px-4 py-3">
									<p className="font-medium text-[12px] text-tint-text uppercase tracking-wide">
										Featured
									</p>
									<p className="font-semibold text-[17px] tracking-tight">{featured.name}</p>
									<p className="text-[13.5px] text-muted-foreground">{featured.tagline}</p>
								</div>
							</button>
						) : null}
						<InsetSection header="All work">
							{projects.map((item) => (
								<InsetRow
									key={item.slug}
									leading={<ProjectArt project={item} compact />}
									label={
										<span className="flex items-center gap-2">
											{item.name}
											{item.status !== "Completed" ? (
												<span className="rounded-full bg-tint/12 px-1.5 py-px font-semibold text-[10.5px] text-tint-text uppercase">
													{item.status}
												</span>
											) : null}
										</span>
									}
									detail={item.tagline}
									value={item.period}
									onClick={() => nav.open("projects", item.slug)}
								/>
							))}
						</InsetSection>
					</div>
				</AppScreen>
			)}
		</PushView>
	);
}
