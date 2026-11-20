import type { Story } from "./types.ts";

/**
 * The scroll story on the home page: from the first frontend internship to today.
 * Draft copy in Hary's voice, built only from the record. At most two short sentences a chapter: he may rewrite it.
 */
export const story: Story = {
	title: "The story so far",
	chapters: [
		{
			slug: "first-commit",
			year: "2021",
			period: "Apr 2021",
			title: "The first commit",
			body: "I was still at vocational school when Happy5 took me on as a frontend intern.",
			refs: { experiences: ["happy5"] },
		},
		{
			slug: "learning-to-ship",
			year: "2022",
			period: "Feb 2022 – Sep 2023",
			title: "Learning to ship",
			body: "I became a full frontend developer.",
			refs: { experiences: ["happy5"] },
		},
		{
			slug: "first-clients",
			year: "2022",
			period: "Sep 2022 – present",
			title: "First clients, across the sea",
			body: "A month into my degree at BINUS, I took on freelance clients in Japan and Indonesia. I built a QR attendance system for JA Hakui and a catering platform for Doi Masaru.",
			refs: { experiences: ["freelance"] },
		},
		{
			slug: "full-stack",
			year: "2023",
			period: "Oct 2023 – May 2024",
			title: "From frontend to full-stack",
			body: "At Edufund I migrated Angular apps to Next.js within three months. Then I crossed to the backend, building features in Go.",
			refs: { experiences: ["edufund"] },
		},
		{
			slug: "making-it-fast",
			year: "2024",
			period: "May – Aug 2024",
			title: "Making it fast",
			body: "At Bosshire I took Lighthouse performance from 30 to 80+ in two months. I also moved the platform to Next.js 14 and shipped a job‑fair feature.",
			refs: { experiences: ["bosshire"] },
		},
		{
			slug: "remote-australia",
			year: "2024",
			period: "Aug 2024",
			title: "Remote, to Australia",
			body: "I joined MapTrack, an Australian asset‑management company, remotely from Jakarta. Eight months later I was a Senior Software Engineer.",
			refs: { experiences: ["maptrack"] },
		},
		{
			slug: "in-parallel",
			year: "2025",
			period: "2025 – 2026",
			title: "Several things at once",
			body: "BTPN Syariah and Mycelium Network, alongside MapTrack. In my own time: Penawaranku, my thesis, and Arsip Cetak.",
			refs: {
				experiences: ["btpn-syariah", "mycelium-network"],
				projects: ["penawaranku", "arsip-cetak"],
			},
		},
		{
			slug: "today",
			year: "Now",
			period: "Today",
			title: "And that’s how I got here",
			body: "Until Nov 2026 I worked mostly on MapTrack’s app. I was also the founding engineer of BOS, the internal CRM that replaced HubSpot.",
			refs: { experiences: ["maptrack"] },
		},
	],
};
