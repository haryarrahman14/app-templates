import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, LayoutGridIcon, ListIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { projectsQuery } from "@/features/projects/api/queries";
import { ProjectDetail } from "@/features/projects/components/project-detail";
import { ProjectThumb } from "@/features/projects/components/project-thumb";
import { CATEGORIES, categoryLabel } from "@/features/projects/constants/categories";
import type { ProjectCategory } from "@/features/projects/schemas/project";

type View = "grid" | "list";

/** File-browser-style window: categories on the left, grid or list on the right, detail on open. */
export function ProjectsApp() {
	const { data: projects } = useSuspenseQuery(projectsQuery);
	const [category, setCategory] = useState<ProjectCategory | "all">("all");
	const [view, setView] = useState<View>("grid");
	const [query, setQuery] = useState("");
	const [openId, setOpenId] = useState<string | null>(null);

	const opened = projects.find((project) => project.id === openId);
	const needle = query.trim().toLowerCase();
	const visible = projects.filter(
		(project) =>
			(category === "all" || project.category === category) &&
			(!needle ||
				`${project.title} ${project.tagline} ${project.stack.join(" ")}`
					.toLowerCase()
					.includes(needle)),
	);
	const currentLabel = CATEGORIES.find((c) => c.id === category)?.label ?? "Projects";

	return (
		<div className="flex h-full">
			<nav
				aria-label="Project categories"
				className="hidden w-52 shrink-0 flex-col gap-0.5 border-foreground/5 border-r bg-foreground/[0.025] p-3 md:flex"
			>
				<p className="px-2 pt-1 pb-2 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
					Library
				</p>
				{CATEGORIES.map((item) => {
					const count =
						item.id === "all"
							? projects.length
							: projects.filter((p) => p.category === item.id).length;
					return (
						<button
							key={item.id}
							type="button"
							onClick={() => {
								setCategory(item.id);
								setOpenId(null);
							}}
							className={cn(
								"flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
								category === item.id
									? "bg-tint/12 font-medium text-tint-text"
									: "text-foreground/80 hover:bg-foreground/5",
							)}
						>
							<item.icon className="size-4 shrink-0" />
							<span className="flex-1 truncate">{item.label}</span>
							<span className="text-muted-foreground text-xs tabular-nums">{count}</span>
						</button>
					);
				})}
			</nav>

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex h-12 shrink-0 items-center gap-2 border-foreground/5 border-b px-3">
					<button
						type="button"
						aria-label="Back to list"
						disabled={!opened}
						onClick={() => setOpenId(null)}
						className="flex size-8 items-center justify-center rounded-lg text-foreground/70 transition-colors enabled:hover:bg-foreground/5 disabled:opacity-30"
					>
						<ChevronLeftIcon className="size-5" />
					</button>
					<p className="min-w-0 flex-1 truncate font-medium text-sm">
						{opened?.title ?? currentLabel}
					</p>
					{!opened && (
						<>
							<label className="relative hidden sm:block">
								<span className="sr-only">Search projects</span>
								<SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
								<input
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder="Search"
									className="h-8 w-40 rounded-lg bg-foreground/5 pr-2 pl-8 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
								/>
							</label>
							<fieldset className="flex rounded-lg bg-foreground/5 p-0.5">
								<legend className="sr-only">View</legend>
								{(
									[
										["grid", LayoutGridIcon, "Grid view"],
										["list", ListIcon, "List view"],
									] as const
								).map(([value, Icon, label]) => (
									<button
										key={value}
										type="button"
										aria-label={label}
										aria-pressed={view === value}
										onClick={() => setView(value)}
										className={cn(
											"flex size-7 items-center justify-center rounded-md transition-colors",
											view === value
												? "bg-background text-foreground shadow-soft"
												: "text-muted-foreground",
										)}
									>
										<Icon className="size-4" />
									</button>
								))}
							</fieldset>
						</>
					)}
				</div>

				{!opened && (
					<div className="flex gap-1.5 overflow-x-auto border-foreground/5 border-b px-3 py-2 md:hidden">
						{CATEGORIES.map((item) => (
							<button
								key={item.id}
								type="button"
								onClick={() => setCategory(item.id)}
								className={cn(
									"shrink-0 rounded-full px-3 py-1 text-sm",
									category === item.id ? "bg-tint text-tint-foreground" : "bg-foreground/5",
								)}
							>
								{item.label}
							</button>
						))}
					</div>
				)}

				<div className="min-h-0 flex-1 overflow-y-auto">
					{opened ? (
						<ProjectDetail project={opened} />
					) : visible.length === 0 ? (
						<p className="p-10 text-center text-muted-foreground text-sm">
							No projects match “{query}”.
						</p>
					) : view === "grid" ? (
						<ul className="grid grid-cols-2 gap-x-4 gap-y-6 p-5 sm:grid-cols-3">
							{visible.map((project) => (
								<li key={project.id}>
									<button
										type="button"
										onClick={() => setOpenId(project.id)}
										className="group flex w-full flex-col gap-2 text-left"
									>
										<ProjectThumb
											project={project}
											cover={project.gallery.find((item) => item.src)}
											className="aspect-[4/3] w-full rounded-xl shadow-soft transition-transform duration-200 group-hover:-translate-y-0.5"
										/>
										<span>
											<span className="block truncate font-medium text-sm">{project.title}</span>
											<span className="block truncate text-muted-foreground text-xs">
												{project.tagline}
											</span>
										</span>
									</button>
								</li>
							))}
						</ul>
					) : (
						<ul className="p-2">
							{visible.map((project) => (
								<li key={project.id}>
									<button
										type="button"
										onClick={() => setOpenId(project.id)}
										className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm odd:bg-foreground/[0.025] hover:bg-foreground/5"
									>
										<ProjectThumb
											project={project}
											className="size-8 shrink-0 rounded-lg text-xs [&>span:last-child]:text-base"
										/>
										<span className="min-w-0 flex-1 truncate font-medium">{project.title}</span>
										<span className="hidden w-36 truncate text-muted-foreground sm:block">
											{categoryLabel(project.category)}
										</span>
										<span className="hidden w-36 truncate text-right text-muted-foreground tabular-nums sm:block">
											{project.period}
										</span>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
