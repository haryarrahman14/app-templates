import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/kit/brand-mark";
import { APP_NAME, APP_TAGLINE } from "@/lib/site";

/** Split layout: the form on the left, a warm product panel on the right (hidden on phones). */
export function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
			<main className="flex flex-col px-6 py-8 sm:px-12">
				<div className="flex items-center gap-2 font-semibold">
					<BrandMark />
					{APP_NAME}
				</div>
				<div className="flex flex-1 items-center justify-center py-10">
					<div className="w-full max-w-sm">{children}</div>
				</div>
				<p className="text-muted-foreground text-xs">Sample app · No real accounts are created.</p>
			</main>
			<aside
				aria-hidden
				className="relative hidden overflow-hidden bg-secondary p-12 lg:flex lg:flex-col lg:justify-between"
			>
				<p className="max-w-sm font-semibold text-3xl text-foreground/90 tracking-tight">
					{APP_TAGLINE}
				</p>
				<div className="glass mx-auto w-full max-w-md rounded-3xl p-6 shadow-float">
					<p className="mb-1 text-2xl">🌱</p>
					<p className="font-semibold text-lg">First week for new teammates</p>
					<p className="mb-4 text-muted-foreground text-sm">
						A gentle first week. Nobody ships on day one.
					</p>
					<ul className="space-y-2 text-sm">
						{[
							"Laptop, accounts and a coffee",
							"Read the handbook",
							"Sit in on two customer calls",
						].map((item, index) => (
							<li key={item} className="flex items-center gap-2">
								<span
									className={
										index === 0
											? "flex size-4 items-center justify-center rounded bg-tint text-tint-foreground"
											: "size-4 rounded border border-foreground/30"
									}
								>
									{index === 0 ? <CheckIcon className="size-3" /> : null}
								</span>
								<span className={index === 0 ? "text-muted-foreground line-through" : ""}>
									{item}
								</span>
							</li>
						))}
					</ul>
				</div>
				<p className="text-foreground/75 text-sm">
					Documents, tasks and a calendar in one quiet place.
				</p>
			</aside>
		</div>
	);
}
