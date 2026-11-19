import { cn } from "@repo/ui/lib/cn";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, Suspense, useEffect } from "react";
import { APPS, type AppId } from "@/lib/apps";
import { getLaunchOrigin, usePhoneNav } from "@/lib/phone-nav";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * The open app, full-screen inside the phone. It zooms out of the icon that launched it,
 * and back into the home screen on close. Escape goes back one level; the home indicator
 * (tap, or swipe it up) goes home.
 */
export function AppLayer({
	renderApp,
	enabled,
}: {
	renderApp: (app: AppId) => ReactNode;
	enabled: boolean;
}) {
	const nav = usePhoneNav();
	const reduced = useReducedMotion();
	const app = enabled ? nav.app : undefined;

	useEffect(() => {
		if (!app) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key !== "Escape" || event.defaultPrevented) return;
			const target = event.target as HTMLElement;
			if (target.closest("input, textarea")) {
				target.blur();
				return;
			}
			if (document.querySelector("[role=menu], [role=dialog][data-state=open]")) return;
			nav.back();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [app, nav.back]);

	const origin = getLaunchOrigin();
	const hidden = reduced
		? { opacity: 0 }
		: { opacity: 0, scale: 0.16, borderRadius: 60, filter: "blur(2px)" };

	return (
		<AnimatePresence>
			{app ? (
				<motion.section
					key={app}
					aria-label={APPS[app].label}
					className="absolute inset-0 z-20 overflow-hidden bg-(--grouped) text-foreground"
					style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
					initial={hidden}
					animate={{ opacity: 1, scale: 1, borderRadius: 0, filter: "blur(0px)" }}
					exit={hidden}
					transition={{ duration: reduced ? 0.15 : 0.42, ease: EASE }}
				>
					<Suspense fallback={null}>{renderApp(app)}</Suspense>
					<HomeIndicator onHome={nav.home} light={app === "photos" && Boolean(nav.id)} />
				</motion.section>
			) : null}
		</AnimatePresence>
	);
}

function HomeIndicator({ onHome, light }: { onHome: () => void; light: boolean }) {
	return (
		<motion.button
			type="button"
			aria-label="Go to home screen"
			title="Home (Esc goes back)"
			onClick={onHome}
			drag="y"
			dragConstraints={{ top: 0, bottom: 0 }}
			dragElastic={{ top: 0.4, bottom: 0 }}
			onDragEnd={(_, info) => {
				if (info.offset.y < -24 || info.velocity.y < -300) onHome();
			}}
			className="group absolute inset-x-0 bottom-0 z-40 mx-auto flex h-(--home-h) w-[180px] cursor-pointer touch-none items-end justify-center pb-2 outline-none"
		>
			<span
				className={cn(
					"h-[5px] w-[134px] rounded-full transition-[width,background-color] group-hover:w-[150px] group-focus-visible:ring-2 group-focus-visible:ring-ring",
					light ? "bg-white/85 group-hover:bg-white" : "bg-foreground/80 group-hover:bg-foreground",
				)}
			/>
		</motion.button>
	);
}
