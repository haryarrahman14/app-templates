import { Clock3, Sun } from "lucide-react";
import { WidgetShell } from "@/features/widgets/components/widget-shell";
import { useNow } from "@/lib/use-now";

/** The owner's own availability line: headline and detail. */
export function AvailabilityWidget({
	availability,
	onOpen,
}: {
	availability: { label: string; detail: string };
	onOpen: () => void;
}) {
	return (
		<WidgetShell label={`${availability.label}. Contact`} onOpen={onOpen}>
			<span className="relative flex size-2">
				<span className="absolute inset-0 animate-ping rounded-full bg-cat-green opacity-60" />
				<span className="relative size-2 rounded-full bg-cat-green" />
			</span>
			<p className="mt-2 font-semibold text-[17px] leading-tight tracking-tight">
				{availability.label}
			</p>
			<p className="text-[12.5px] text-muted-foreground">{availability.detail}</p>
			<span className="mt-auto inline-flex h-8 w-fit items-center rounded-full bg-tint px-3.5 font-semibold text-[13px] text-tint-foreground shadow-soft">
				Contact
			</span>
		</WidgetShell>
	);
}

const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

function timeParts(now: Date, timeZone: string) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone,
		hour: "numeric",
		minute: "numeric",
		hourCycle: "h23",
	}).formatToParts(now);
	const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
	return { hours: get("hour"), minutes: get("minute") };
}

/** Analog clock in the owner's time zone. Hands appear after hydration (time is client-only). */
export function ClockWidget({
	city,
	timeZone,
	onOpen,
}: {
	city: string;
	timeZone: string;
	onOpen: () => void;
}) {
	const now = useNow();
	const t = now ? timeParts(now, timeZone) : null;
	const hourAngle = t ? ((t.hours % 12) + t.minutes / 60) * 30 : 0;
	const minuteAngle = t ? t.minutes * 6 : 0;
	const label = t
		? `${String(t.hours).padStart(2, "0")}:${String(t.minutes).padStart(2, "0")}`
		: "--:--";
	const daytime = t ? t.hours >= 7 && t.hours < 19 : true;

	return (
		<WidgetShell
			label={`Local time in ${city}: ${label}`}
			onOpen={onOpen}
			contentClassName="items-center justify-center gap-2 p-3"
		>
			<svg viewBox="0 0 100 100" className="size-[min(5.5rem,60cqh)]" aria-hidden>
				<circle
					cx="50"
					cy="50"
					r="48"
					className="fill-background/70 stroke-border"
					strokeWidth="1"
				/>
				{TICKS.map((angle) => (
					<line
						key={angle}
						x1="50"
						y1="6"
						x2="50"
						y2={angle % 90 === 0 ? 13 : 10}
						transform={`rotate(${angle} 50 50)`}
						className="stroke-foreground/40"
						strokeWidth={angle % 90 === 0 ? 2.2 : 1.2}
						strokeLinecap="round"
					/>
				))}
				{t ? (
					<>
						<line
							x1="50"
							y1="50"
							x2="50"
							y2="27"
							transform={`rotate(${hourAngle} 50 50)`}
							className="stroke-foreground"
							strokeWidth="4"
							strokeLinecap="round"
						/>
						<line
							x1="50"
							y1="54"
							x2="50"
							y2="15"
							transform={`rotate(${minuteAngle} 50 50)`}
							className="stroke-foreground"
							strokeWidth="2.6"
							strokeLinecap="round"
						/>
					</>
				) : null}
				<circle cx="50" cy="50" r="3.2" className="fill-tint-text" />
			</svg>
			<p className="flex items-center gap-1 font-semibold text-[13px]">
				{daytime ? (
					<Sun className="size-3.5 text-cat-orange" />
				) : (
					<Clock3 className="size-3.5 text-tint-text" />
				)}
				{city}
				<span className="font-normal text-muted-foreground tabular-nums">{label}</span>
			</p>
		</WidgetShell>
	);
}
