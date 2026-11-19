import { useMemo } from "react";
import {
	type DateStyle,
	type FormatOptions,
	formatCurrency,
	formatDate,
	formatNumber,
	formatPercent,
} from "@/lib/format";
import { usePreferences } from "@/lib/preferences";

/** Formatters bound to the visitor's number format, compact setting and display currency. */
export function useFormat() {
	const { numberLocale, compactNumbers, currency } = usePreferences();
	return useMemo(() => {
		const base = { locale: numberLocale, compact: compactNumbers };
		return {
			currency: (value: number, options: FormatOptions = {}) =>
				formatCurrency(value, { ...base, currency, ...options }),
			number: (value: number, options: FormatOptions = {}) =>
				formatNumber(value, { ...base, ...options }),
			percent: (value: number, options: FormatOptions = {}) =>
				formatPercent(value, { locale: numberLocale, ...options }),
			date: (value: number | string | Date, style?: DateStyle) => formatDate(value, style),
		};
	}, [numberLocale, compactNumbers, currency]);
}

export type Formatters = ReturnType<typeof useFormat>;
