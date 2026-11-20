import { useMemo } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { NoteHeading, NotePicture } from "@/features/notes/schemas/note";

/** Typography for notes: a reading column with a serif voice for headings and quotes. */
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
	h3: ({ children }) => <h3 className="mt-7 mb-2 font-semibold text-lg">{children}</h3>,
	p: ({ children }) => <p className="my-4">{children}</p>,
	ul: ({ children }) => (
		<ul className="my-4 flex list-none flex-col gap-1.5 pl-1 [&>li]:relative [&>li]:pl-5 [&>li]:before:absolute [&>li]:before:top-[0.7em] [&>li]:before:left-0.5 [&>li]:before:size-1.5 [&>li]:before:rounded-full [&>li]:before:bg-foreground/40 [&>li]:before:content-['']">
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className="my-4 flex list-decimal flex-col gap-1.5 pl-6 marker:font-medium marker:text-muted-foreground">
			{children}
		</ol>
	),
	li: ({ children }) => <li className="pl-1">{children}</li>,
	blockquote: ({ children }) => (
		<blockquote className="my-7 border-tint border-l-2 pl-5 font-serif text-[1.15rem] text-foreground/90 italic leading-relaxed [&>p]:my-0">
			{children}
		</blockquote>
	),
	strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
	em: ({ children }) => <em className="italic">{children}</em>,
	code: ({ children }) => (
		<code className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[0.85em]">
			{children}
		</code>
	),
	pre: ({ children }) => (
		<pre className="my-5 overflow-x-auto rounded-xl bg-foreground/[0.045] p-4 font-mono text-[13px] leading-relaxed [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[1em]">
			{children}
		</pre>
	),
	a: ({ children, href }) => (
		<a
			href={href}
			target={href?.startsWith("http") ? "_blank" : undefined}
			rel="noreferrer"
			className="text-tint-text underline decoration-tint/30 underline-offset-2 hover:decoration-tint"
		>
			{children}
		</a>
	),
	hr: () => <hr className="my-8 border-foreground/10" />,
};

type NoteMarkdownProps = {
	children: string;
	/** From noteHeadings(children): gives each `##` its id, so the outline can jump to it. */
	headings: NoteHeading[];
	/** From notePictures(children): each picture opens full screen at its index. */
	pictures: NotePicture[];
	/** `from` is the picture's button, so focus can go back to it when the viewer closes. */
	onOpenPicture: (index: number, from: HTMLElement) => void;
};

export function NoteMarkdown({ children, headings, pictures, onOpenPicture }: NoteMarkdownProps) {
	const all = useMemo<Components>(
		() => ({
			...components,
			h2: ({ children: text, node }) => (
				<h2
					id={headings.find((h) => h.line === node?.position?.start.line)?.id}
					tabIndex={-1}
					className="mt-9 mb-3 scroll-mt-6 font-semibold font-serif text-[1.35rem] text-foreground tracking-tight focus:outline-none"
				>
					{text}
				</h2>
			),
			img: ({ src, alt, node }) => {
				const url = typeof src === "string" ? src : undefined;
				const line = node?.position?.start.line;
				const index = pictures.findIndex((p) => p.src === url && p.line === line);
				const picture = (
					<img
						src={url}
						alt={alt ?? ""}
						loading="lazy"
						decoding="async"
						className="h-auto w-full rounded-xl bg-foreground/[0.04]"
					/>
				);
				if (index < 0) return <span className="my-6 block">{picture}</span>;
				return (
					<button
						type="button"
						onClick={(event) => onOpenPicture(index, event.currentTarget)}
						aria-label={`Open picture ${index + 1} of ${pictures.length} full screen`}
						className="group/picture my-6 block w-full cursor-zoom-in rounded-xl outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
					>
						{picture}
					</button>
				);
			},
		}),
		[headings, pictures, onOpenPicture],
	);
	return (
		<div className="text-[15.5px] text-foreground/80 leading-[1.75]">
			<Markdown remarkPlugins={GFM} components={all}>
				{children}
			</Markdown>
		</div>
	);
}
