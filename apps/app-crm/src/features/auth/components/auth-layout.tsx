import type { ReactNode } from "react";
import { APP_NAME, APP_TAGLINE } from "@/lib/site";

export function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-12">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-background"
			/>
			<div className="relative flex w-full max-w-sm flex-col gap-6">
				<div className="flex flex-col items-center gap-3 text-center">
					<span className="flex size-11 items-center justify-center rounded-[14px] bg-primary font-semibold text-lg text-primary-foreground shadow-soft">
						T
					</span>
					<div>
						<p className="font-semibold text-lg tracking-tight">{APP_NAME}</p>
						<p className="text-muted-foreground text-sm">{APP_TAGLINE}</p>
					</div>
				</div>
				<main className="rounded-2xl border bg-card p-6 shadow-soft sm:p-7">{children}</main>
				<p className="text-center text-muted-foreground text-xs">
					A sample workspace. No real accounts, no real data.
				</p>
			</div>
		</div>
	);
}

export function AuthHeading({ title, description }: { title: string; description: ReactNode }) {
	return (
		<div className="mb-5 space-y-1">
			<h1 className="font-semibold text-xl">{title}</h1>
			<p className="text-muted-foreground text-sm">{description}</p>
		</div>
	);
}
