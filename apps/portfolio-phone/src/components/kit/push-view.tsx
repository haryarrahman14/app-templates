import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Push navigation inside an app: the detail slides in from the right over its list,
 * and slides back out on back. `viewKey` changes whenever the visible screen changes.
 */
export function PushView({
	viewKey,
	depth,
	children,
}: {
	viewKey: string;
	depth: number;
	children: ReactNode;
}) {
	return (
		<div className="absolute inset-0 overflow-hidden">
			<AnimatePresence initial={false} custom={depth}>
				<motion.div
					key={viewKey}
					custom={depth}
					className="absolute inset-0"
					variants={{
						enter: (d: number) => ({ x: d > 0 ? "100%" : "-28%", opacity: d > 0 ? 1 : 0.6 }),
						center: { x: 0, opacity: 1 },
						exit: (d: number) => ({ x: d > 0 ? "-28%" : "100%", opacity: d > 0 ? 0.6 : 1 }),
					}}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{ duration: 0.36, ease: EASE }}
					style={{ zIndex: depth }}
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
