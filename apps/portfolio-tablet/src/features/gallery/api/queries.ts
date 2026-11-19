import { experiences, projects, type Shot } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Artwork, artworkSchema } from "@/features/gallery/schemas/artwork";
import { shotOf } from "@/lib/proof";

/** Every screenshot in `@repo/content` (experiences, their sections, projects), in the record's order. */
async function listArtworks() {
	const groups: { source: string; shots: Shot[] }[] = [
		...experiences.flatMap((e) => [
			{ source: e.company, shots: e.gallery ?? [] },
			...e.sections.map((s) => ({ source: `${e.company} · ${s.title}`, shots: s.gallery ?? [] })),
		]),
		...projects.map((p) => ({ source: p.name, shots: p.gallery ?? [] })),
	];
	const seen = new Set<string>();
	const artworks: Artwork[] = groups.flatMap(({ source, shots }) =>
		shots
			.filter((shot) => !seen.has(shot.src) && seen.add(shot.src))
			.map((shot) => ({
				...shotOf(shot),
				id: shot.src
					.replace(/^\/proof\//, "")
					.replace(/\.webp$/, "")
					.replace(/[^a-z0-9]+/g, "-"),
				source,
			})),
	);
	return artworkSchema.array().parse(artworks);
}

export const artworksQuery = queryOptions({
	queryKey: ["gallery"],
	queryFn: listArtworks,
});
