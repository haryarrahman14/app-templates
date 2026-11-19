import { cn } from "@repo/ui/lib/cn";
import ReactMarkdown, { type Components } from "react-markdown";

const components: Components = {
	h1: ({ children }) => (
		<h1 className="mt-2 mb-4 font-semibold text-[28px] leading-tight tracking-tight">{children}</h1>
	),
	h2: ({ children }) => (
		<h2 className="mt-8 mb-3 font-semibold text-[19px] leading-snug tracking-tight">{children}</h2>
	),
	h3: ({ children }) => <h3 className="mt-6 mb-2 font-semibold text-[16px]">{children}</h3>,
	p: ({ children }) => (
		<p className="my-3.5 text-[15.5px] text-foreground/85 leading-[1.75]">{children}</p>
	),
	ul: ({ children }) => (
		<ul className="my-3.5 list-disc space-y-1.5 pl-5 text-[15.5px] text-foreground/85 marker:text-tint-text">
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className="my-3.5 list-decimal space-y-1.5 pl-5 text-[15.5px] text-foreground/85 marker:text-muted-foreground">
			{children}
		</ol>
	),
	li: ({ children }) => <li className="pl-1 leading-[1.7]">{children}</li>,
	blockquote: ({ children }) => (
		<blockquote className="my-5 border-tint border-l-[3px] pl-4 text-foreground/75 italic [&_p]:text-[16.5px]">
			{children}
		</blockquote>
	),
	a: ({ children, href }) => (
		<a
			href={href}
			className="font-medium text-tint-text underline decoration-tint-text/30 underline-offset-3 hover:decoration-tint-text"
			target={href?.startsWith("http") ? "_blank" : undefined}
			rel="noreferrer"
		>
			{children}
		</a>
	),
	img: ({ src, alt }) => (
		<img
			src={typeof src === "string" ? src : undefined}
			alt={alt ?? ""}
			loading="lazy"
			className="my-5 w-full rounded-xl border border-border/60 bg-secondary"
		/>
	),
	em: ({ children }) => <em className="text-foreground/70">{children}</em>,
	hr: () => <hr className="my-8 border-border" />,
	strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
	code: ({ children }) => (
		<code className="rounded-md bg-shade/6 px-1.5 py-0.5 font-mono text-[13px]">{children}</code>
	),
	pre: ({ children }) => (
		<pre className="my-4 overflow-x-auto rounded-xl bg-shade/5 p-4 font-mono text-[13px] [&_code]:bg-transparent [&_code]:p-0">
			{children}
		</pre>
	),
};

/** Renders the owner's markdown with the app's reading typography. No raw HTML. */
export function Markdown({ children, className }: { children: string; className?: string }) {
	return (
		<div className={cn("max-w-[68ch]", className)}>
			<ReactMarkdown components={components}>{children}</ReactMarkdown>
		</div>
	);
}
