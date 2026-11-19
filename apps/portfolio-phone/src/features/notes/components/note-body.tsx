import Markdown, { type Components } from "react-markdown";

/** Typographic styles for the owner's Markdown notes. */
const components: Components = {
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
	img: ({ src, alt }) => (
		<img
			src={typeof src === "string" ? src : undefined}
			alt={alt ?? ""}
			loading="lazy"
			className="my-4 w-full rounded-xl bg-foreground/[0.04]"
		/>
	),
};

export function NoteBody({ markdown }: { markdown: string }) {
	return <Markdown components={components}>{markdown}</Markdown>;
}
