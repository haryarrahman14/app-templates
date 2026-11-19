import { Button } from "@repo/ui/components/button";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Floating bar shown while rows are selected. Actions are passed in by the page. */
export function BulkBar({
	count,
	onClear,
	children,
}: {
	count: number;
	onClear: () => void;
	children: ReactNode;
}) {
	const reduce = useReducedMotion();
	return (
		<AnimatePresence>
			{count > 0 ? (
				<motion.div
					role="toolbar"
					aria-label="Bulk actions"
					initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
					transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
					className="glass fixed inset-x-3 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-1.5 rounded-2xl p-1.5 pl-3 shadow-float sm:bottom-6"
				>
					<span className="mr-1 font-medium text-sm tabular-nums">{count} selected</span>
					{children}
					<Button variant="ghost" size="icon-sm" aria-label="Clear selection" onClick={onClear}>
						<X />
					</Button>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
