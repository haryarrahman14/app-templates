import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	server: { port: 3006, strictPort: true },
	resolve: { tsconfigPaths: true },
	plugins: [
		tailwindcss(),
		// Static single-page app: the build writes one app shell (the root route, no page content) as
		// dist/client/index.html. Cloudflare serves it for every address without a file (wrangler.jsonc), and
		// the router renders the page in the browser. Nothing runs on a server.
		tanstackStart({ spa: { enabled: true, prerender: { outputPath: "/index.html" } } }),
		viteReact(),
	],
});
