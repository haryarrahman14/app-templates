import type { YearMonth } from "../types.ts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(ym: YearMonth): [number, number | null] {
	const [y, m] = ym.split("-").map(Number);
	return [y, m || null];
}

/** "2024-08" → "Aug 2024"; "2018" → "2018" */
export function formatYearMonth(ym: YearMonth): string {
	const [y, m] = parse(ym);
	return m ? `${MONTHS[m - 1]} ${y}` : String(y);
}

/** Inclusive month count, LinkedIn-style: Aug 2024 → Sep 2024 = 2. */
export function monthsBetween(start: YearMonth, end: YearMonth | null, now = new Date()): number {
	const [sy, sm] = parse(start);
	const [ey, em] = end ? parse(end) : [now.getUTCFullYear(), now.getUTCMonth() + 1];
	return (ey - sy) * 12 + ((em ?? 12) - (sm ?? 1)) + 1;
}

/** 20 → "1 yr 8 mos" */
export function formatDuration(months: number): string {
	const y = Math.floor(months / 12);
	const m = months % 12;
	const parts: string[] = [];
	if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
	if (m) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
	return parts.join(" ");
}

/** Whole years since `start`, e.g. 5 → render as "5+ years". */
export function yearsSince(start: YearMonth, now = new Date()): number {
	return Math.floor(monthsBetween(start, null, now) / 12);
}

/** "2026-10-20" → "20 Oct 2026" (UTC, so server and client render the same string). */
export function formatDate(iso: string): string {
	const d = new Date(`${iso}T00:00:00Z`);
	return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function readingMinutes(markdown: string): number {
	return Math.max(1, Math.round(markdown.split(/\s+/).length / 220));
}
