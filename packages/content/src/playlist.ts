import type { Track } from "./types.ts";

/**
 * My Playlist: the songs he has on repeat, in his order (8 Nov 2026). No music videos: each is the studio recording's
 * official upload with the album cover as the picture, the label's own (YouTube's "Topic" channel), and as long as the
 * recording LRCLIB has timed lines for (within the 2 s its lookup allows), so every song's lyrics follow it. Checked
 * that day: title, channel, length, embedding allowed, and LRCLIB's timed record at that length.
 */
export const playlist: Track[] = [
	{
		title: "Coming Up Roses",
		artist: "Harry Styles",
		videoId: "fO_Z9W1OEfs",
		// Harry Styles - Topic: "Provided to YouTube by Columbia", from the album. LRCLIB: 248 s, timed.
		channel: "UCVacQ2t5GUZ2t_J3Ia9BynA",
		seconds: 249,
	},
	{
		title: "Hannah Montana",
		artist: "Rex Orange County",
		videoId: "SfgNHwi4-70",
		// Rex Orange County - Topic: "Provided to YouTube by The Orchard Enterprises", from the album. LRCLIB: 213 s, timed.
		channel: "UCRI-Ds5eY70A4oeHggAFBbg",
		seconds: 213,
	},
	{
		title: "10/10",
		artist: "Rex Orange County",
		videoId: "Nu5kZIViwxs",
		// Rex Orange County - Topic: "Provided to YouTube by Rex Orange County", from Pony. LRCLIB: 146 s, timed.
		channel: "UCRI-Ds5eY70A4oeHggAFBbg",
		seconds: 146,
	},
	{
		title: "Pluto Projector",
		artist: "Rex Orange County",
		videoId: "SdKZajZ59uA",
		// Rex Orange County - Topic: "Provided to YouTube by Rex Orange County", from Pony. LRCLIB: 268 s, timed.
		channel: "UCRI-Ds5eY70A4oeHggAFBbg",
		seconds: 268,
	},
];
