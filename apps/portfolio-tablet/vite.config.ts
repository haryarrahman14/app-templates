import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The Workers build is opt-in (`pnpm run deploy` / `preview:cf` set DEPLOY_TARGET), so plain dev and build stay on Node.
const onCloudflare = process.env.DEPLOY_TARGET === "cloudflare";

export default defineConfig({
	server: { port: 3003, strictPort: true },
	resolve: { tsconfigPaths: true },
	// Tells the app its HTML is the one prerendered page for bare `/` (see lib/site.ts, PRERENDERED).
	define: { "import.meta.env.PRERENDERED": JSON.stringify(onCloudflare) },
	plugins: [
		...(onCloudflare ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
		tailwindcss(),
		// On Workers the one page is written as a file at build time, so visits are served as static assets and
		// never run the Worker. Links are not crawled: they are the same page with other search params.
		tanstackStart({ prerender: { enabled: onCloudflare, crawlLinks: false } }),
		viteReact(),
	],
});
