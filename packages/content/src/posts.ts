import type { Post } from "./types.ts";

/**
 * SAMPLE posts — placeholders that exist only to preview the blog's reading layout.
 * The blog itself is "coming soon"; real posts arrive with the CMS (CP2) and MCP seeding (CP3).
 * Code fences use ~~~ so the Markdown can live in template literals.
 */
export const posts: Post[] = [
	{
		slug: "postgres-full-text-search-materialized-view",
		title: "Full-text search in Postgres without a search service",
		excerpt:
			"A materialized view, a tsvector and a GIN index get you surprisingly far before you need a dedicated search engine.",
		publishedAt: "2026-10-20",
		tags: ["PostgreSQL", "Performance"],
		sample: true,
		body: `Most CRUD apps eventually grow a search box. The usual reflex is to reach for a dedicated search service, but Postgres ships with full-text search that is good enough for a long time — if you give it the right shape.

## The problem with searching across tables

Search rarely targets one table. A "find anything" box in a CRM wants companies, contacts and deals at once, and every extra \`JOIN\` with \`ILIKE '%term%'\` turns into a sequential scan.

## Flatten first, then index

A materialized view lets you precompute one row per searchable record:

~~~sql
create materialized view search_index as
select 'company' as kind, c.id, c.name as title,
       to_tsvector('simple', coalesce(c.name, '') || ' ' || coalesce(c.domain, '')) as document
from companies c
union all
select 'contact', p.id, p.full_name,
       to_tsvector('simple', coalesce(p.full_name, '') || ' ' || coalesce(p.email, ''))
from contacts p;

create index search_index_document_idx on search_index using gin (document);
create unique index search_index_pk on search_index (kind, id);
~~~

The unique index is not decoration: \`refresh materialized view concurrently\` requires one, and the concurrent refresh is what keeps reads unblocked while the view rebuilds.

## Querying it

~~~sql
select kind, id, title, ts_rank(document, query) as rank
from search_index, websearch_to_tsquery('simple', $1) as query
where document @@ query
order by rank desc
limit 20;
~~~

\`websearch_to_tsquery\` accepts the syntax people already type into search boxes — quoted phrases, \`or\`, and \`-exclusions\` — without you writing a parser.

## Keeping it fresh

A materialized view is a snapshot. There are three honest options:

1. Refresh on a schedule — every minute is fine for most back-office tools.
2. Refresh after the writes that matter, debounced.
3. Switch to a regular table maintained by triggers once staleness becomes a real complaint.

> Start with the schedule. Most "real-time" requirements turn out to mean "within a minute".

## When to move on

| Signal | What it usually means |
| --- | --- |
| Typos must still match | Add trigram similarity (\`pg_trgm\`) or move to a search engine |
| Millions of documents with heavy ranking | Consider a dedicated service |
| Search is the product, not a utility | Budget time for relevance tuning |

Until then, one view and one index is a small, boring piece of infrastructure — which is exactly what you want from search.`,
	},
	{
		slug: "designing-mcp-tools-for-agents",
		title: "Designing MCP tools that agents can actually use",
		excerpt:
			"An MCP server is an API whose main user is a language model. Small, well-named tools with honest errors beat one clever tool that does everything.",
		publishedAt: "2026-09-14",
		tags: ["AI", "MCP"],
		sample: true,
		body: `An MCP server is an API whose primary user is a language model. That changes what good design means.

## Name tools like verbs a colleague would use

\`deals_update\` and \`notes_create\` are easy to choose between. \`manage_entity\` is not. Models pick tools from their names and descriptions first, so that is where the effort goes.

## Keep each tool small

- One tool, one job.
- Inputs the model can fill in from context — identifiers it has already seen, not internal enums it has to guess.
- Outputs that include the identifier or link the next call will need.

## Return errors the model can act on

"Invalid input" sends an agent into a retry loop. "\`stage\` must be one of: lead, qualified, won, lost" gets it right on the next call.

## Put humans where mistakes are expensive

Let agents draft, score and suggest freely. Route anything that sends, deletes or bills through an approval queue, and make approving a single click.

~~~ts
type Proposal = {
  action: "send_email" | "update_deal";
  payload: unknown;
  evidence: string[]; // what the agent saw
  status: "pending" | "approved" | "rejected";
};
~~~

The evidence field matters more than it looks: reviewers approve faster when they can see why.`,
	},
	{
		slug: "reading-lighthouse-scores",
		title: "Reading a Lighthouse score without fooling yourself",
		excerpt: "Lab scores are a compass, not a speedometer. How to use them without chasing noise.",
		publishedAt: "2026-08-02",
		tags: ["Performance", "Web"],
		sample: true,
		body: `Lighthouse is the fastest way to find out a page is slow. It is also easy to misread.

## Measure the same thing every time

Run it against a production build, with the same throttling profile, at least three times, and compare medians. A single run can move by ten points without a line of code changing.

## Fix what the score is made of

The performance score is a weighted blend of a handful of metrics. Largest Contentful Paint and Total Blocking Time carry most of the weight, so that is usually where the easy points are:

- **LCP** — serve the hero image in a modern format, at the right size, and preload it.
- **TBT** — split heavy client components and defer what is not needed for the first interaction.
- **CLS** — reserve space for images and embeds before they load.

## Then check real users

Lab data tells you what *can* go wrong. Field data — Core Web Vitals from real visits — tells you what *does*. Ship the fix, then watch the field numbers for a couple of weeks before calling it done.`,
	},
];
