import Markdown, { type Components } from "react-markdown";

/** Typography for notes: a reading column with a serif voice for headings and quotes. */
const components: Components = {
	h2: ({ children }) => (
		<h2 className="mt-9 mb-3 font-serif font-semibold text-[1.35rem] text-foreground tracking-tight">
			{children}
		</h2>
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
	img: ({ src, alt }) => (
		<img
			src={typeof src === "string" ? src : undefined}
			alt={alt ?? ""}
			loading="lazy"
			decoding="async"
			className="my-6 h-auto w-full rounded-xl bg-foreground/[0.04]"
		/>
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

export function NoteMarkdown({ children }: { children: string }) {
	return (
		<div className="text-[15.5px] text-foreground/80 leading-[1.75]">
			<Markdown components={components}>{children}</Markdown>
		</div>
	);
}
