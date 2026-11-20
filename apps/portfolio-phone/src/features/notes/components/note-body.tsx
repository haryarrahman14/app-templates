import { useMemo, useRef } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/** Typographic styles for the owner's Markdown notes. */
/** Tables, strikethrough and task lists, as the blog writes them. */
const GFM = [remarkGfm];

const components: Components = {
	// A table scrolls sideways inside its own box, so a wide one never pushes the page (remark-gfm reads it).
	table: ({ children }) => (
		<div className="my-5 overflow-x-auto rounded-xl border border-border">
			<table className="w-full border-collapse text-left text-[0.9em]">{children}</table>
		</div>
	),
	th: ({ children }) => (
		<th className="border-border border-b bg-foreground/[0.04] px-3 py-2 font-semibold whitespace-nowrap">
			{children}
		</th>
	),
	td: ({ children }) => (
		<td className="border-border border-b px-3 py-2 align-top [tr:last-child>&]:border-b-0">
			{children}
		</td>
	),
	p: ({ children }) => <p className="my-3.5 text-[16px] leading-[1.65]">{children}</p>,
	h2: ({ children }) => (
		<h2 className="mt-8 mb-1 font-semibold text-[19px] tracking-tight">{children}</h2>
	),
	h3: ({ children }) => <h3 className="mt-6 mb-1 font-semibold text-[16px]">{children}</h3>,
	strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
	em: ({ children }) => <em className="text-foreground/90 italic">{children}</em>,
	a: ({ children, href }) => (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className="text-tint-text underline decoration-tint/30 underline-offset-2"
		>
			{children}
		</a>
	),
	ul: ({ children }) => (
		<ul className="my-3.5 flex list-disc flex-col gap-1.5 pl-5 text-[16px] leading-relaxed marker:text-tint-text">
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className="my-3.5 flex list-decimal flex-col gap-1.5 pl-5 text-[16px] leading-relaxed marker:font-semibold marker:text-tint-text">
			{children}
		</ol>
	),
	blockquote: ({ children }) => (
		<blockquote className="my-5 rounded-r-xl border-tint border-l-[3px] bg-tint/[0.07] py-1 pr-4 pl-4 font-medium text-[17px] [&_p]:my-2 [&_p]:text-[17px] [&_p]:leading-snug">
			{children}
		</blockquote>
	),
	pre: ({ children }) => (
		<pre className="my-4 overflow-x-auto rounded-xl bg-foreground/[0.05] px-4 py-3 font-mono text-[13.5px] leading-relaxed">
			{children}
		</pre>
	),
	code: ({ children }) => <code className="font-mono text-[0.9em]">{children}</code>,
	hr: () => <hr className="my-6 border-(--grouped-line)" />,
};

const pictureClass = "my-4 block w-full rounded-xl bg-foreground/[0.04]";

/**
 * A note's Markdown. Pictures are buttons that call `onOpenPicture` with their src, so the note can
 * show them large. The component map stays the same object across renders: a new one would make
 * react-markdown remount every picture, and the one that opened the viewer would lose its focus.
 */
export function NoteBody({
	markdown,
	onOpenPicture,
}: {
	markdown: string;
	onOpenPicture?: (src: string) => void;
}) {
	const open = useRef(onOpenPicture);
	open.current = onOpenPicture;
	const zoomable = Boolean(onOpenPicture);

	const withPictures = useMemo<Components>(
		() => ({
			...components,
			img: ({ src, alt }) => {
				const url = typeof src === "string" ? src : undefined;
				const image = <img src={url} alt={alt ?? ""} loading="lazy" className={pictureClass} />;
				if (!url || !zoomable) return image;
				return (
					<button
						type="button"
						onClick={() => open.current?.(url)}
						aria-haspopup="dialog"
						aria-label={`View larger: ${alt || "picture"}`}
						className="my-4 block w-full cursor-zoom-in rounded-xl outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-(--grouped-card) active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 [&>img]:my-0"
					>
						{image}
					</button>
				);
			},
		}),
		[zoomable],
	);
	return (
		<Markdown remarkPlugins={GFM} components={withPictures}>
			{markdown}
		</Markdown>
	);
}
