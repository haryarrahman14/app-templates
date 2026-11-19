import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { motion, useReducedMotion } from "motion/react";
import { Kbd } from "@/components/kit/kbd";
import { PageContainer } from "@/components/kit/page-header";
import { useShell } from "@/components/layout/shell-context";
import { docsQuery } from "@/features/documents/api/queries";
import { DocCollection } from "@/features/documents/components/doc-collection";
import { DOC_TEMPLATES } from "@/features/documents/constants/templates";
import { useNewDoc } from "@/features/documents/hooks/use-new-doc";
import { docTitle } from "@/features/documents/utils/doc-helpers";
import { formatRelative } from "@/lib/format";
import { firstNameOf } from "@/lib/session";
import { useSessionUser } from "@/lib/session-context";

function greeting() {
	const hour = new Date().getHours();
	if (hour < 5) return "Good evening";
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

export function HomePage() {
	const user = useSessionUser();
	const hello = greeting();
	const today = format(new Date(), "EEEE, MMMM d");
	const { newDoc, isPending } = useNewDoc();
	const { openPalette } = useShell();
	const docs = useQuery(docsQuery);
	const reduce = useReducedMotion();
	const recent = (docs.data ?? []).slice(0, 4);

	return (
		<PageContainer className="space-y-10">
			<motion.header
				initial={reduce ? false : { opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
				className="space-y-1"
			>
				<p className="h-5 text-muted-foreground text-sm">{today}</p>
				<h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">
					{hello}, {firstNameOf(user.name)}
				</h1>
			</motion.header>

			<section aria-labelledby="quick-actions" className="space-y-3">
				<h2 id="quick-actions" className="font-medium text-muted-foreground text-sm">
					Start something
				</h2>
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					{DOC_TEMPLATES.slice(0, 3).map((template) => (
						<button
							key={template.id}
							type="button"
							disabled={isPending}
							onClick={() => newDoc({ templateId: template.id })}
							className="group flex flex-col items-start gap-3 rounded-2xl border bg-card p-4 text-left shadow-soft outline-none transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-float focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 motion-reduce:hover:translate-y-0"
						>
							<span
								aria-hidden
								className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-lg"
							>
								{template.emoji}
							</span>
							<span>
								<span className="block font-medium text-sm">{template.label}</span>
								<span className="block text-muted-foreground text-xs">{template.description}</span>
							</span>
						</button>
					))}
					<button
						type="button"
						onClick={openPalette}
						className="flex flex-col items-start gap-3 rounded-2xl border border-dashed bg-transparent p-4 text-left outline-none transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring"
					>
						<span className="flex h-9 items-center gap-1">
							<Kbd>⌘</Kbd>
							<Kbd>K</Kbd>
						</span>
						<span>
							<span className="block font-medium text-sm">Search everything</span>
							<span className="block text-muted-foreground text-xs">Jump to a doc or command</span>
						</span>
					</button>
				</div>
			</section>

			<section aria-labelledby="recent" className="space-y-3">
				<h2 id="recent" className="font-medium text-muted-foreground text-sm">
					Recently edited
				</h2>
				<ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
					{docs.isPending
						? ["a", "b", "c", "d"].map((key) => (
								<li key={key}>
									<Skeleton className="h-14 rounded-xl" />
								</li>
							))
						: recent.map((doc) => (
								<li key={doc.id}>
									<Link
										to="/docs/$docId"
										params={{ docId: doc.id }}
										className="flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors hover:bg-card hover:shadow-soft focus-visible:ring-2 focus-visible:ring-ring"
									>
										<span aria-hidden className="text-xl">
											{doc.emoji}
										</span>
										<span className="min-w-0">
											<span className="block truncate font-medium text-sm">{docTitle(doc)}</span>
											<span className="block text-muted-foreground text-xs">
												{formatRelative(doc.updatedAt)}
											</span>
										</span>
									</Link>
								</li>
							))}
				</ul>
			</section>

			<section aria-labelledby="all-docs" className="space-y-4">
				<h2 id="all-docs" className="font-semibold text-xl tracking-tight">
					All documents
				</h2>
				<DocCollection />
			</section>
		</PageContainer>
	);
}
