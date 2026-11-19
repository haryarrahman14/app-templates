import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	server: { port: 3004, strictPort: true },
	resolve: { tsconfigPaths: true },
	plugins: [
		tailwindcss(),
		// A static single-page app: the build writes one shell page and the router runs in the browser.
		// The shell is dist/client/index.html, so Cloudflare's assets-only Worker serves it for every path.
		tanstackStart({ spa: { enabled: true, prerender: { outputPath: "/index.html" } } }),
		viteReact(),
	],
});
