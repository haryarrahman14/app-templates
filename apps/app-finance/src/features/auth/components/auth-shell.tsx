import { Link } from "@tanstack/react-router";
import { CandlestickChartIcon } from "lucide-react";
import type { ReactNode } from "react";
import { SampleChip } from "@/components/kit/sample-chip";
import { APP_NAME } from "@/lib/site";

/** Backdrop for the auth screens: a flat neutral field with a faint generated price line behind a glass card. */
export function AuthShell({
	title,
	description,
	children,
	footer,
}: {
	title: string;
	description: string;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
			<div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
				<svg
					aria-hidden
					viewBox="0 0 1200 400"
					preserveAspectRatio="none"
					className="absolute inset-x-0 bottom-0 h-[45vh] w-full text-foreground opacity-[0.06]"
				>
					<path
						d="M0 300 L60 280 L120 292 L180 250 L240 262 L300 220 L360 236 L420 200 L480 214 L540 170 L600 186 L660 150 L720 168 L780 120 L840 140 L900 104 L960 118 L1020 80 L1080 96 L1140 60 L1200 70 L1200 400 L0 400 Z"
						fill="currentColor"
						fillOpacity="0.25"
					/>
					<path
						d="M0 300 L60 280 L120 292 L180 250 L240 262 L300 220 L360 236 L420 200 L480 214 L540 170 L600 186 L660 150 L720 168 L780 120 L840 140 L900 104 L960 118 L1020 80 L1080 96 L1140 60 L1200 70"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					/>
				</svg>
			</div>

			<header className="flex items-center justify-between px-6 py-5">
				<Link to="/sign-in" className="flex items-center gap-2 font-semibold tracking-tight">
					<span className="flex size-8 items-center justify-center rounded-xl bg-tint text-tint-foreground">
						<CandlestickChartIcon aria-hidden className="size-4" />
					</span>
					{APP_NAME}
				</Link>
				<SampleChip />
			</header>

			<main className="flex flex-1 items-center justify-center px-4 pb-16">
				<div className="glass w-full max-w-[420px] rounded-3xl p-7 shadow-float sm:p-8">
					<h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
					<p className="mt-1 mb-6 text-muted-foreground text-sm">{description}</p>
					{children}
				</div>
			</main>
			{footer ? (
				<footer className="pb-8 text-center text-muted-foreground text-sm">{footer}</footer>
			) : null}
		</div>
	);
}
