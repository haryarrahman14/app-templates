import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronUp, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { AppTile } from "@/components/kit/app-tile";
import { lockNotificationsQuery } from "@/features/lock-screen/api/queries";
import { APPS, type AppId } from "@/lib/apps";
import { formatLongDate, formatTime, useNow } from "@/lib/use-now";

type Props = {
	owner: { name: string; headline: string };
	/** Unlock, optionally straight into an app. */
	onUnlock: (target?: { app: AppId; id?: string }) => void;
};

export function LockScreen({ owner, onUnlock }: Props) {
	const { data: notifications } = useSuspenseQuery(lockNotificationsQuery);
	const now = useNow();
	const dragged = useRef(false);

	return (
		<motion.div
			data-lock-screen
			role="dialog"
			aria-label="Lock screen"
			className="wallpaper absolute inset-0 z-[45] flex touch-none select-none flex-col items-center text-on-wall"
			initial={false}
			exit={{ y: "-100%", opacity: 0.4, transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } }}
			drag="y"
			dragConstraints={{ top: 0, bottom: 0 }}
			dragElastic={{ top: 0.7, bottom: 0.05 }}
			onDragStart={() => {
				dragged.current = true;
			}}
			onDragEnd={(_, info) => {
				setTimeout(() => {
					dragged.current = false;
				}, 50);
				if (info.offset.y < -90 || info.velocity.y < -500) onUnlock();
			}}
		>
			<div className="flex flex-col items-center pt-[calc(var(--status-h)+0.75rem)]">
				<Lock className="size-4 opacity-90" strokeWidth={2.4} />
				<p className="mt-3 font-medium text-[17px] tracking-tight opacity-95">
					{now ? formatLongDate(now) : "\u00a0"}
				</p>
				<p className="font-semibold text-[clamp(72px,26cqw,104px)] leading-[0.95] tracking-[-0.04em] tabular-nums opacity-95 [font-feature-settings:'ss01']">
					{now ? formatTime(now) : "\u00a0"}
				</p>
				{/* Two lines, so a long headline never runs from one edge of the phone to the other. */}
				<p className="mt-3 text-balance px-8 text-center text-[13px] leading-snug opacity-85">
					<span className="block font-semibold">{owner.name}</span>
					{owner.headline}
				</p>
			</div>

			<ul className="mt-auto flex w-full flex-col gap-2 px-3 pb-6" aria-label="Notifications">
				{notifications.map((item, index) => {
					const app = APPS[item.app];
					return (
						<motion.li
							key={item.id}
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.15 + index * 0.08, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
						>
							<button
								type="button"
								onClick={() => {
									if (!dragged.current) onUnlock({ app: item.app, id: item.itemId });
								}}
								className="flex w-full items-start gap-3 rounded-[22px] border border-(--wall-card-border) bg-(--wall-card) p-3 text-left text-(--wall-card-text) shadow-soft outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
							>
								<AppTile icon={app.icon} color={app.color} size={38} />
								<span className="min-w-0 flex-1">
									<span className="flex items-baseline justify-between gap-2">
										<span className="truncate font-semibold text-[14.5px]">{item.title}</span>
										{item.time ? (
											<span className="shrink-0 text-[12px] opacity-75">{item.time}</span>
										) : null}
									</span>
									<span className="line-clamp-2 text-[13.5px] leading-snug opacity-90">
										{item.body}
									</span>
								</span>
							</button>
						</motion.li>
					);
				})}
			</ul>

			<button
				type="button"
				onClick={() => {
					if (!dragged.current) onUnlock();
				}}
				className="group mb-[calc(var(--home-h)-10px)] flex flex-col items-center gap-1 rounded-full px-5 py-2 font-medium text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-on-wall/70"
			>
				<motion.span
					animate={{ y: [0, -4, 0] }}
					transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
				>
					<ChevronUp className="size-5" strokeWidth={2.6} />
				</motion.span>
				<span className="opacity-90">Swipe up or tap to unlock</span>
				<span className="mt-2 h-[5px] w-[134px] rounded-full bg-on-wall/90" />
			</button>
		</motion.div>
	);
}
