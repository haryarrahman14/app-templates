import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	server: { port: 3005, strictPort: true },
	resolve: { tsconfigPaths: true },
	plugins: [
		tailwindcss(),
		// A static single-page app: the build writes one shell page and nothing runs per request. The shell is
		// dist/client/index.html, which the assets-only Worker (wrangler.jsonc) serves for every address.
		tanstackStart({ spa: { enabled: true, prerender: { outputPath: "/index.html" } } }),
		viteReact(),
	],
});
