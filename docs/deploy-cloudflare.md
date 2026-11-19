# Previews on Cloudflare Workers, one subdomain per app

Each app becomes its own Worker with its own subdomain. A Worker claims a hostname with a custom-domain route in
its `wrangler.jsonc`; when the domain's DNS is already on Cloudflare (as `haryarrahman.tech` is), the deploy
creates the DNS record and the certificate by itself. Nothing is added by hand in the dashboard.

```jsonc
"routes": [{ "pattern": "tidewell.blog.haryarrahman.tech", "custom_domain": true }]
```

## Addresses

The previews belong to the blog, so they sit one level under it: `<app>.blog.haryarrahman.tech`. The zone's
default certificate only covers one level (`*.haryarrahman.tech`), but a Worker's custom domain gets its own
certificate, also for a hostname two levels deep, with no paid add-on
([Cloudflare docs](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)). Give a new
address a few minutes for that certificate. The one thing that blocks it: an existing CNAME record on the same
hostname.

| App | Worker name | Address |
|---|---|---|
| `portfolio-desktop` | `tpl-desktop` | `desktop.blog.haryarrahman.tech` |
| `portfolio-phone` | `tpl-phone` | `phone.blog.haryarrahman.tech` |
| `portfolio-tablet` | `tpl-tablet` | `tablet.blog.haryarrahman.tech` |
| `app-workspace` | `tpl-paperwren` | `paperwren.blog.haryarrahman.tech` |
| `app-crm` | `tpl-tidewell` | `tidewell.blog.haryarrahman.tech` |
| `app-finance` | `tpl-ledgerfinch` | `ledgerfinch.blog.haryarrahman.tech` |

Six Workers fit the Free plan (100 Workers, 100,000 requests a day shared across the account).

## What is already set up

Every app has its `wrangler.jsonc` (Worker name and custom-domain route) and two scripts:

- `preview:cf` builds for Workers and serves it locally in the Workers runtime.
- `deploy` builds for Workers and deploys.

**The three portfolios (TanStack Start)** use `@cloudflare/vite-plugin`. The plugin is switched on only when
`DEPLOY_TARGET=cloudflare` is set (the two scripts set it), so plain `dev` and `build` stay on Node.
In that build the one page is prerendered to `index.html`, so visits are served as static files and do not run
the Worker: no CPU limit and no request quota apply to them. Deep links (`?app=…`) are applied in the browser
right after the page loads.

**The three web apps (TanStack Start, SPA mode)** have no Worker script at all. Their `wrangler.jsonc` only
serves the built files in `dist/client`, and any address without a file gets the app shell
(`not_found_handling: "single-page-application"`); the router then opens the right screen in the browser. The
sample session lives in the browser too, so there is nothing to run on a server.

Checked locally in the Workers runtime (`wrangler dev` / `vite preview`), not yet on the real domain:

| App | Result |
|---|---|
| `portfolio-desktop`, `portfolio-phone`, `portfolio-tablet` | The static page, deep links and saved preferences load with a clean console |
| `app-workspace`, `app-crm`, `app-finance` | `/`, `/sign-in`, a deep record address and a nonsense address all answer 200 with the app shell; a deep link boots in the browser with a clean console; a dry-run deploy shows assets only (91, 116 and 115 files; 1.3–1.7 MB) |

## Cost

All six previews are static files. Static asset requests on Workers are free and do not count against the Free
plan's CPU limit or its 100,000 Worker requests a day.

## Deploying

Once, from any app's folder:

```bash
corepack pnpm exec wrangler login
```

All six, one after another, from the repo root:

```bash
corepack pnpm deploy:previews
```

Or one app, from its folder:

```bash
corepack pnpm run deploy
```

To deploy on every push instead, connect the repo in the dashboard (Workers → the Worker → Settings → Builds),
set the root directory to the app's folder, and the deploy command to `pnpm run deploy`. One Worker, one build
configuration; six in total.

## Things to know before going public

- The web apps keep their sample data in the visitor's browser memory. Nothing is shared between visitors and a
  reload resets it, which is what a public preview wants.
- The web apps ask for no sign-in. The sign-in screens still exist at `/sign-in` and accept any valid-looking
  input, so nobody should type a real password there.
- The three portfolios carry real profile content from `packages/content`, including the public email address.
- Add `<meta name="robots" content="noindex">` to the previews if they should not compete with the main site in
  search results.
