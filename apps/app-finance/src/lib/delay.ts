/** Small artificial latency for sample queryFns, so loading states are real. Remove with a real API. */
export function sampleDelay(ms = 320) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
