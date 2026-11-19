import type { Shot } from "@repo/content";

/**
 * A screenshot from `@repo/content` as this app serves it: the 800px variant, copied to
 * `public/proof/<slug>/<name>-800.webp`.
 */
export function shotOf(shot: Shot) {
	return {
		src: shot.src.replace(/\.webp$/, "-800.webp"),
		alt: shot.alt,
		caption: shot.caption,
		ratio: shot.width / shot.height,
		kind: shot.kind,
	};
}
