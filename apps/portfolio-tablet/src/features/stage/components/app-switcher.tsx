import { Button } from "@repo/ui/components/button";
import { House, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { AppIcon } from "@/components/kit/app-icon";
import { APPS, type AppId } from "@/lib/apps";
import { swatchVar } from "@/lib/palette";

/** Overview of apps opened this session. Toggle with the status-bar button or the ` key. */
export function AppSwitcher({
	open,
	apps,
	visible,
	onOpenChange,
	onSelect,
	onRemove,
	onHome,
}: {
	open: boolean;
	apps: AppId[];
	visible: AppId[];
	onOpenChange: (open: boolean) => void;
	onSelect: (app: AppId) => void;
	onRemove: (app: AppId) => void;
	onHome: () => void;
}) {
	const firstRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const id = requestAnimationFrame(() => firstRef.current?.focus());
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				onOpenChange(false);
			}
		};
		window.addEventListener("keydown", onKey, true);
		return () => {
			cancelAnimationFrame(id);
			window.removeEventListener("keydown", onKey, true);
		};
	}, [open, onOpenChange]);

	return (
		<AnimatePresence>
			{open ? (
				<motion.div
					key="switcher"
					role="dialog"
					aria-modal="true"
					aria-label="App switcher"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.18 }}
					className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/25 px-4 backdrop-blur-2xl dark:bg-black/55"
					onClick={(e) => {
						if (e.target === e.currentTarget) onOpenChange(false);
					}}
				>
					<h2 className="mb-6 font-semibold text-[15px] text-foreground/70">
						{apps.length ? "Open apps" : "No open apps yet"}
					</h2>
					{apps.length ? (
						<ul className="scrollbar-none flex max-w-full snap-x gap-5 overflow-x-auto px-4 pt-2 pb-6">
							{apps.map((id, index) => {
								const app = APPS[id];
								return (
									<motion.li
										key={id}
										layout
										initial={{ opacity: 0, y: 24, scale: 0.92 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: -40 }}
										transition={{ type: "spring", bounce: 0.2, duration: 0.4, delay: index * 0.03 }}
										className="relative shrink-0 snap-center"
									>
										<button
											ref={index === 0 ? firstRef : undefined}
											type="button"
											onClick={() => onSelect(id)}
											className="group flex flex-col items-center gap-3 rounded-[26px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
										>
											<span className="flex items-center gap-2 font-medium text-[13.5px]">
												<AppIcon icon={app.icon} swatch={app.swatch} size="xs" />
												{app.name}
												{visible.includes(id) ? (
													<span className="rounded-full bg-tint px-1.5 py-0.5 text-[10.5px] text-tint-foreground">
														On screen
													</span>
												) : null}
											</span>
											<span className="relative flex h-40 w-56 flex-col overflow-hidden rounded-[24px] border border-black/8 bg-card shadow-float transition-transform duration-300 ease-sheet group-hover:-translate-y-1 sm:h-48 sm:w-72 dark:border-white/10">
												<span
													className="h-1/2 opacity-80"
													style={{ backgroundColor: swatchVar(app.swatch) }}
												/>
												<span className="flex flex-1 flex-col justify-center gap-1 px-4 text-left">
													<span className="font-semibold text-[15px]">{app.name}</span>
													<span className="text-[12.5px] text-muted-foreground">
														{app.description}
													</span>
												</span>
												<AppIcon
													icon={app.icon}
													swatch={app.swatch}
													size="lg"
													className="absolute top-1/2 right-4 -translate-y-1/2 ring-4 ring-background"
												/>
											</span>
										</button>
										<button
											type="button"
											aria-label={`Close ${app.name}`}
											onClick={() => onRemove(id)}
											className="glass absolute top-7 -right-2 flex size-7 items-center justify-center rounded-full shadow-soft outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring"
										>
											<X className="size-3.5" />
										</button>
									</motion.li>
								);
							})}
						</ul>
					) : (
						<p className="mb-6 max-w-xs text-center text-[14px] text-muted-foreground">
							Apps you open show up here, so you can jump between them.
						</p>
					)}
					<div className="flex items-center gap-3">
						<Button
							ref={apps.length ? undefined : firstRef}
							variant="secondary"
							onClick={onHome}
							className="glass rounded-full px-4 shadow-soft"
						>
							<House />
							Home screen
						</Button>
						<span className="hidden text-[12.5px] text-muted-foreground sm:inline">
							<kbd className="rounded border border-border bg-background/60 px-1.5 font-mono">
								`
							</kbd>{" "}
							toggles ·{" "}
							<kbd className="rounded border border-border bg-background/60 px-1.5 font-mono">
								Esc
							</kbd>{" "}
							closes
						</span>
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
