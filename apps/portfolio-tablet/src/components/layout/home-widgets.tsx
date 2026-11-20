import { useSuspenseQuery } from "@tanstack/react-query";
import { aboutQuery } from "@/features/about/api/queries";
import { experienceQuery } from "@/features/experience/api/queries";
import { artworksQuery } from "@/features/gallery/api/queries";
import type { WidgetSlot } from "@/features/home/types/widget-slot";
import { notebookQuery } from "@/features/notes/api/queries";
import { excerpt } from "@/features/notes/utils/excerpt";
import { sortNotes } from "@/features/notes/utils/sort-notes";
import { projectsQuery } from "@/features/projects/api/queries";
import { widgetContentQuery } from "@/features/widgets/api/queries";
import {
	ExperienceWidget,
	GalleryWidget,
	NotesStackWidget,
	SkillsWidget,
	StatsWidget,
} from "@/features/widgets/components/collection-widgets";
import { FeaturedProjectWidget, ProfileWidget } from "@/features/widgets/components/hero-widgets";
import { AvailabilityWidget, ClockWidget } from "@/features/widgets/components/small-widgets";
import type { AppId } from "@/lib/apps";
import { formatDate } from "@/lib/format";

/**
 * Wires each widget to its data and to the app it opens. The array order is the default layout
 * (tuned to pack a 6-column and a 4-column grid without gaps); visitors can reorder in edit mode.
 */
export function useHomeWidgets(open: (app: AppId, id?: string) => void): WidgetSlot[] {
	const { data: about } = useSuspenseQuery(aboutQuery);
	const { data: projects } = useSuspenseQuery(projectsQuery);
	const { data: notebook } = useSuspenseQuery(notebookQuery);
	const { data: artworks } = useSuspenseQuery(artworksQuery);
	const { data: experience } = useSuspenseQuery(experienceQuery);
	const { data: content } = useSuspenseQuery(widgetContentQuery);

	const featured = projects.find((p) => p.featured) ?? projects[0];
	// Same order as the Notes list (pinned first), so the widget's top note is the list's first.
	const recentNotes = sortNotes(notebook.notes)
		.slice(0, 3)
		.map((n) => ({
			id: n.id,
			title: n.title,
			date: n.date ? formatDate(n.date) : "",
			excerpt: n.excerpt ?? excerpt(n.body, 90),
		}));
	const roles = experience.roles.map((r) => {
		const from = r.start.slice(-4);
		const to = r.end ? r.end.slice(-4) : "now";
		return {
			company: r.company,
			title: r.positions[0]?.title ?? "",
			years: from === to ? from : `${from}–${to}`,
		};
	});

	const slots: (WidgetSlot | null)[] = [
		{
			id: "profile",
			label: "Profile",
			size: "large",
			node: (
				<ProfileWidget
					profile={about.profile}
					onOpen={() => open("about")}
					onWork={() => open("projects")}
					onContact={() => open("contact")}
				/>
			),
		},
		featured
			? {
					id: "featured",
					label: "Featured project",
					size: "large",
					node: (
						<FeaturedProjectWidget
							project={featured}
							onOpen={() => open("projects", featured.slug)}
						/>
					),
				}
			: null,
		{
			id: "availability",
			label: "Availability",
			size: "small",
			node: (
				<AvailabilityWidget availability={content.availability} onOpen={() => open("contact")} />
			),
		},
		{
			id: "clock",
			label: "Local time",
			size: "small",
			node: (
				<ClockWidget
					city={content.clock.city}
					timeZone={content.clock.timeZone}
					onOpen={() => open("contact")}
				/>
			),
		},
		{
			id: "notes",
			label: "Notes",
			size: "medium",
			node: (
				<NotesStackWidget notes={recentNotes} onOpen={() => open("notes", recentNotes[0]?.id)} />
			),
		},
		{
			id: "skills",
			label: "Skills & tools",
			size: "wide",
			node: (
				<SkillsWidget
					skills={about.skills.flatMap((g) => g.items)}
					onOpen={() => open("about", "skills")}
				/>
			),
		},
		{
			id: "experience",
			label: "Experience",
			size: "medium",
			node: <ExperienceWidget roles={roles} onOpen={() => open("experience")} />,
		},
		{
			id: "stats",
			label: "In numbers",
			size: "wide",
			node: <StatsWidget stats={content.stats} onOpen={() => open("experience")} />,
		},
		artworks.length > 0
			? {
					id: "gallery",
					label: "Gallery",
					size: "medium",
					node: <GalleryWidget items={artworks} onOpen={() => open("gallery")} />,
				}
			: null,
	];
	return slots.filter((s): s is WidgetSlot => s !== null);
}
