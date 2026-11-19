import { cn } from "@repo/ui/lib/cn";

/**
 * Cover colours a document can use (the id is stored on the document): flat, either neutral gray or a
 * solid colour from the category set. The colours (with dark-mode versions) live in src/styles/app.css.
 */
export const DOC_COVERS = [
	{ id: "gray", name: "Gray", className: "bg-neutral-cover", check: "text-foreground" },
	{ id: "blue", name: "Blue", className: "bg-cat-blue", check: "text-white" },
	{ id: "teal", name: "Teal", className: "bg-cat-teal", check: "text-white" },
	{ id: "green", name: "Green", className: "bg-cat-green", check: "text-white" },
	{ id: "yellow", name: "Yellow", className: "bg-cat-yellow", check: "text-[#1a1a1a]" },
	{ id: "orange", name: "Orange", className: "bg-cat-orange", check: "text-white" },
] as const;

/** Unknown ids from older data fall back to the gray cover. */
export const docCover = (id: string) =>
	DOC_COVERS.find((cover) => cover.id === id) ?? DOC_COVERS[0];

export function DocCover({ tint, className }: { tint: string; className?: string }) {
	return <div aria-hidden className={cn("w-full", docCover(tint).className, className)} />;
}
