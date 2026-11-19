/**
 * Number, currency, percent and date formatting (Intl). Every function takes an explicit locale, and dates are
 * printed in UTC, because the sample data is anchored to a fixed UTC date and market hours (see
 * lib/sample-data/calendar.ts): every visitor sees the same strings whatever their time zone. Components read the
 * visitor's choice through `useFormat()` in `lib/use-format.ts`.
 */
export type NumberLocale = "en-US" | "de-DE" | "fr-CH" | "en-IN";

export type FormatOptions = {
	locale?: NumberLocale;
	compact?: boolean;
	signed?: boolean;
	digits?: number;
};

const cache = new Map<string, Intl.NumberFormat>();

function numberFormat(locale: string, options: Intl.NumberFormatOptions) {
	const key = `${locale}|${JSON.stringify(options)}`;
	let format = cache.get(key);
	if (!format) {
		format = new Intl.NumberFormat(locale, options);
		cache.set(key, format);
	}
	return format;
}

export function formatCurrency(value: number, options: FormatOptions & { currency?: string } = {}) {
	const { locale = "en-US", compact = false, signed = false, digits, currency = "USD" } = options;
	const big = Math.abs(value) >= 10_000;
	return numberFormat(locale, {
		style: "currency",
		currency,
		notation: compact && big ? "compact" : "standard",
		minimumFractionDigits: compact && big ? undefined : (digits ?? 2),
		maximumFractionDigits: compact && big ? 2 : (digits ?? 2),
		signDisplay: signed ? "exceptZero" : "auto",
	}).format(value);
}

export function formatNumber(value: number, options: FormatOptions = {}) {
	const { locale = "en-US", compact = false, signed = false, digits = 0 } = options;
	return numberFormat(locale, {
		notation: compact ? "compact" : "standard",
		maximumFractionDigits: compact ? 1 : digits,
		minimumFractionDigits: compact ? 0 : digits,
		signDisplay: signed ? "exceptZero" : "auto",
	}).format(value);
}

/** `value` is in percent units: 1.25 → "1.25%". */
export function formatPercent(value: number, options: FormatOptions = {}) {
	const { locale = "en-US", signed = false, digits = 2 } = options;
	return numberFormat(locale, {
		style: "percent",
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
		signDisplay: signed ? "exceptZero" : "auto",
	}).format(value / 100);
}

const dateCache = new Map<string, Intl.DateTimeFormat>();

export type DateStyle =
	| "day"
	| "short"
	| "medium"
	| "long"
	| "time"
	| "dayTime"
	| "month"
	| "weekday";

const DATE_OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
	day: { day: "numeric", month: "short" },
	short: { day: "numeric", month: "short", year: "2-digit" },
	medium: { day: "numeric", month: "short", year: "numeric" },
	long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
	time: { hour: "2-digit", minute: "2-digit", hour12: false },
	dayTime: { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false },
	month: { month: "short", year: "numeric" },
	weekday: { weekday: "short", day: "numeric", month: "short" },
};

export function formatDate(value: number | string | Date, style: DateStyle = "medium") {
	const key = style;
	let format = dateCache.get(key);
	if (!format) {
		format = new Intl.DateTimeFormat("en-GB", { ...DATE_OPTIONS[style], timeZone: "UTC" });
		dateCache.set(key, format);
	}
	return format.format(new Date(value));
}

/** Direction of a change, for colour + arrow. */
export function trend(value: number): "up" | "down" | "flat" {
	if (value > 0.00001) return "up";
	if (value < -0.00001) return "down";
	return "flat";
}
