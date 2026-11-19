<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Market Intelligence OS rules

- Never turn an Excel hypothesis, price target, GitHub count, incubator admission or announced round into sales, demand, committed capital or revenue.
- Preserve `claim_type`, source URL, unit, country, period, observed/published/fetched dates and methodology across imports and exports.
- Keep `legacy_score` separate from evidence/build scores. Missing evidence is null, never zero.
- `demo` records must not enter real-mode queries or rankings.
- Add a fixture and parser test before enabling or changing a connector. Respect timeouts, rate limits, retry headers and source terms.
- Imports remain preview-first, size/MIME/extension validated, transaction-safe and idempotent by SHA-256.
- Neutralise spreadsheet formula prefixes in every user-controlled XLSX/CSV cell.
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` and the essential Playwright suite before claiming completion.
- Do not deploy, publish data, contact companies or add paid services without explicit user authorization.
