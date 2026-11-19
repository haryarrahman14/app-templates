import type { ReactNode } from "react";

/**
 * A generic phone body around the screen (no brand marks, no real model). Below 640px the
 * body disappears and the screen fills the viewport, padded by the device's own safe areas.
 * The screen exposes --status-h and --home-h so apps can clear the bars.
 */
export function DeviceFrame({ children, onPower }: { children: ReactNode; onPower: () => void }) {
	return (
		<div className="fixed inset-0 sm:relative sm:inset-auto sm:h-[min(880px,calc(100dvh-3rem))] sm:min-h-[600px] sm:shrink-0 sm:aspect-[400/860]">
			{/* Side buttons */}
			<span
				aria-hidden
				className="absolute top-[17%] -left-[3px] hidden h-[6%] w-[4px] rounded-l-[3px] bg-(--frame-button) sm:block"
			/>
			<span
				aria-hidden
				className="absolute top-[25%] -left-[3px] hidden h-[6%] w-[4px] rounded-l-[3px] bg-(--frame-button) sm:block"
			/>
			<button
				type="button"
				onClick={onPower}
				aria-label="Lock the phone"
				title="Lock"
				className="absolute top-[21%] -right-[3px] hidden h-[9%] w-[4px] cursor-pointer rounded-r-[3px] bg-(--frame-button) outline-none transition-transform hover:translate-x-px focus-visible:ring-2 focus-visible:ring-ring active:-translate-x-px sm:block"
			/>

			{/* Body */}
			<div className="relative h-full w-full sm:rounded-[60px] sm:bg-(--frame) sm:p-[11px] sm:shadow-[inset_0_0_0_1.5px_#ffffff59,0_2px_4px_#00000014,0_30px_70px_-20px_#00000059] sm:dark:shadow-[inset_0_0_0_1.5px_#ffffff1a,0_30px_70px_-20px_#000000b3]">
				<div
					data-phone-screen
					className="@container relative isolate h-full w-full overflow-hidden bg-black [--home-h:calc(max(env(safe-area-inset-bottom),8px)+18px)] [--status-h:max(env(safe-area-inset-top),12px)] sm:rounded-[49px] sm:shadow-[0_0_0_3px_#0a0a0a] sm:[--home-h:30px] sm:[--status-h:52px]"
				>
					{children}
					{/* Front camera: a simple dot, no island or notch. */}
					<span
						aria-hidden
						className="pointer-events-none absolute top-[14px] left-1/2 z-50 hidden size-[11px] -translate-x-1/2 rounded-full bg-[#0a0a0a] shadow-[0_0_0_2px_#000000] sm:block"
					/>
				</div>
			</div>
		</div>
	);
}
