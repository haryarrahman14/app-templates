import { experiences } from "./experience.ts";
import { posts } from "./posts.ts";
import { skillGroups } from "./profile.ts";
import { projects } from "./projects.ts";
import type { Bullet } from "./types.ts";

export { cv } from "./cv.ts";
export { experiences } from "./experience.ts";
export { github } from "./github.ts";
export { playlist } from "./playlist.ts";
export { posts } from "./posts.ts";
export { education, keyFigures, profile, skillGroups } from "./profile.ts";
export { projects } from "./projects.ts";
export { story } from "./story.ts";
export type * from "./types.ts";
export * from "./utils/dates.ts";

export const getExperience = (slug: string) => experiences.find((e) => e.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export type Evidence = { type: "experience" | "project"; slug: string; name: string };

/** "Skills with receipts": the work `skill`'s chip links to, and every experience/project whose stack lists it. */
export function whereUsed(skill: string): Evidence[] {
	const s = skill.toLowerCase();
	const linked = skillGroups.find((g) => g.items.includes(skill))?.where[skill];
	const has = (tech: string[] = []) => tech.some((t) => t.toLowerCase() === s);
	return [
		...experiences
			.filter((e) => e.slug === linked || has(e.tech) || e.sections.some((x) => has(x.tech)))
			.map((e) => ({ type: "experience" as const, slug: e.slug, name: e.company })),
		...projects
			.filter((p) => p.slug === linked || has(p.tech))
			.map((p) => ({ type: "project" as const, slug: p.slug, name: p.name })),
	];
}

/** A bullet as its parts, plain words or not. */
export const rowOf = (b: Bullet): Exclude<Bullet, string> =>
	typeof b === "string" ? { text: b } : b;

/** A stack item's symbol id in public/stack.svg. */
export const skillSlug = (item: string) => item.toLowerCase().replace(/[^a-z0-9]+/g, "-");
